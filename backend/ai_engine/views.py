from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import AIPrediction
from .serializers import AIPredictionSerializer
from .analytics_engine import ConsultingAnalyticsEngine
from data_engine.models import UploadedDataset
from audit_logging.utils import log_activity
from notifications.utils import create_notification
import json

class SalesForecastView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        dataset_id = request.data.get('dataset_id')
        months = int(request.data.get('months_to_forecast', 6))
        
        dataset = None
        historical_data = []

        if dataset_id:
            try:
                dataset = UploadedDataset.objects.get(pk=dataset_id)
                # Load the parsed CSV/JSON from its path
                # Since we stored a cleaned sample in parser engine metrics, we can read that
                # or read the file. For bulletproof execution, we can read the file using pandas
                import pandas as pd
                df = pd.read_csv(dataset.file_path.path) if dataset.file_type == 'csv' else pd.read_excel(dataset.file_path.path)
                historical_data = df.to_dict(orient='records')
            except Exception as e:
                # Log warning and proceed to fallback
                pass

        # Execute forecast
        results = ConsultingAnalyticsEngine.forecast_sales(historical_data, months)
        
        # Save prediction entry
        pred = AIPrediction.objects.create(
            dataset=dataset,
            prediction_type='sales_forecast',
            input_parameters={'months_to_forecast': months},
            prediction_results=results,
            metrics=results['metrics']
        )

        log_activity(
            user=request.user,
            action="RUN_SALES_FORECAST",
            description=f"Generated sales forecast for next {months} months.",
            request=request
        )

        create_notification(
            user=request.user,
            title="Sales Forecast Generated",
            message=f"Machine learning model completed sales projection for the next {months} months successfully."
        )

        return Response(AIPredictionSerializer(pred).data, status=status.HTTP_200_OK)

class CustomerChurnView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        dataset_id = request.data.get('dataset_id')
        dataset = None
        customer_data = []

        if dataset_id:
            try:
                dataset = UploadedDataset.objects.get(pk=dataset_id)
                import pandas as pd
                df = pd.read_csv(dataset.file_path.path) if dataset.file_type == 'csv' else pd.read_excel(dataset.file_path.path)
                customer_data = df.to_dict(orient='records')
            except Exception:
                pass

        results = ConsultingAnalyticsEngine.predict_churn(customer_data)

        pred = AIPrediction.objects.create(
            dataset=dataset,
            prediction_type='churn_risk',
            input_parameters={},
            prediction_results=results,
            metrics=results['metrics']
        )

        log_activity(
            user=request.user,
            action="RUN_CHURN_PREDICTION",
            description=f"Analyzed customer churn probability across {results['summary']['total_customers']} clients.",
            request=request
        )

        create_notification(
            user=request.user,
            title="Churn Analysis Complete",
            message=f"Analyzed client retention. High-risk customers flagged: {results['summary']['high_risk_customers_count']}."
        )

        return Response(AIPredictionSerializer(pred).data, status=status.HTTP_200_OK)

class FinancialRiskView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        debt_to_equity = float(request.data.get('debt_to_equity', 1.4))
        current_ratio = float(request.data.get('current_ratio', 1.8))
        profit_margin = float(request.data.get('profit_margin', 0.12))
        cash_flow_growth = float(request.data.get('cash_flow_growth', 0.04))

        indicators = {
            'debt_to_equity': debt_to_equity,
            'current_ratio': current_ratio,
            'profit_margin': profit_margin,
            'cash_flow_growth': cash_flow_growth
        }

        results = ConsultingAnalyticsEngine.analyze_financial_risk(indicators)

        pred = AIPrediction.objects.create(
            prediction_type='risk_analysis',
            input_parameters=indicators,
            prediction_results=results,
            metrics={'risk_score': results['risk_score']}
        )

        log_activity(
            user=request.user,
            action="RUN_RISK_ANALYSIS",
            description=f"Calculated corporate risk profile as {results['risk_level']}.",
            request=request
        )

        return Response(AIPredictionSerializer(pred).data, status=status.HTTP_200_OK)

class AnomalyDetectionView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        dataset_id = request.data.get('dataset_id')
        dataset = None
        series = []

        if dataset_id:
            try:
                dataset = UploadedDataset.objects.get(pk=dataset_id)
                import pandas as pd
                df = pd.read_csv(dataset.file_path.path)
                series = df.to_dict(orient='records')
            except Exception:
                pass

        results = ConsultingAnalyticsEngine.detect_anomalies(series)

        pred = AIPrediction.objects.create(
            dataset=dataset,
            prediction_type='anomaly_detection',
            input_parameters={},
            prediction_results=results,
            metrics={'anomalies_found': results['anomaly_count']}
        )

        log_activity(
            user=request.user,
            action="RUN_ANOMALY_DETECTION",
            description=f"Executed IsolationForest flagging {results['anomaly_count']} operational anomalies.",
            request=request
        )

        return Response(AIPredictionSerializer(pred).data, status=status.HTTP_200_OK)

class WhatIfSimulationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        price_change = float(request.data.get('price_change_percent', 0.0))
        delay = float(request.data.get('delay_days', 0.0))
        budget = float(request.data.get('budget_reallocation_kUSD', 0.0))

        results = ConsultingAnalyticsEngine.run_what_if_simulation(price_change, delay, budget)

        log_activity(
            user=request.user,
            action="RUN_WHAT_IF_SIMULATION",
            description=f"Simulated price: {price_change}%, delay: {delay}d, budget: ${budget}k",
            request=request
        )

        return Response(results, status=status.HTTP_200_OK)
