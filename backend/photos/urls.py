# photos/urls.py

from rest_framework.routers import DefaultRouter
from .views import PhotoViewSet, ConsentRequestViewSet

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'photos', PhotoViewSet, basename='photo')
router.register(r'consent-requests', ConsentRequestViewSet, basename='consentrequest')

# The API URLs are now determined automatically by the router.
urlpatterns = router.urls