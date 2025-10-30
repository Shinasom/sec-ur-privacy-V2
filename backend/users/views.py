# backend/users/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CustomUser
from .serializers import CustomUserSerializer
from photos.serializers import PhotoSerializer
from .services import extract_face_encoding  # NEW IMPORT
import logging

logger = logging.getLogger('users')

class UserViewSet(viewsets.ModelViewSet):
    """
    A ViewSet for viewing and editing user instances.
    Now includes automatic face encoding extraction on profile pic upload.
    """
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        """
        Override to extract face encoding when user registers.
        """
        user = serializer.save()
        
        # Extract face encoding from profile picture
        if user.profile_pic:
            logger.info(f"Extracting face encoding for new user {user.username}")
            success = extract_face_encoding(user)
            
            if not success:
                logger.warning(f"Failed to extract face encoding for {user.username}")
                # Note: We don't fail registration, just log the issue
        else:
            logger.warning(f"User {user.username} registered without profile picture")
    
    def perform_update(self, serializer):
        """
        Override to re-extract face encoding when profile pic is updated.
        """
        # Check if profile_pic is being updated
        old_instance = self.get_object()
        old_profile_pic = old_instance.profile_pic
        
        user = serializer.save()
        new_profile_pic = user.profile_pic
        
        # If profile pic changed, re-extract encoding
        if old_profile_pic != new_profile_pic and new_profile_pic:
            logger.info(f"Profile pic changed for {user.username}, re-extracting encoding")
            extract_face_encoding(user)

    @action(detail=False, methods=['get'], url_path='profile/(?P<username>[^/.]+)')
    def profile(self, request, username=None):
        """
        Custom action to retrieve a user's profile and their uploaded photos.
        """
        try:
            user = CustomUser.objects.get(username=username)
            user_serializer = self.get_serializer(user)
            
            photos = user.uploaded_photos.all().order_by('-created_at')
            photos_serializer = PhotoSerializer(photos, many=True)

            return Response({
                'user': user_serializer.data,
                'photos': photos_serializer.data
            })
        except CustomUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
    
    @action(detail=True, methods=['post'])
    def recompute_encoding(self, request, pk=None):
        """
        Admin action to manually recompute face encoding for a user.
        Useful for debugging or if encoding fails.
        """
        user = self.get_object()
        
        # Only allow users to recompute their own encoding, or admins
        if request.user != user and not request.user.is_staff:
            return Response(
                {'error': 'Permission denied'}, 
                status=status.HTTP_403_FORBIDDEN
            )
        
        success = extract_face_encoding(user)
        
        if success:
            return Response({
                'message': 'Face encoding computed successfully',
                'status': user.encoding_status
            })
        else:
            return Response({
                'message': 'Failed to compute face encoding',
                'status': user.encoding_status,
                'hint': 'Make sure your profile picture contains a clear, front-facing photo of your face'
            }, status=status.HTTP_400_BAD_REQUEST)