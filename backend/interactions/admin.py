from rest_framework.routers import DefaultRouter
from .views import LikeViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'likes', LikeViewSet, basename='like')
router.register(r'comments', CommentViewSet, basename='comment')

urlpatterns = router.urls