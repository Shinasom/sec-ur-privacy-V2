from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import viewsets
from .models import CustomUser
from .serializers import CustomUserSerializer

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
            return [AllowAny()]
        return [IsAuthenticated()]   # all other actions need auth
