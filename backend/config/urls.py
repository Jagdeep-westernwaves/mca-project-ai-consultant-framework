from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('authentication.urls')),
    path('api/clients/', include('clients.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/data/', include('data_engine.urls')),
    path('api/ai/', include('ai_engine.urls')),
    path('api/nlp/', include('nlp_engine.urls')),
    path('api/notifications/', include('notifications.urls')),
    path('api/audit/', include('audit_logging.urls')),
    path('api/recommendations/', include('recommendations.urls')),
    path('api/reports/', include('reports.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
