from rest_framework import serializers
from .models import AIPrediction
from data_engine.serializers import UploadedDatasetSerializer

class AIPredictionSerializer(serializers.ModelSerializer):
    dataset_detail = UploadedDatasetSerializer(source='dataset', read_only=True)

    class Meta:
        model = AIPrediction
        fields = (
            'id', 
            'dataset', 
            'dataset_detail', 
            'prediction_type', 
            'input_parameters', 
            'prediction_results', 
            'metrics', 
            'created_at'
        )
        read_only_fields = ('id', 'created_at')
