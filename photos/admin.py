# photos/admin.py

from django.contrib import admin
from .models import Photo, ConsentRequest

admin.site.register(Photo)
admin.site.register(ConsentRequest)