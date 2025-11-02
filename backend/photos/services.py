# backend/photos/services.py (OPTIMIZED & WITH COMPREHENSIVE LOGGING)

import face_recognition
import numpy as np
from PIL import Image, ImageDraw
from django.core.files import File
import logging
import time

from users.models import CustomUser
from users.services import get_face_encodings_dict
from .models import Photo, ConsentRequest

# Get the logger for the 'photos' app, as defined in settings.py
logger = logging.getLogger('photos')

def process_photo_for_faces(photo_id: int):
    """
    OPTIMIZED: Service function to perform face recognition on uploaded photos.
    Now uses pre-computed face encodings from the database for massive speedup.
    
    UPDATED: Now checks user's `face_sharing_mode` preference.
    1. If mode is 'PUBLIC', face is unmasked automatically (like uploader).
    2. If mode is 'REQUIRE_CONSENT', a ConsentRequest is created.
    """
    start_time = time.time()
    logger.info(f"[PhotoProcessing] START: Processing photo_id {photo_id}...")
    
    try:
        photo = Photo.objects.get(id=photo_id)
        uploader = photo.uploader
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Uploaded by {uploader.username} (ID: {uploader.id}).")
    except Photo.DoesNotExist:
        logger.error(f"[PhotoProcessing] FATAL: Photo with id {photo_id} not found.")
        return

    try:
        # --- Step 1: Create the initial public image ---
        logger.debug(f"[PhotoProcessing] Photo {photo_id}: Copying original image to public_image storage.")
        photo.public_image.save(
            photo.original_image.name,
            File(photo.original_image.file),
            save=True
        )

        # --- Step 2: OPTIMIZED - Load pre-computed encodings from database ---
        encoding_load_start = time.time()
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Loading pre-computed user encodings from database...")
        known_encodings_array, known_users = get_face_encodings_dict()
        encoding_load_time = time.time() - encoding_load_start
        
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Loaded {len(known_users)} encodings in {encoding_load_time:.3f}s.")
        
        if len(known_users) == 0:
            logger.warning(f"[PhotoProcessing] Photo {photo_id}: No users with face encodings found. Skipping face matching.")
            return

        # --- Step 3: Detect faces in the uploaded photo ---
        detection_start = time.time()
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Detecting faces in original image...")
        original_image_path = photo.original_image.path
        unknown_image = face_recognition.load_image_file(original_image_path)
        unknown_face_locations = face_recognition.face_locations(unknown_image)
        unknown_face_encodings = face_recognition.face_encodings(unknown_image, unknown_face_locations)
        detection_time = time.time() - detection_start
        
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Detected {len(unknown_face_locations)} faces in {detection_time:.3f}s.")

        if len(unknown_face_locations) == 0:
            logger.info(f"[PhotoProcessing] Photo {photo_id}: No faces detected. Processing complete.")
            return

        # --- Step 4: Match faces and apply privacy rules ---
        matching_start = time.time()
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Matching {len(unknown_face_locations)} detected faces against {len(known_users)} known encodings...")
        
        found_users = set()
        locations_to_unmask = [] # List for faces that should NOT be masked
        
        for unknown_encoding, face_location in zip(unknown_face_encodings, unknown_face_locations):
            matches = face_recognition.compare_faces(known_encodings_array, unknown_encoding, tolerance=0.6)
            
            if True in matches:
                first_match_index = matches.index(True)
                matched_user = known_users[first_match_index]

                # Check 1: Is the matched user the uploader?
                if matched_user.id == uploader.id:
                    locations_to_unmask.append(face_location)
                    logger.debug(f"[PhotoProcessing] Photo {photo_id}: Matched face at {face_location} as uploader ({matched_user.username}). Adding to unmask list.")
                    continue
                
                # Check 2: Is the matched user's mode 'PUBLIC'?
                if matched_user.face_sharing_mode == CustomUser.FaceSharingMode.PUBLIC:
                    locations_to_unmask.append(face_location)
                    logger.debug(f"[PhotoProcessing] Photo {photo_id}: Matched face at {face_location} as {matched_user.username} (PUBLIC mode). Adding to unmask list.")
                    continue

                # Check 3: User requires consent (default)
                if matched_user.id not in found_users:
                    top, right, bottom, left = face_location
                    bounding_box_str = f"{left},{top},{right},{bottom}"

                    ConsentRequest.objects.create(
                        photo=photo,
                        requested_user=matched_user,
                        bounding_box=bounding_box_str
                    )
                    found_users.add(matched_user.id)
                    logger.info(f"[PhotoProcessing] Photo {photo_id}: Matched face at {face_location} as {matched_user.username} (REQUIRE_CONSENT mode). Creating ConsentRequest.")
                else:
                    logger.debug(f"[PhotoProcessing] Photo {photo_id}: Matched face at {face_location} as {matched_user.username} (REQUIRE_CONSENT mode), but request already created for this user.")
            else:
                logger.debug(f"[PhotoProcessing] Photo {photo_id}: Face at {face_location} did not match any known user.")
        
        matching_time = time.time() - matching_start 
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Matching complete in {matching_time:.3f}s. Found {len(found_users)} users requiring consent. Found {len(locations_to_unmask)} faces to leave unmasked.")
        
        # --- Step 5: (REVISED) Mask ONLY faces requiring consent ---
        masking_start = time.time()
        
        all_face_locations_set = set(unknown_face_locations)
        locations_to_unmask_set = set(locations_to_unmask)
        locations_to_mask = all_face_locations_set - locations_to_unmask_set
        
        logger.info(f"[PhotoProcessing] Photo {photo_id}: Calculating {len(locations_to_mask)} faces to mask.")

        if locations_to_mask:
            logger.debug(f"[PhotoProcessing] Photo {photo_id}: Opening public image for masking...")
            public_image_path = photo.public_image.path
            pil_image = Image.open(public_image_path)
            draw = ImageDraw.Draw(pil_image)
            
            for face_location in locations_to_mask:
                top, right, bottom, left = face_location
                draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 0), fill=(0, 0, 0))
                logger.debug(f"[PhotoProcessing] Photo {photo_id}: Masked face at {face_location}.")
            
            del draw
            pil_image.save(public_image_path)
            
            masking_time = time.time() - masking_start
            logger.info(f"[PhotoProcessing] Photo {photo_id}: Successfully masked {len(locations_to_mask)} faces in {masking_time:.3f}s.")
        else:
            masking_time = time.time() - masking_start
            logger.info(f"[PhotoProcessing] Photo {photo_id}: No faces require masking. Completed in {masking_time:.3f}s.")
        
        # --- Step 6: (REMOVED) ---

        total_time = time.time() - start_time
        logger.info(f"[PhotoProcessing] SUCCESS: Finished processing photo_id {photo_id} in {total_time:.3f}s.")
        logger.info(f"[PhotoProcessing] Breakdown: Load={encoding_load_time:.3f}s, Detect={detection_time:.3f}s, "
                    f"Match={matching_time:.3f}s, Mask={masking_time:.3f}s")

    except Exception as e:
        logger.error(f"[PhotoProcessing] FAILED: An unexpected error occurred while processing photo_id {photo_id}. Error: {e}", exc_info=True)
        # exc_info=True will log the full stack trace for debugging


def unmask_approved_face(consent_request_id: int):
    """
    Service to unmask a single approved face on the public image.
    This is triggered when a ConsentRequest status is updated to 'APPROVED'.
    """
    logger.info(f"[Unmasking] START: Processing consent_request_id {consent_request_id}...")
    
    try:
        consent_request = ConsentRequest.objects.get(id=consent_request_id)
        
        if consent_request.status != 'APPROVED':
            logger.warning(f"[Unmasking] SKIPPED: Request {consent_request_id} status is '{consent_request.status}', not 'APPROVED'.")
            return

        photo = consent_request.photo
        user = consent_request.requested_user
        logger.info(f"[Unmasking] Request {consent_request_id}: User {user.username} APPROVED consent for photo {photo.id}.")
        
        # Open images
        logger.debug(f"[Unmasking] Request {consent_request_id}: Opening original ({photo.original_image.path}) and public ({photo.public_image.path}) images.")
        original = Image.open(photo.original_image.path)
        public = Image.open(photo.public_image.path)

        # Get bounding box
        coords = [int(c) for c in consent_request.bounding_box.split(',')]
        left, top, right, bottom = coords
        logger.debug(f"[Unmasking] Request {consent_request_id}: Cropping original at bounding box {left},{top},{right},{bottom}.")
        
        # Crop and paste
        unmasked_face_crop = original.crop((left, top, right, bottom))
        public.paste(unmasked_face_crop, (left, top))
        public.save(photo.public_image.path)
        
        logger.info(f"[Unmasking] SUCCESS: Unmasked face for {user.username} on photo {photo.id}.")

    except ConsentRequest.DoesNotExist:
        logger.error(f"[Unmasking] FAILED: ConsentRequest {consent_request_id} not found.")
    except FileNotFoundError as e:
        logger.error(f"[Unmasking] FAILED: Image file not found for request {consent_request_id}. Error: {e}", exc_info=True)
    except Exception as e:
        logger.error(f"[Unmasking] FAILED: An unexpected error occurred for request {consent_request_id}. Error: {e}", exc_info=True)