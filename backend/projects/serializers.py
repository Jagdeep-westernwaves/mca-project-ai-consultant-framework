from rest_framework import serializers
from .models import Project
from clients.serializers import ClientSerializer

class ProjectSerializer(serializers.ModelSerializer):
    client_detail = ClientSerializer(source='client', read_only=True)

    class Meta:
        model = Project
        fields = (
            'id', 
            'client', 
            'client_detail', 
            'name', 
            'description', 
            'status', 
            'start_date', 
            'end_date', 
            'budget', 
            'created_at'
        )
        read_only_fields = ('id', 'created_at')
