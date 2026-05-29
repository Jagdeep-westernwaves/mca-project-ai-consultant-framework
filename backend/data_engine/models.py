from django.db import models
from django.conf import settings
from clients.models import Client

class UploadedDataset(models.Model):
    FILE_TYPE_CHOICES = (
        ('csv', 'CSV'),
        ('xlsx', 'Excel'),
        ('json', 'JSON'),
        ('pdf', 'PDF'),
    )

    client = models.ForeignKey(
        Client, 
        on_delete=models.CASCADE, 
        related_name='datasets'
    )
    file_name = models.CharField(max_length=255)
    file_type = models.CharField(max_length=10, choices=FILE_TYPE_CHOICES)
    file_path = models.FileField(upload_to='datasets/')
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.SET_NULL, 
        null=True
    )
    record_count = models.IntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file_name} for {self.client.name}"
