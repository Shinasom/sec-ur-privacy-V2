# backend/users/admin.py

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from .models import CustomUser
from .services import extract_face_encoding

class CustomUserAdmin(UserAdmin):
    model = CustomUser
    list_display = [
        'username', 
        'email', 
        'encoding_status_display',
        'has_profile_pic',
        'is_staff', 
        'is_active'
    ]
    list_filter = ['encoding_status', 'is_staff', 'is_active']
    
    # Add face encoding fields to the admin form
    fieldsets = UserAdmin.fieldsets + (
        ('Profile & Face Recognition', {
            'fields': ('bio', 'profile_pic', 'encoding_status')
        }),
    )
    
    readonly_fields = ['encoding_status']
    
    actions = ['recompute_face_encodings']
    
    def encoding_status_display(self, obj):
        """Display encoding status with color coding"""
        colors = {
            'SUCCESS': 'green',
            'PENDING': 'orange',
            'NO_FACE': 'red',
            'ERROR': 'darkred',
        }
        color = colors.get(obj.encoding_status, 'gray')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.encoding_status
        )
    encoding_status_display.short_description = 'Face Encoding'
    
    def has_profile_pic(self, obj):
        """Show if user has uploaded a profile picture"""
        if obj.profile_pic:
            return format_html('<span style="color: green;">✓</span>')
        return format_html('<span style="color: red;">✗</span>')
    has_profile_pic.short_description = 'Profile Pic'
    
    def recompute_face_encodings(self, request, queryset):
        """Admin action to recompute encodings for selected users"""
        success_count = 0
        fail_count = 0
        
        for user in queryset:
            if extract_face_encoding(user):
                success_count += 1
            else:
                fail_count += 1
        
        self.message_user(
            request,
            f"Recomputed encodings: {success_count} successful, {fail_count} failed"
        )
    recompute_face_encodings.short_description = "Recompute face encodings for selected users"

admin.site.register(CustomUser, CustomUserAdmin)