# users/models.py

from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    Our new, single, secure user model.
    It inherits username, email, password, etc., from AbstractUser.
    """
    # These fields are translated from your old 'user' model
    bio = models.TextField(blank=True)
    profile_pic = models.ImageField(upload_to='profile_pics/', null=True, blank=True)
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.',
        related_name="customuser_set",  # This is our unique name
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        help_text='Specific permissions for this user.',
        related_name="customuser_set",  # This is our unique name
        related_query_name="user",
    )
    # We will add 'accountmode' later if needed, but the default Django
    # active/staff/superuser flags handle most cases.

    def __str__(self):
        return self.username