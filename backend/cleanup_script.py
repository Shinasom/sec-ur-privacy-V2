import os
import sys
import django
import shutil

# --- BOILERPLATE TO SETUP DJANGO ENVIRONMENT ---
# This is required to access your project's models and settings from a standalone script.
# It points to your project's settings file.
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()
# --- END BOILERPLATE ---

from django.conf import settings
from django.db import connection # Import for raw SQL execution
# We no longer need to import Photo since we are using raw SQL
from users.models import CustomUser

def delete_all_test_data():
    """
    A highly destructive function to delete all user data and media files.
    !!! WARNING: THIS IS FOR DEVELOPMENT AND TESTING ONLY. !!!
    """
    print("--- Starting Data Cleanup Script ---")

    try:
        # 1. Delete all Photo and ConsentRequest objects using raw SQL.
        # This bypasses the Django ORM, avoiding model-vs-database schema conflicts.
        print("[INFO] Deleting Photo and ConsentRequest data using raw SQL...")
        with connection.cursor() as cursor:
            # Using TRUNCATE is fast and also resets the ID sequence.
            # CASCADE will automatically delete rows in related tables (like photos_consentrequest).
            cursor.execute("TRUNCATE TABLE photos_photo RESTART IDENTITY CASCADE;")
        print("[SUCCESS] Deleted all Photo objects and their related Consent Requests.")


        # 2. Delete all non-superuser users to avoid locking out admins.
        users_to_delete = CustomUser.objects.filter(is_superuser=False)
        user_count = users_to_delete.count()
        if user_count > 0:
            users_to_delete.delete()
            print(f"[SUCCESS] Deleted {user_count} non-superuser user accounts.")
        else:
            print("[INFO] No non-superuser user accounts to delete.")

        # 3. Physically delete all files in the media directory.
        media_root = settings.MEDIA_ROOT
        print(f"[INFO] Target media directory: {media_root}")
        if os.path.exists(media_root) and os.path.isdir(media_root):
            shutil.rmtree(media_root)
            print(f"[SUCCESS] Physically deleted the media directory.")
        else:
            print("[INFO] Media directory does not exist, nothing to delete.")
        
        # 4. Recreate the media directory and necessary subdirectories for the NEW structure.
        print("[INFO] Recreating media directory structure...")
        os.makedirs(media_root, exist_ok=True)
        os.makedirs(os.path.join(media_root, 'photos/originals'), exist_ok=True)
        os.makedirs(os.path.join(media_root, 'photos/public'), exist_ok=True)
        os.makedirs(os.path.join(media_root, 'profile_pics'), exist_ok=True)
        print("[SUCCESS] Recreated media directory structure.")

        print("\n--- Cleanup Complete ---")

    except Exception as e:
        print(f"\n[ERROR] An error occurred during cleanup: {str(e)}")
        print("--- Script Aborted ---")

if __name__ == "__main__":
    # This confirmation step is a safety measure to prevent accidental runs.
    confirm = input("Are you sure you want to delete all photos, non-admin users, and media files? This action cannot be undone. (yes/no): ")
    if confirm.lower() == 'yes':
        delete_all_test_data()
    else:
        print("Cleanup cancelled by user.")
