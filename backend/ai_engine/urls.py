from django.urls import path
from .views import (
    SalesForecastView, 
    CustomerChurnView, 
    FinancialRiskView, 
    AnomalyDetectionView, 
    WhatIfSimulationView
)

urlpatterns = [
    path('forecast/', SalesForecastView.as_view(), name='ai_sales_forecast'),
    path('churn/', CustomerChurnView.as_view(), name='ai_customer_churn'),
    path('risk/', FinancialRiskView.as_view(), name='ai_financial_risk'),
    path('anomalies/', AnomalyDetectionView.as_view(), name='ai_anomalies'),
    path('simulate/', WhatIfSimulationView.as_view(), name='ai_what_if_simulation'),
]
