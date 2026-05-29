from .models import AuditLog

def get_client_ip(request):
    if not request:
        return None
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def log_activity(user, action, description, request=None):
    ip = get_client_ip(request) if request else None
    
    # Clean up user value (ensure it's not anonymous)
    db_user = user if user and user.is_authenticated else None
    
    AuditLog.objects.create(
        user=db_user,
        action=action,
        description=description,
        ip_address=ip
    )
