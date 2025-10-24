from rest_framework import serializers
from .models import Photo, ConsentRequest
from users.models import CustomUser # Import CustomUser

# --- New Nested Serializers ---
# These are small, read-only serializers to represent related objects.

class UploaderInfoSerializer(serializers.ModelSerializer):
    """A simple serializer for displaying uploader info."""
    class Meta:
        model = CustomUser
        fields = ['username', 'profile_pic']

class NestedPhotoSerializer(serializers.ModelSerializer):
    """A simple serializer for displaying photo info within a consent request."""
    # We nest the uploader info inside the photo info.
    uploader = UploaderInfoSerializer(read_only=True)
    class Meta:
        model = Photo
        fields = ['id', 'public_image', 'uploader']

# --- Main Serializers ---

class PhotoSerializer(serializers.ModelSerializer):
    """Serializer for the main Photo model (for uploads and the feed)."""
    uploader = serializers.ReadOnlyField(source='uploader.username')

    class Meta:
        model = Photo
        fields = [
            'id', 'uploader', 'public_image', 'original_image', 
            'caption', 'created_at'
        ]
        read_only_fields = ['id', 'created_at', 'public_image']
        extra_kwargs = {
            'original_image': {'write_only': True, 'required': True}
        }

class ConsentRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for the ConsentRequest model.
    This is now the primary serializer for the consent page.
    """
    # This is the key change. We replace the simple photo ID with the
    # full nested photo object, which includes the uploader's details.
    photo = NestedPhotoSerializer(read_only=True)

    class Meta:
        model = ConsentRequest
        fields = [
            'id', 
            'photo', # This will now be a rich object.
            'requested_user',
            'status', 
            'bounding_box',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'photo', 'requested_user', 'bounding_box', 'created_at', 'updated_at']
from rest_framework import serializers
from .models import Photo, ConsentRequest
from users.models import CustomUser
# Import the new serializers from the interactions app
from interactions.serializers import LikeSerializer, CommentSerializer

# --- NESTED SERIALIZERS for Consent Requests ---
class UploaderInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'profile_pic']

class NestedPhotoSerializer(serializers.ModelSerializer):
    uploader = UploaderInfoSerializer(read_only=True)
    class Meta:
        model = Photo
        fields = ['id', 'public_image', 'uploader']


# --- MAIN SERIALIZERS ---

class PhotoSerializer(serializers.ModelSerializer):
    """
    Serializer for the main Photo model.
    This is the key change: we are adding nested serializers for likes and comments.
    """
    # Instead of a simple username, we'll show the full uploader object
    uploader = UploaderInfoSerializer(read_only=True)
    # These lines will include a list of all like/comment objects for each photo
    likes = LikeSerializer(many=True, read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Photo
        # Add 'likes' and 'comments' to the fields list
        fields = [
            'id', 'uploader', 'public_image', 'original_image',
            'caption', 'created_at', 'likes', 'comments'
        ]
        read_only_fields = ['id', 'created_at', 'public_image', 'likes', 'comments']
        extra_kwargs = {
            'original_image': {'write_only': True, 'required': True}
        }


class ConsentRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for the ConsentRequest model.
    """
    photo = NestedPhotoSerializer(read_only=True)

    class Meta:
        model = ConsentRequest
        fields = [
            'id',
            'photo',
            'requested_user',
            'status',
            'bounding_box',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'photo', 'requested_user', 'bounding_box', 'created_at', 'updated_at']