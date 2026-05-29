from django.urls import path
from .views import ReportListView, ReportCreateView, ReportDownloadView

urlpatterns = [
    path('', ReportListView.as_view(), name='report_list'),
    path('generate/', ReportCreateView.as_view(), name='report_generate'),
    path('<int:pk>/download/', ReportDownloadView.as_view(), name='report_download'),
]
