from rest_framework import serializers
from .models import Report
from clients.serializers import ClientSerializer

class ReportSerializer(serializers.ModelSerializer):
    client_detail = ClientSerializer(source='client', read_only=True)
    generated_by_username = serializers.CharField(source='generated_by.username', read_only=True)

    class Meta:
        model = Report
        fields = (
            'id', 
            'client', 
            'client_detail', 
            'title', 
            'report_type', 
            'file_path', 
            'generated_by', 
            'generated_by_username', 
            'status',
            'page_count',
            'created_at'
        )
        read_only_fields = ('id', 'generated_by', 'file_path', 'created_at', 'status', 'page_count')
