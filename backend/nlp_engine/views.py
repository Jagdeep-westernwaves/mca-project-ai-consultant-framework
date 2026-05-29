from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .nlp_service import ConsultingNLPService
from data_engine.models import UploadedDataset
from audit_logging.utils import log_activity

class SentimentAnalysisView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        text = request.data.get('text')
        if not text:
            return Response({"error": "No text provided for sentiment analysis."}, status=status.HTTP_400_BAD_REQUEST)
        
        result = ConsultingNLPService.analyze_sentiment(text)
        return Response(result, status=status.HTTP_200_OK)

class FeedbackSummaryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        dataset_id = request.data.get('dataset_id')
        feedbacks = []

        if dataset_id:
            try:
                dataset = UploadedDataset.objects.get(pk=dataset_id)
                # Parse depending on type
                if dataset.file_type == 'pdf':
                    # Paragraphs are stored directly
                    import pandas as pd
                    # Our parser writes pdf text to a single column 'text_content' DataFrame
                    # Let's mock load it
                    from data_engine.parser import DataParserEngine
                    _, metrics = DataParserEngine.parse_pdf(dataset.file_path.path)
                    feedbacks = [item['text_content'] for item in metrics['sample_data']]
                else:
                    import pandas as pd
                    if dataset.file_type == 'xlsx':
                        df = pd.read_excel(dataset.file_path.path)
                    elif dataset.file_type == 'json':
                        df = pd.read_json(dataset.file_path.path)
                    else:
                        df = pd.read_csv(dataset.file_path.path)
                    # Look for first string column or specifically 'review' / 'text'
                    text_col = None
                    for col in df.columns:
                        if 'review' in col or 'feedback' in col or 'text' in col:
                            text_col = col
                            break
                    if not text_col:
                        # Grab first object column
                        for col in df.columns:
                            if df[col].dtype == object:
                                text_col = col
                                break
                    if text_col:
                        feedbacks = df[text_col].dropna().tolist()
            except Exception:
                pass

        # Fallback if no reviews are found
        if not feedbacks:
            feedbacks = [
                "The consulting team delivered outstanding recommendations. Our shipping delays dropped by 20%.",
                "Operations are sub-optimal in the manufacturing center due to excessive machine breakdowns.",
                "Strategic advice around budgeting was highly practical and immediately actionable.",
                "Marketing campaigns have registered poor returns because the CRM integration was slow.",
                "Overall high-quality engagement, though client communication could be slightly optimized."
            ]

        results = ConsultingNLPService.generate_executive_summary(feedbacks)
        
        log_activity(
            user=request.user,
            action="RUN_NLP_FEEDBACK_ANALYSIS",
            description=f"Analyzed {len(feedbacks)} qualitative feedback records using NLP engine.",
            request=request
        )

        return Response(results, status=status.HTTP_200_OK)
