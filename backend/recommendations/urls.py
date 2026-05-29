from django.urls import path
from .views import StrategicRecommendationsView, AIChatbotView

urlpatterns = [
    path('advice/', StrategicRecommendationsView.as_view(), name='advisory_recommendations'),
    path('chat/', AIChatbotView.as_view(), name='advisory_chatbot'),
]
