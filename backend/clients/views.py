from rest_framework import viewsets, permissions
from .models import Client
from .serializers import ClientSerializer
from audit_logging.utils import log_activity

class IsConsultantOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'consultant']

class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsConsultantOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Client.objects.all().order_by('-created_at')
        elif user.role == 'consultant':
            return Client.objects.filter(assigned_consultant=user).order_by('-created_at')
        elif user.role == 'client':
            if getattr(user, 'client', None):
                return Client.objects.filter(id=user.client.id).order_by('-created_at')
            return Client.objects.none()
        return Client.objects.none()

    def perform_create(self, serializer):
        if self.request.user.role == 'consultant':
            client = serializer.save(assigned_consultant=self.request.user)
        else:
            client = serializer.save()
        log_activity(
            user=self.request.user,
            action="CREATE_CLIENT",
            description=f"Created client {client.name} in industry {client.industry}",
            request=self.request
        )

    def perform_update(self, serializer):
        client = serializer.save()
        log_activity(
            user=self.request.user,
            action="UPDATE_CLIENT",
            description=f"Updated client details for {client.name}",
            request=self.request
        )

    def perform_destroy(self, instance):
        name = instance.name
        instance.delete()
        log_activity(
            user=self.request.user,
            action="DELETE_CLIENT",
            description=f"Deleted client {name}",
            request=self.request
        )
