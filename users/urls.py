# users/urls.py

from rest_framework.routers import DefaultRouter
from .views import UserViewSet

# Create a router and register our viewset with it.
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

# The API URLs are now determined automatically by the router.
urlpatterns = router.urls