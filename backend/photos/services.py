# photos/services.py

import face_recognition
from PIL import Image, ImageDraw
from users.models import CustomUser
from .models import Photo, ConsentRequest

def process_photo_for_faces(photo_id: int):
    """
    Service function to perform face recognition on a newly uploaded photo.
    This function contains the core "brain" of the application.
    """
    try:
        photo = Photo.objects.get(id=photo_id)
        uploader = photo.uploader
    except Photo.DoesNotExist:
        # If the photo somehow doesn't exist, we can't proceed.
        print(f"Error: Photo with id {photo_id} not found for processing.")
        return

    # 1. Build a database of "known" face encodings from all users
    # who have a profile picture, excluding the person who uploaded the photo.
    known_face_encodings = []
    known_face_users = []

    users_to_check = CustomUser.objects.exclude(pk=uploader.pk).exclude(profile_pic__in=['', None])
    
    for user in users_to_check:
        try:
            # Load the user's profile picture and get its face encoding
            profile_pic_path = user.profile_pic.path
            known_image = face_recognition.load_image_file(profile_pic_path)
            # We assume the first face in the profile picture is the user
            encoding = face_recognition.face_encodings(known_image)[0]
            known_face_encodings.append(encoding)
            known_face_users.append(user)
        except (FileNotFoundError, IndexError):
            # This handles cases where the image file is missing or no face is found
            print(f"Warning: Could not process profile picture for user {user.username}.")
            continue

    # 2. Find all faces in the newly uploaded photo
    uploaded_image_path = photo.image.path
    unknown_image = face_recognition.load_image_file(uploaded_image_path)
    unknown_face_locations = face_recognition.face_locations(unknown_image)
    unknown_face_encodings = face_recognition.face_encodings(unknown_image, unknown_face_locations)

    # 3. Compare faces and create ConsentRequest for any matches
    found_users = set()
    for unknown_encoding, face_location in zip(unknown_face_encodings, unknown_face_locations):
        matches = face_recognition.compare_faces(known_face_encodings, unknown_encoding)
        
        if True in matches:
            first_match_index = matches.index(True)
            matched_user = known_face_users[first_match_index]

            # Avoid creating duplicate requests for the same user in the same photo
            if matched_user.id not in found_users:
                top, right, bottom, left = face_location
                bounding_box_str = f"{top},{right},{bottom},{left}"

                # Create the consent request using the Django ORM - simple and secure
                ConsentRequest.objects.create(
                    photo=photo,
                    requested_user=matched_user,
                    bounding_box=bounding_box_str
                )
                found_users.add(matched_user.id)
    
    # 4. As a default privacy measure, mask all detected faces on the image
    if unknown_face_locations:
        pil_image = Image.open(uploaded_image_path)
        draw = ImageDraw.Draw(pil_image)
        for face_location in unknown_face_locations:
            top, right, bottom, left = face_location
            draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 0), fill=(0, 0, 0))
        del draw
        pil_image.save(uploaded_image_path)