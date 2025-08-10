# photos/models.py

from django.conf import settings
from django.db import models

class Photo(models.Model):
    """
    Replaces the old 'post' model.
    """
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='uploaded_photos'
    )
    image = models.ImageField(upload_to='photos/%Y/%m/%d/')
    caption = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Photo by {self.uploader.username} on {self.created_at.strftime('%Y-%m-%d')}"

class ConsentRequest(models.Model):
    """
    Replaces the old 'noti' model. This is the core of our app's logic.
    """
    class StatusChoices(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        APPROVED = 'APPROVED', 'Approved'
        DENIED = 'DENIED', 'Denied'

    photo = models.ForeignKey(Photo, on_delete=models.CASCADE, related_name='consent_requests')
    requested_user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='consent_requests_received'
    )
    status = models.CharField(max_length=10, choices=StatusChoices.choices, default=StatusChoices.PENDING)
    bounding_box = models.CharField(max_length=100) # To store the face location 'x,y,w,h'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request for {self.requested_user.username} on photo {self.photo.id} is {self.status}"