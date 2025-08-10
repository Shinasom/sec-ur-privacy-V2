# photos/serializers.py

from rest_framework import serializers
from .models import Photo, ConsentRequest

class PhotoSerializer(serializers.ModelSerializer):
    """
    Serializer for the Photo model.
    """
    # This is a read-only field that gets the username from the related uploader object.
    # This is useful so the frontend doesn't have to make a separate request for the user's name.
    uploader = serializers.ReadOnlyField(source='uploader.username')

    class Meta:
        model = Photo
        fields = ['id', 'uploader', 'image', 'caption', 'created_at']
        read_only_fields = ['id', 'created_at']


class ConsentRequestSerializer(serializers.ModelSerializer):
    """
    Serializer for the ConsentRequest model.
    """
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
        # The user receiving the request should not be able to change which photo or user it's for.
        read_only_fields = ['id', 'photo', 'requested_user', 'bounding_box', 'created_at', 'updated_at']