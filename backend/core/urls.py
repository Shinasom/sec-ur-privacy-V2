# core/urls.py

from django.contrib import admin
from django.urls import path, include

# Import the views from the simplejwt package
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Our App's API URLs
    path('api/', include('users.urls')),
    path('api/', include('photos.urls')),

    # JWT Token Authentication URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]