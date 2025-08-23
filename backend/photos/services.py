import face_recognition
from PIL import Image, ImageDraw
from django.core.files import File

from users.models import CustomUser
from .models import Photo, ConsentRequest

def process_photo_for_faces(photo_id: int):
    """
    Service function to perform face recognition on a newly uploaded photo.
    This function is now NON-DESTRUCTIVE. It reads from the original_image
    and creates a masked public_image, leaving the original untouched.
    """
    try:
        photo = Photo.objects.get(id=photo_id)
        uploader = photo.uploader
    except Photo.DoesNotExist:
        print(f"Error: Photo with id {photo_id} not found for processing.")
        return

    # --- Step 1: Create the initial public image ---
    # We copy the original image to the public image field to work on it.
    # This is a crucial step to ensure the original is never modified.
    photo.public_image.save(
        photo.original_image.name,
        File(photo.original_image.file),
        save=True
    )

    # --- Step 2: Build a database of "known" face encodings ---
    # This logic remains the same, but is a candidate for future optimization.
    known_face_encodings = []
    known_face_users = []

    users_to_check = CustomUser.objects.exclude(pk=uploader.pk).exclude(profile_pic__in=['', None])
    
    for user in users_to_check:
        try:
            profile_pic_path = user.profile_pic.path
            known_image = face_recognition.load_image_file(profile_pic_path)
            encoding = face_recognition.face_encodings(known_image)[0]
            known_face_encodings.append(encoding)
            known_face_users.append(user)
        except (FileNotFoundError, IndexError):
            print(f"Warning: Could not process profile picture for user {user.username}.")
            continue

    # --- Step 3: Find all faces in the newly uploaded photo (from the original) ---
    original_image_path = photo.original_image.path
    unknown_image = face_recognition.load_image_file(original_image_path)
    unknown_face_locations = face_recognition.face_locations(unknown_image)
    unknown_face_encodings = face_recognition.face_encodings(unknown_image, unknown_face_locations)

    # --- Step 4: Compare faces and create ConsentRequests for any matches ---
    found_users = set()
    for unknown_encoding, face_location in zip(unknown_face_encodings, unknown_face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, unknown_encoding)
        
        if True in matches:
            first_match_index = matches.index(True)
            matched_user = known_face_users[first_match_index]

            if matched_user.id not in found_users:
                top, right, bottom, left = face_location
                # Store coordinates in a consistent order for cropping: left, top, right, bottom
                bounding_box_str = f"{left},{top},{right},{bottom}"

                ConsentRequest.objects.create(
                    photo=photo,
                    requested_user=matched_user,
                    bounding_box=bounding_box_str
                )
                found_users.add(matched_user.id)
    
    # --- Step 5: As a default, mask ALL detected faces on the public_image ---
    # This includes registered users (who get a request) and non-registered users.
    if unknown_face_locations:
        public_image_path = photo.public_image.path
        pil_image = Image.open(public_image_path)
        draw = ImageDraw.Draw(pil_image)
        for face_location in unknown_face_locations:
            top, right, bottom, left = face_location
            draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 0), fill=(0, 0, 0))
        del draw
        pil_image.save(public_image_path)


def unmask_approved_face(consent_request_id: int):
    """
    Service to unmask a single approved face on the public image.
    This is triggered when a ConsentRequest status is updated to 'APPROVED'.
    """
    try:
        consent_request = ConsentRequest.objects.get(id=consent_request_id)
        if consent_request.status != 'APPROVED':
            print(f"Info: Unmasking skipped for request {consent_request_id} as status is not APPROVED.")
            return

        photo = consent_request.photo
        
        # 1. Open the pristine original and the public (masked) image
        original = Image.open(photo.original_image.path)
        public = Image.open(photo.public_image.path)

        # 2. Get the bounding box coordinates from the request
        # Note: Bounding box is stored as left,top,right,bottom
        coords = [int(c) for c in consent_request.bounding_box.split(',')]
        left, top, right, bottom = coords
        
        # 3. Crop the unmasked face from the ORIGINAL image using the coordinates
        unmasked_face_crop = original.crop((left, top, right, bottom))

        # 4. Paste the unmasked crop onto the PUBLIC image at the same location
        public.paste(unmasked_face_crop, (left, top))
        
        # 5. Save the updated public image, overwriting the previous version
        public.save(photo.public_image.path)
        print(f"Success: Unmasked face for user {consent_request.requested_user.username} on photo {photo.id}.")

    except ConsentRequest.DoesNotExist:
        print(f"Error: ConsentRequest with id {consent_request_id} not found for unmasking.")
    except FileNotFoundError:
        print(f"Error: Image file not found for photo id {photo.id} during unmasking.")
    except Exception as e:
        print(f"An unexpected error occurred during unmasking: {e}")
