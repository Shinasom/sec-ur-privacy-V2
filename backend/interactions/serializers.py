from rest_framework import serializers
from .models import Like, Comment
from users.serializers import CustomUserSerializer


class LikeSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Like
        fields = ['id', 'user', 'photo', 'created_at']
        read_only_fields = ['user']


class CommentSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'photo', 'text', 'created_at']
        read_only_fields = ['user']