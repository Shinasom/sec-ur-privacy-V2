# photos/views.py

from rest_framework import viewsets, permissions
from .models import Photo, ConsentRequest
from .serializers import PhotoSerializer, ConsentRequestSerializer
from . import services # <-- Step 1: Import our new services file

class PhotoViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update`, and `destroy` actions for Photos.
    """
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    permission_classes = [permissions.IsAuthenticated]

    # Step 2: Add this new method to the class
    def perform_create(self, serializer):
        """
        This method is a hook that runs when a new photo is created via the API.
        We are overriding it to:
        1. Automatically set the uploader to the currently logged-in user.
        2. Trigger our facial recognition service.
        """
        # First, save the photo instance and set the uploader from the request
        photo_instance = serializer.save(uploader=self.request.user)
        
        # Now, call our service function with the new photo's ID
        services.process_photo_for_faces(photo_id=photo_instance.id)


class ConsentRequestViewSet(viewsets.ModelViewSet):
    """
    This viewset allows a user to view and action their consent requests.
    """
    serializer_class = ConsentRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        This is a crucial security feature.
        This view should only return a list of all the consent requests
        for the currently authenticated user. It overrides the default
        behavior of showing all objects.
        """
        user = self.request.user
        return ConsentRequest.objects.filter(requested_user=user)