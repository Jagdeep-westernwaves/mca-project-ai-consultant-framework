from rest_framework import generics, permissions
from .models import AuditLog
from .serializers import AuditLogSerializer

class IsConsultantOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'consultant']

class AuditLogListView(generics.ListAPIView):
    serializer_class = AuditLogSerializer
    permission_classes = (IsConsultantOrAdmin,)

    def get_queryset(self):
        # Return all logs sorted by newest first
        return AuditLog.objects.all().order_by('-created_at')
