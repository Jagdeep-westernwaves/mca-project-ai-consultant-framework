from rest_framework import serializers
from .models import UploadedDataset
from clients.serializers import ClientSerializer

class UploadedDatasetSerializer(serializers.ModelSerializer):
    client_detail = ClientSerializer(source='client', read_only=True)
    uploaded_by_username = serializers.CharField(source='uploaded_by.username', read_only=True)

    class Meta:
        model = UploadedDataset
        fields = (
            'id', 
            'client', 
            'client_detail', 
            'file_name', 
            'file_type', 
            'file_path', 
            'uploaded_by', 
            'uploaded_by_username', 
            'record_count', 
            'uploaded_at'
        )
        read_only_fields = ('id', 'uploaded_by', 'record_count', 'uploaded_at')
