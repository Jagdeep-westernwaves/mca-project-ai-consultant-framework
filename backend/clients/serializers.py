from rest_framework import serializers
from .models import Client
from authentication.serializers import UserSerializer

class ClientSerializer(serializers.ModelSerializer):
    assigned_consultant_detail = UserSerializer(source='assigned_consultant', read_only=True)

    class Meta:
        model = Client
        fields = (
            'id', 
            'name', 
            'industry', 
            'annual_revenue', 
            'employee_count', 
            'assigned_consultant', 
            'assigned_consultant_detail', 
            'created_at'
        )
        read_only_fields = ('id', 'created_at')
