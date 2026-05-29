from django.urls import path
from .views import SentimentAnalysisView, FeedbackSummaryView

urlpatterns = [
    path('sentiment/', SentimentAnalysisView.as_view(), name='nlp_sentiment'),
    path('summary/', FeedbackSummaryView.as_view(), name='nlp_feedback_summary'),
]
