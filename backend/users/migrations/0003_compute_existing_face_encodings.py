from django.db import migrations
import face_recognition
import logging

logger = logging.getLogger('users')

def compute_face_encodings(apps, schema_editor):
    """
    Data migration to compute face encodings for all existing users.
    """
    CustomUser = apps.get_model('users', 'CustomUser')
    users_with_pics = CustomUser.objects.exclude(profile_pic__in=['', None])
    total = users_with_pics.count()

    logger.info(f"Computing face encodings for {total} existing users...")

    success_count = 0
    no_face_count = 0
    error_count = 0

    for i, user in enumerate(users_with_pics, 1):
        try:
            profile_pic_path = user.profile_pic.path
            image = face_recognition.load_image_file(profile_pic_path)
            encodings = face_recognition.face_encodings(image)

            if len(encodings) == 0:
                user.encoding_status = 'NO_FACE'
                user.face_encoding = None
                no_face_count += 1
                logger.warning(f"[{i}/{total}] No face found for {user.username}")
            else:
                if len(encodings) > 1:
                    logger.warning(f"[{i}/{total}] Multiple faces for {user.username}, using first")

                user.face_encoding = encodings[0].tolist()
                user.encoding_status = 'SUCCESS'
                success_count += 1
                logger.info(f"[{i}/{total}] Success for {user.username}")

            user.save()

        except FileNotFoundError:
            user.encoding_status = 'ERROR'
            error_count += 1
            logger.error(f"[{i}/{total}] File not found for {user.username}")
            user.save()
        except Exception as e:
            user.encoding_status = 'ERROR'
            error_count += 1
            logger.error(f"[{i}/{total}] Error for {user.username}: {str(e)}")
            user.save()

    logger.info(f"Migration complete: {success_count} success, {no_face_count} no face, {error_count} errors")

def reverse_migration(apps, schema_editor):
    """
    Reverse migration: clear all face encodings
    """
    CustomUser = apps.get_model('users', 'CustomUser')
    CustomUser.objects.all().update(
        face_encoding=None,
        encoding_status='PENDING'
    )


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0002_customuser_encoding_status_customuser_face_encoding'),
    ]

    operations = [
        migrations.RunPython(compute_face_encodings, reverse_migration),
    ]
