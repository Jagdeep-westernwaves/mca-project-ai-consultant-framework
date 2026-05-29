from django.db import models
from data_engine.models import UploadedDataset

class AIPrediction(models.Model):
    PREDICTION_TYPE_CHOICES = (
        ('sales_forecast', 'Sales Forecast'),
        ('churn_risk', 'Customer Churn Risk'),
        ('risk_analysis', 'Risk Analysis'),
        ('anomaly_detection', 'Anomaly Detection'),
    )

    dataset = models.ForeignKey(
        UploadedDataset, 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True,
        related_name='predictions'
    )
    prediction_type = models.CharField(max_length=30, choices=PREDICTION_TYPE_CHOICES)
    input_parameters = models.JSONField(default=dict)
    prediction_results = models.JSONField(default=dict)
    metrics = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_prediction_type_display()} @ {self.created_at}"
