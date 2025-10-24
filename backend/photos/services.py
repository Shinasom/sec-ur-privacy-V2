# backend/photos/services.py (OPTIMIZED VERSION)

import face_recognition
import numpy as np
from PIL import Image, ImageDraw
from django.core.files import File
import logging
import time

from users.models import CustomUser
from users.services import get_face_encodings_dict
from .models import Photo, ConsentRequest

logger = logging.getLogger('photos')

def process_photo_for_faces(photo_id: int):
    """
    OPTIMIZED: Service function to perform face recognition on uploaded photos.
    Now uses pre-computed face encodings from the database for massive speedup.
    
    PERFORMANCE:
    - OLD: Load and encode N profile pics every time = O(N × M) where M = photos
    - NEW: Load pre-computed encodings from DB = O(N) once, then O(1) per photo
    - Expected speedup: 10-100x depending on number of users
    
    WORKFLOW:
    1. Copy original to public_image
    2. Load pre-computed face encodings from database (FAST!)
    3. Detect faces in uploaded photo
    4. Match faces to known encodings
    5. Create consent requests (excluding uploader)
    6. Mask all faces
    7. Unmask uploader's face
    """
    start_time = time.time()
    
    try:
        photo = Photo.objects.get(id=photo_id)
        uploader = photo.uploader
    except Photo.DoesNotExist:
        logger.error(f"Photo with id {photo_id} not found for processing.")
        return

    logger.info(f"Processing photo {photo_id} uploaded by {uploader.username}")

    # --- Step 1: Create the initial public image ---
    photo.public_image.save(
        photo.original_image.name,
        File(photo.original_image.file),
        save=True
    )

    # --- Step 2: OPTIMIZED - Load pre-computed encodings from database ---
    encoding_load_start = time.time()
    known_encodings_array, known_users = get_face_encodings_dict()
    encoding_load_time = time.time() - encoding_load_start
    
    logger.info(f"Loaded {len(known_users)} pre-computed encodings in {encoding_load_time:.3f}s")
    
    if len(known_users) == 0:
        logger.warning("No users with face encodings found. Skipping face matching.")
        return

    # --- Step 3: Detect faces in the uploaded photo ---
    detection_start = time.time()
    original_image_path = photo.original_image.path
    unknown_image = face_recognition.load_image_file(original_image_path)
    unknown_face_locations = face_recognition.face_locations(unknown_image)
    unknown_face_encodings = face_recognition.face_encodings(unknown_image, unknown_face_locations)
    detection_time = time.time() - detection_start
    
    logger.info(f"Detected {len(unknown_face_locations)} faces in {detection_time:.3f}s")

    if len(unknown_face_locations) == 0:
        logger.info("No faces detected in photo")
        return

    # --- Step 4: Match faces to known encodings ---
    matching_start = time.time()
    found_users = set()
    uploader_face_location = None
    
    for unknown_encoding, face_location in zip(unknown_face_encodings, unknown_face_locations):
        # Compare against ALL pre-computed encodings at once (vectorized operation)
        matches = face_recognition.compare_faces(known_encodings_array, unknown_encoding, tolerance=0.6)
        
        if True in matches:
            # Get the index of the first match
            first_match_index = matches.index(True)
            matched_user = known_users[first_match_index]

            # Check if matched user is the uploader
            if matched_user.id == uploader.id:
                uploader_face_location = face_location
                logger.info(f"Detected uploader's face at location {face_location}")
                continue
            
            # Create consent request for other users
            if matched_user.id not in found_users:
                top, right, bottom, left = face_location
                bounding_box_str = f"{left},{top},{right},{bottom}"

                ConsentRequest.objects.create(
                    photo=photo,
                    requested_user=matched_user,
                    bounding_box=bounding_box_str
                )
                found_users.add(matched_user.id)
                logger.info(f"Created consent request for {matched_user.username}")
    
    matching_time = time.time() - matching_start
    logger.info(f"Face matching completed in {matching_time:.3f}s, found {len(found_users)} matches")
    
    # --- Step 5: Mask all detected faces ---
    masking_start = time.time()
    public_image_path = photo.public_image.path
    pil_image = Image.open(public_image_path)
    draw = ImageDraw.Draw(pil_image)
    
    for face_location in unknown_face_locations:
        top, right, bottom, left = face_location
        draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 0), fill=(0, 0, 0))
    
    del draw
    pil_image.save(public_image_path)
    masking_time = time.time() - masking_start
    
    logger.info(f"Masked {len(unknown_face_locations)} faces in {masking_time:.3f}s")
    
    # --- Step 6: Unmask uploader's face ---
    if uploader_face_location:
        unmask_start = time.time()
        original = Image.open(photo.original_image.path)
        public = Image.open(photo.public_image.path)
        
        top, right, bottom, left = uploader_face_location
        unmasked_face_crop = original.crop((left, top, right, bottom))
        public.paste(unmasked_face_crop, (left, top))
        public.save(photo.public_image.path)
        
        unmask_time = time.time() - unmask_start
        logger.info(f"Unmasked uploader's face in {unmask_time:.3f}s")
    else:
        if uploader.has_valid_face_encoding():
            logger.warning(f"Uploader {uploader.username} has encoding but face not detected in photo")
        else:
            logger.info(f"Uploader {uploader.username} has no face encoding")
    
    total_time = time.time() - start_time
    logger.info(f"Total processing time: {total_time:.3f}s")
    logger.info(f"Breakdown: Load={encoding_load_time:.3f}s, Detect={detection_time:.3f}s, "
                f"Match={matching_time:.3f}s, Mask={masking_time:.3f}s")


def unmask_approved_face(consent_request_id: int):
    """
    Service to unmask a single approved face on the public image.
    This is triggered when a ConsentRequest status is updated to 'APPROVED'.
    """
    try:
        consent_request = ConsentRequest.objects.get(id=consent_request_id)
        if consent_request.status != 'APPROVED':
            logger.info(f"Unmasking skipped for request {consent_request_id} (status: {consent_request.status})")
            return

        photo = consent_request.photo
        
        # Open images
        original = Image.open(photo.original_image.path)
        public = Image.open(photo.public_image.path)

        # Get bounding box
        coords = [int(c) for c in consent_request.bounding_box.split(',')]
        left, top, right, bottom = coords
        
        # Crop and paste
        unmasked_face_crop = original.crop((left, top, right, bottom))
        public.paste(unmasked_face_crop, (left, top))
        public.save(photo.public_image.path)
        
        logger.info(f"Unmasked face for {consent_request.requested_user.username} on photo {photo.id}")

    except ConsentRequest.DoesNotExist:
        logger.error(f"ConsentRequest {consent_request_id} not found")
    except FileNotFoundError:
        logger.error(f"Image files not found for consent request {consent_request_id}")
    except Exception as e:
        logger.error(f"Error unmasking face: {str(e)}")