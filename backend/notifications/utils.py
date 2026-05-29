from .models import Notification

def create_notification(user, title, message):
    if user and user.is_authenticated:
        return Notification.objects.create(
            user=user,
            title=title,
            message=message
        )
    return None
