# users/views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomUser
from .serializers import CustomUserSerializer
from photos.serializers import PhotoSerializer # Import PhotoSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing user instances.
    This automatically provides `list`, `create`, `retrieve`,
    `update`, and `destroy` actions.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == "create":  # allow registration without login
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]   # all other actions need auth

    # THIS IS THE NEW ACTION TO FETCH A USER'S PROFILE AND PHOTOS
    @action(detail=False, methods=['get'], url_path='profile/(?P<username>[^/.]+)')
    def profile(self, request, username=None):
        """
        Custom action to retrieve a user's profile and their uploaded photos.
        """
        try:
            # Retrieve the user by the username provided in the URL
            user = CustomUser.objects.get(username=username)
            user_serializer = self.get_serializer(user)
            
            # Get all photos uploaded by this user, ordered by most recent
            photos = user.uploaded_photos.all().order_by('-created_at')
            # Serialize the list of photos
            photos_serializer = PhotoSerializer(photos, many=True)

            # Return a single JSON response with both user and photo data
            return Response({
                'user': user_serializer.data,
                'photos': photos_serializer.data
            })
        except CustomUser.DoesNotExist:
            # If no user is found, return a 404 error
            return Response({'error': 'User not found'}, status=404)