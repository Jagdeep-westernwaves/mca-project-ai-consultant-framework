from rest_framework import generics, status, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings
from django.http import FileResponse
from .models import Report
from .serializers import ReportSerializer
from .generator import ConsultingPDFGenerator
from clients.models import Client
from recommendations.engine import ConsultingAdvisoryEngine
from audit_logging.utils import log_activity
from notifications.utils import create_notification
import os
import time

class ReportListView(generics.ListAPIView):
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Report.objects.all().order_by('-created_at')
        elif user.role == 'consultant':
            return Report.objects.filter(client__assigned_consultant=user).order_by('-created_at')
        elif user.role == 'client':
            if getattr(user, 'client', None):
                return Report.objects.filter(client=user.client).order_by('-created_at')
            return Report.objects.none()
        return Report.objects.none()

class ReportCreateView(generics.CreateAPIView):
    serializer_class = ReportSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def create(self, request, *args, **kwargs):
        client_id = request.data.get('client')
        title = request.data.get('title')
        report_type = request.data.get('report_type', 'executive_summary')

        if not client_id or not title:
            return Response(
                {"error": "Please specify a valid client ID and a report title."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            client = Client.objects.get(pk=client_id)
        except Client.DoesNotExist:
            return Response({"error": "Specified client not found."}, status=status.HTTP_404_NOT_FOUND)

        # 1. Gather/evaluate corporate KPI indicators
        # In a real system, these are calculated from their uploaded datasets.
        # We model this beautifully:
        kpis = {
            'revenue_growth': 0.038 if client.annual_revenue > 1000000 else 0.012,
            'churn_rate': 4.2 if client.employee_count > 50 else 7.4,
            'risk_score': 5 if client.annual_revenue > 1000000 else 8,
            'sentiment_score': 0.68,
            'delay_days': 2.0
        }

        # 2. Retrieve structural strategic advisory cards
        recommendations = ConsultingAdvisoryEngine.generate_recommendations(kpis)

        # 3. Create file output destination
        reports_dir = os.path.join(settings.MEDIA_ROOT, 'reports')
        os.makedirs(reports_dir, exist_ok=True)
        
        safe_title = "".join([c if c.isalnum() else "_" for c in title])
        filename = f"report_{client.id}_{int(time.time())}_{safe_title}.pdf"
        output_filepath = os.path.join(reports_dir, filename)

        # 4. Generate the PDF
        try:
            ConsultingPDFGenerator.generate_report(
                output_path=output_filepath,
                client_name=client.name,
                report_title=title,
                report_type=report_type.replace('_', ' ').title(),
                kpis=kpis,
                recommendations=recommendations
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to render the PDF layout. Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # 5. Save the report model row (storing relative path)
        relative_path = os.path.join('reports', filename)
        pages = 1
        try:
            with open(output_filepath, 'rb') as f:
                content = f.read()
            pages = content.count(b'/Type /Page')
            if pages == 0:
                pages = 1
        except Exception:
            pages = 1

        report = Report.objects.create(
            client=client,
            title=title,
            report_type=report_type,
            file_path=relative_path,
            generated_by=request.user,
            status='Completed',
            page_count=pages
        )

        log_activity(
            user=request.user,
            action="GENERATE_REPORT",
            description=f"Generated PDF consulting report '{title}' for client {client.name}",
            request=request
        )

        create_notification(
            user=request.user,
            title="Advisory Report Rendered",
            message=f"Strategic PDF report '{title}' for {client.name} has been generated and is ready for download."
        )

        return Response(ReportSerializer(report).data, status=status.HTTP_201_CREATED)

class QueryParamJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        if header is not None:
            return super().authenticate(request)

        token = request.query_params.get('token')
        if not token:
            return None

        validated_token = self.get_validated_token(token)
        return self.get_user(validated_token), validated_token

class ReportDownloadView(generics.RetrieveAPIView):
    queryset = Report.objects.all()
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (QueryParamJWTAuthentication,)

    def retrieve(self, request, *args, **kwargs):
        try:
            report = self.get_object()
            file_path = report.file_path.path
            if os.path.exists(file_path):
                report.status = 'Downloaded'
                report.save(update_fields=['status'])
                
                response = FileResponse(open(file_path, 'rb'), content_type='application/pdf')
                response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
                return response
            else:
                return Response({"error": "PDF file not found on disk."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
