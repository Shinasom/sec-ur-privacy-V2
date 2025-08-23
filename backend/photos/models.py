from django.conf import settings
from django.db import models

class Photo(models.Model):
    """
    Replaces the old 'post' model.
    This model now supports a non-destructive image workflow.
    """
    uploader = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='uploaded_photos'
    )
    # This field stores the pristine, untouched original file.
    original_image = models.ImageField(upload_to='photos/originals/%Y/%m/%d/')
    
    # This field stores the publicly visible, masked/unmasked version.
    # It can be null initially until the processing service runs.
    public_image = models.ImageField(upload_to='photos/public/%Y/%m/%d/', null=True, blank=True)
    
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
    # Updated comment to reflect the 'left,top,right,bottom' coordinate order
    bounding_box = models.CharField(max_length=100) # To store the face location 'left,top,right,bottom'
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Request for {self.requested_user.username} on photo {self.photo.id} is {self.status}"
