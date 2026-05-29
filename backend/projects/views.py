from rest_framework import viewsets, permissions
from .models import Project
from .serializers import ProjectSerializer
from audit_logging.utils import log_activity

class IsConsultantOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role in ['admin', 'consultant']

class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    
    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsConsultantOrAdmin()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'admin':
            return Project.objects.all().order_by('-created_at')
        elif user.role == 'consultant':
            return Project.objects.filter(client__assigned_consultant=user).order_by('-created_at')
        elif user.role == 'client':
            if getattr(user, 'client', None):
                return Project.objects.filter(client=user.client).order_by('-created_at')
            return Project.objects.none()
        return Project.objects.none()

    def perform_create(self, serializer):
        project = serializer.save()
        log_activity(
            user=self.request.user,
            action="CREATE_PROJECT",
            description=f"Created project {project.name} for client {project.client.name}",
            request=self.request
        )

    def perform_update(self, serializer):
        project = serializer.save()
        log_activity(
            user=self.request.user,
            action="UPDATE_PROJECT",
            description=f"Updated project {project.name} details",
            request=self.request
        )

    def perform_destroy(self, instance):
        name = instance.name
        client_name = instance.client.name
        instance.delete()
        log_activity(
            user=self.request.user,
            action="DELETE_PROJECT",
            description=f"Deleted project {name} from client {client_name}",
            request=self.request
        )
