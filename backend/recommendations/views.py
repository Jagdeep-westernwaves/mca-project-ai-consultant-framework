from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .engine import ConsultingAdvisoryEngine
from audit_logging.utils import log_activity

from .business_health_score import BusinessHealthScore
from .swot_generator import SWOTGenerator
from .executive_summary import ExecutiveSummaryGenerator

class StrategicRecommendationsView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        kpis = request.data.get('kpis', {})
        if not kpis:
            # Provide standard baseline KPIs for demonstration
            kpis = {
                'revenue_growth': 0.015,  # 1.5%
                'churn_rate': 6.4,        # 6.4% (high)
                'risk_score': 7,          # 7 (high)
                'sentiment_score': 0.25,  # 0.25 (poor)
                'delay_days': 4.0
            }
        else:
            # Ensure delay_days is present
            if 'delay_days' not in kpis:
                kpis['delay_days'] = 2.0
        
        recommendations = ConsultingAdvisoryEngine.generate_recommendations(kpis)
        health_score_data = BusinessHealthScore.calculate_score(kpis)
        swot_data = SWOTGenerator.generate_swot(kpis)
        summary_text = ExecutiveSummaryGenerator.generate_summary(kpis, health_score_data)

        results = {
            'recommendations': recommendations,
            'health_score': health_score_data,
            'swot': swot_data,
            'executive_summary': summary_text,
            'kpis_analyzed': kpis
        }
        return Response(results, status=status.HTTP_200_OK)

from .local_ai import ConsultingLocalAI

class AIChatbotView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        query = request.data.get('query')
        context = request.data.get('context', {})

        if not query:
            return Response({"error": "Please provide a query string for the chatbot."}, status=status.HTTP_400_BAD_REQUEST)

        # Log bot interactions briefly in activity logs for administrative tracking
        log_activity(
            user=request.user,
            action="CHATBOT_QUERY",
            description=f"Asked AI Chatbot: '{query[:50]}...'",
            request=request
        )

        response_text = ConsultingLocalAI.query_local_ai(query, context)
        return Response({
            "response": response_text,
            "query": query
        }, status=status.HTTP_200_OK)
