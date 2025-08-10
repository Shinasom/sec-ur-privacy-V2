# users/serializers.py

from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    """
    Serializer for the CustomUser model.
    """
    class Meta:
        model = CustomUser
        # Fields to include in the API representation
        fields = [
            'id', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'bio', 
            'profile_pic',
            'password', # Include password field
        ]
        # Make certain fields read-only
        read_only_fields = ['id']
        # Make the password write-only for security
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        # This method is called when a new user is created.
        # We use the custom create_user method to ensure the password is hashed.
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance