# backend/users/services.py

import face_recognition
import numpy as np
import logging

logger = logging.getLogger('users')

def extract_face_encoding(user):
    """
    Extract and save face encoding from user's profile picture.
    This should be called when a user uploads/updates their profile pic.
    
    Args:
        user: CustomUser instance
        
    Returns:
        bool: True if encoding extracted successfully, False otherwise
    """
    if not user.profile_pic:
        logger.warning(f"User {user.username} has no profile picture")
        user.encoding_status = 'NO_FACE'
        user.save()
        return False
    
    try:
        # Load the profile picture
        profile_pic_path = user.profile_pic.path
        image = face_recognition.load_image_file(profile_pic_path)
        
        # Extract face encodings
        encodings = face_recognition.face_encodings(image)
        
        if len(encodings) == 0:
            logger.warning(f"No face detected in profile pic for user {user.username}")
            user.encoding_status = 'NO_FACE'
            user.face_encoding = None
            user.save()
            return False
        
        if len(encodings) > 1:
            logger.warning(f"Multiple faces detected for user {user.username}, using first one")
        
        # Get the first encoding and convert numpy array to list for JSON storage
        encoding = encodings[0]
        user.face_encoding = encoding.tolist()
        user.encoding_status = 'SUCCESS'
        user.save()
        
        logger.info(f"Successfully extracted face encoding for user {user.username}")
        return True
        
    except FileNotFoundError:
        logger.error(f"Profile picture file not found for user {user.username}")
        user.encoding_status = 'ERROR'
        user.save()
        return False
    except Exception as e:
        logger.error(f"Error extracting face encoding for user {user.username}: {str(e)}")
        user.encoding_status = 'ERROR'
        user.save()
        return False


def get_users_with_encodings():
    """
    Get all users who have successfully computed face encodings.
    
    Returns:
        QuerySet: Users with valid face encodings
    """
    from users.models import CustomUser
    return CustomUser.objects.filter(
        encoding_status='SUCCESS',
        face_encoding__isnull=False
    )


def get_face_encodings_dict():
    """
    Get a dictionary mapping user IDs to their face encodings.
    This is optimized for batch face recognition operations.
    
    Returns:
        tuple: (numpy array of encodings, list of user objects)
    """
    users = get_users_with_encodings()
    
    if not users.exists():
        return np.array([]), []
    
    encodings = []
    user_list = []
    
    for user in users:
        try:
            # Convert JSON list back to numpy array
            encoding = np.array(user.face_encoding)
            encodings.append(encoding)
            user_list.append(user)
        except Exception as e:
            logger.error(f"Error loading encoding for user {user.username}: {str(e)}")
            continue
    
    return np.array(encodings), user_list


def recompute_all_face_encodings():
    """
    Recompute face encodings for all users with profile pictures.
    Useful for migrations or if encoding algorithm changes.
    
    Returns:
        dict: Statistics about the recomputation
    """
    from users.models import CustomUser
    
    users = CustomUser.objects.exclude(profile_pic__in=['', None])
    
    stats = {
        'total': users.count(),
        'success': 0,
        'no_face': 0,
        'error': 0
    }
    
    for user in users:
        success = extract_face_encoding(user)
        
        if success:
            stats['success'] += 1
        elif user.encoding_status == 'NO_FACE':
            stats['no_face'] += 1
        else:
            stats['error'] += 1
    
    logger.info(f"Face encoding recomputation complete: {stats}")
    return stats