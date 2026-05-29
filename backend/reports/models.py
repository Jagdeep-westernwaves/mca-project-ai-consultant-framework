from django.db import models
from django.conf import settings
from clients.models import Client

class Report(models.Model):
    REPORT_TYPE_CHOICES = (
        ('executive_summary', 'Executive Summary'),
        ('ai_insights', 'AI Insights Report'),
        ('full_consulting_report', 'Full Consulting Report'),
    )

    client = models.ForeignKey(
        Client, 
        on_delete=models.CASCADE, 
        related_name='reports'
    )
    title = models.CharField(max_length=255)
    report_type = models.CharField(max_length=30, choices=REPORT_TYPE_CHOICES)
    file_path = models.FileField(upload_to='reports/')
    generated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True
    )
    status = models.CharField(
        max_length=20,
        choices=(
            ('Completed', 'Completed'),
            ('Processing', 'Processing'),
            ('Failed', 'Failed'),
            ('Downloaded', 'Downloaded'),
        ),
        default='Completed'
    )
    page_count = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.client.name}"
