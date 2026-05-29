from django.db import models
from django.conf import settings

class Client(models.Model):
    name = models.CharField(max_length=255)
    industry = models.CharField(max_length=100)
    annual_revenue = models.DecimalField(max_digits=15, decimal_places=2, default=0.0)
    employee_count = models.IntegerField(default=0)
    assigned_consultant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clients'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
