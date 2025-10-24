# backend/test_performance.py
# Run with: python manage.py shell < test_performance.py

import os
import sys
import django
import time

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from photos.models import Photo
from photos.services import process_photo_for_faces
from users.models import CustomUser

def benchmark_processing():
    """
    Benchmark photo processing speed with the new optimization.
    """
    print("=" * 70)
    print("PHOTO PROCESSING PERFORMANCE BENCHMARK")
    print("=" * 70)
    
    # Get statistics
    total_users = CustomUser.objects.count()
    users_with_encodings = CustomUser.objects.filter(encoding_status='SUCCESS').count()
    total_photos = Photo.objects.count()
    
    print(f"\nSystem Statistics:")
    print(f"  Total users: {total_users}")
    print(f"  Users with face encodings: {users_with_encodings}")
    print(f"  Total photos: {total_photos}")
    
    if total_photos == 0:
        print("\n⚠️  No photos found. Please upload a test photo first.")
        return
    
    # Get the most recent photo for testing
    test_photo = Photo.objects.latest('created_at')
    print(f"\nTest Photo:")
    print(f"  ID: {test_photo.id}")
    print(f"  Uploader: {test_photo.uploader.username}")
    print(f"  Uploaded: {test_photo.created_at}")
    
    # Benchmark processing
    print(f"\n{'─' * 70}")
    print("Processing photo with optimized face recognition...")
    print(f"{'─' * 70}")
    
    start_time = time.time()
    process_photo_for_faces(test_photo.id)
    end_time = time.time()
    
    processing_time = end_time - start_time
    
    print(f"\n{'=' * 70}")
    print(f"✓ Processing completed in {processing_time:.3f} seconds")
    print(f"{'=' * 70}")
    
    # Performance analysis
    print(f"\nPerformance Analysis:")
    
    if users_with_encodings > 0:
        time_per_user = processing_time / users_with_encodings
        print(f"  Time per user comparison: {time_per_user * 1000:.2f} ms")
    
    # Estimate old system performance
    estimated_old_time = users_with_encodings * 0.1  # Assume 100ms per encoding
    speedup = estimated_old_time / processing_time if processing_time > 0 else 0
    
    print(f"\n  Estimated old system time: ~{estimated_old_time:.2f}s")
    print(f"  New system time: {processing_time:.3f}s")
    print(f"  Speedup: ~{speedup:.1f}x faster 🚀")
    
    # Check results
    consent_requests = test_photo.consent_requests.count()
    print(f"\n  Consent requests created: {consent_requests}")
    
    print(f"\n{'=' * 70}")
    
    # Recommendations
    if processing_time > 5:
        print("\n⚠️  Processing took longer than expected.")
        print("   Consider:")
        print("   - Using faster hardware")
        print("   - Implementing Celery for async processing")
        print("   - Reducing image resolution before processing")
    elif processing_time < 2:
        print("\n✓ Excellent performance! Your optimization is working well.")
    else:
        print("\n✓ Good performance. Well within acceptable limits.")
    
    return {
        'processing_time': processing_time,
        'users_checked': users_with_encodings,
        'consent_requests': consent_requests,
        'speedup_estimate': speedup
    }

if __name__ == '__main__':
    results = benchmark_processing()