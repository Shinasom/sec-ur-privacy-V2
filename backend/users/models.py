# backend/users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Our custom user model with face encoding support for optimized face recognition.
    """
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    
    # NEW: Store the face encoding as a JSON string
    # This is a 128-dimensional vector encoded as JSON array
    face_encoding = models.JSONField(null=True, blank=True, help_text="128-dimensional face encoding vector")
    
    # NEW: Track if encoding failed or succeeded
    encoding_status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),      # Not yet processed
            ('SUCCESS', 'Success'),      # Encoding saved successfully
            ('NO_FACE', 'No Face Found'), # No face detected in profile pic
            ('ERROR', 'Error'),          # Processing error
        ],
        default='PENDING',
        help_text="Status of face encoding extraction"
    )
    
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",
        related_query_name="user",
    )

    def __str__(self):
        return self.username
    
    def has_valid_face_encoding(self):
        """Check if user has a successfully computed face encoding."""
        return self.encoding_status == 'SUCCESS' and self.face_encoding is not None