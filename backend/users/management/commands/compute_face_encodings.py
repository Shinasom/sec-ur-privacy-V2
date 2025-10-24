# backend/users/management/commands/compute_face_encodings.py

from django.core.management.base import BaseCommand
from users.services import recompute_all_face_encodings, extract_face_encoding
from users.models import CustomUser

class Command(BaseCommand):
    help = 'Compute or recompute face encodings for user profile pictures'

    def add_arguments(self, parser):
        parser.add_argument(
            '--all',
            action='store_true',
            help='Recompute encodings for all users',
        )
        parser.add_argument(
            '--username',
            type=str,
            help='Compute encoding for specific user',
        )
        parser.add_argument(
            '--failed-only',
            action='store_true',
            help='Only recompute for users with ERROR or NO_FACE status',
        )

    def handle(self, *args, **options):
        if options['username']:
            # Process single user
            try:
                user = CustomUser.objects.get(username=options['username'])
                self.stdout.write(f"Processing user: {user.username}")
                
                success = extract_face_encoding(user)
                
                if success:
                    self.stdout.write(
                        self.style.SUCCESS(f"✓ Successfully computed encoding for {user.username}")
                    )
                else:
                    self.stdout.write(
                        self.style.WARNING(f"✗ Failed to compute encoding for {user.username}: {user.encoding_status}")
                    )
                    
            except CustomUser.DoesNotExist:
                self.stdout.write(
                    self.style.ERROR(f"User '{options['username']}' not found")
                )
                
        elif options['failed_only']:
            # Recompute only failed encodings
            self.stdout.write("Recomputing encodings for users with errors...")
            
            failed_users = CustomUser.objects.filter(
                encoding_status__in=['ERROR', 'NO_FACE']
            ).exclude(profile_pic__in=['', None])
            
            count = failed_users.count()
            self.stdout.write(f"Found {count} users with failed encodings")
            
            success = 0
            failed = 0
            
            for user in failed_users:
                if extract_face_encoding(user):
                    success += 1
                    self.stdout.write(self.style.SUCCESS(f"✓ {user.username}"))
                else:
                    failed += 1
                    self.stdout.write(self.style.WARNING(f"✗ {user.username} ({user.encoding_status})"))
            
            self.stdout.write(
                self.style.SUCCESS(f"\nCompleted: {success} fixed, {failed} still failed")
            )
            
        elif options['all']:
            # Recompute all encodings
            self.stdout.write("Recomputing ALL face encodings...")
            
            stats = recompute_all_face_encodings()
            
            self.stdout.write(
                self.style.SUCCESS(
                    f"\nCompleted processing {stats['total']} users:\n"
                    f"  ✓ Success: {stats['success']}\n"
                    f"  ⚠ No face: {stats['no_face']}\n"
                    f"  ✗ Errors: {stats['error']}"
                )
            )
        else:
            # Show current statistics
            self.stdout.write("Face Encoding Statistics:")
            self.stdout.write("-" * 50)
            
            total = CustomUser.objects.exclude(profile_pic__in=['', None]).count()
            success = CustomUser.objects.filter(encoding_status='SUCCESS').count()
            no_face = CustomUser.objects.filter(encoding_status='NO_FACE').count()
            error = CustomUser.objects.filter(encoding_status='ERROR').count()
            pending = CustomUser.objects.filter(encoding_status='PENDING').count()
            
            self.stdout.write(f"Total users with profile pics: {total}")
            self.stdout.write(self.style.SUCCESS(f"  ✓ Success: {success}"))
            self.stdout.write(self.style.WARNING(f"  ⚠ No face detected: {no_face}"))
            self.stdout.write(self.style.ERROR(f"  ✗ Errors: {error}"))
            self.stdout.write(f"  ⏳ Pending: {pending}")
            self.stdout.write("\nUse --all to compute all encodings")
            self.stdout.write("Use --username <name> to compute for specific user")
            self.stdout.write("Use --failed-only to retry failed computations")