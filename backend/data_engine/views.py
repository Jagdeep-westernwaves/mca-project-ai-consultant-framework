from rest_framework import generics, status, permissions
from rest_framework.response import Response
from .models import UploadedDataset
from .serializers import UploadedDatasetSerializer
from .parser import DataParserEngine
from audit_logging.utils import log_activity
from notifications.utils import create_notification
import os

class DatasetUploadView(generics.ListCreateAPIView):
    serializer_class = UploadedDatasetSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return UploadedDataset.objects.all().order_by('-uploaded_at')
        elif user.role == 'consultant':
            return UploadedDataset.objects.filter(client__assigned_consultant=user).order_by('-uploaded_at')
        elif user.role == 'client':
            if getattr(user, 'client', None):
                return UploadedDataset.objects.filter(client=user.client).order_by('-uploaded_at')
            return UploadedDataset.objects.none()
        return UploadedDataset.objects.none()

    def create(self, request, *args, **kwargs):
        client_id = request.data.get('client')
        file_obj = request.FILES.get('file_path')

        if not client_id or not file_obj:
            return Response(
                {"error": "Please provide a valid client ID and a file to upload."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Basic extension checking
        ext = os.path.splitext(file_obj.name)[1].lower().replace('.', '')
        if ext not in ['csv', 'xlsx', 'json', 'pdf']:
            return Response(
                {"error": f"Unsupported file type: {ext}. We support CSV, XLSX, JSON, and PDF files."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Save model temporarily to write file to disk
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        dataset = serializer.save(
            uploaded_by=request.user,
            file_name=file_obj.name,
            file_type=ext
        )

        file_absolute_path = dataset.file_path.path
        
        # Parse the dataset based on type
        try:
            if ext == 'csv':
                df, metrics = DataParserEngine.parse_csv(file_absolute_path)
            elif ext == 'xlsx':
                df, metrics = DataParserEngine.parse_excel(file_absolute_path)
            elif ext == 'json':
                df, metrics = DataParserEngine.parse_json(file_absolute_path)
            elif ext == 'pdf':
                df, metrics = DataParserEngine.parse_pdf(file_absolute_path)
            
            # Save final parsed records count
            dataset.record_count = metrics['cleaned_rows']
            dataset.save()

            # Logging & Notification
            log_activity(
                user=request.user,
                action="UPLOAD_DATASET",
                description=f"Uploaded and parsed file {dataset.file_name} with {dataset.record_count} records",
                request=request
            )
            create_notification(
                user=request.user,
                title="Dataset Upload Complete",
                message=f"Successfully uploaded and parsed '{dataset.file_name}' ({dataset.record_count} records)."
            )

            # Return success response with parsed metadata
            return Response({
                "dataset": self.get_serializer(dataset).data,
                "analysis_summary": metrics,
                "message": "Dataset parsed successfully."
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Delete model and file if parsing failed to keep DB clean
            dataset.file_path.delete()
            dataset.delete()
            return Response(
                {"error": f"Failed to clean and parse the file. Error: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
