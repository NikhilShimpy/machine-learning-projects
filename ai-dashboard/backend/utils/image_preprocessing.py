"""
Image Preprocessing Utilities for Brain Tumor MRI Classification
Handles image loading, resizing, and normalization
"""

import io
import numpy as np
from PIL import Image

# Image configuration matching the training pipeline
IMG_SIZE = 224
RESCALE_FACTOR = 1.0 / 255.0  # Normalize to [0, 1]


def preprocess_image(image_bytes):
    """
    Preprocess an image file for brain tumor classification.

    Args:
        image_bytes: Raw bytes of the uploaded image file

    Returns:
        numpy array of shape (1, 224, 224, 3) normalized to [0, 1]
    """
    try:
        # Load image from bytes
        image = Image.open(io.BytesIO(image_bytes))

        # Convert to RGB if necessary (handles grayscale, RGBA, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')

        # Resize to expected dimensions
        image = image.resize((IMG_SIZE, IMG_SIZE), Image.Resampling.LANCZOS)

        # Convert to numpy array
        img_array = np.array(image, dtype=np.float32)

        # Normalize pixel values to [0, 1] range (as per training pipeline)
        img_array = img_array * RESCALE_FACTOR

        # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
        img_array = np.expand_dims(img_array, axis=0)

        return img_array

    except Exception as e:
        raise ValueError(f"Image preprocessing failed: {str(e)}")


def validate_image(file):
    """
    Validate that the uploaded file is a valid image.

    Args:
        file: File object from Flask request

    Returns:
        tuple (is_valid, error_message)
    """
    if file is None:
        return False, "No file provided"

    if file.filename == '':
        return False, "No file selected"

    # Check file extension
    allowed_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.webp'}
    ext = file.filename.lower()
    ext = ext[ext.rfind('.'):] if '.' in ext else ''

    if ext not in allowed_extensions:
        return False, f"Invalid file type. Allowed: {', '.join(allowed_extensions)}"

    # Check file size (max 10MB)
    file.seek(0, 2)  # Seek to end
    size = file.tell()
    file.seek(0)  # Reset to beginning

    if size > 10 * 1024 * 1024:
        return False, "File size must be less than 10MB"

    if size == 0:
        return False, "File is empty"

    return True, None


def get_image_info(image_bytes):
    """
    Get basic information about the uploaded image.

    Args:
        image_bytes: Raw bytes of the image file

    Returns:
        dict with image information
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
        return {
            'format': image.format,
            'mode': image.mode,
            'size': image.size,
            'width': image.width,
            'height': image.height
        }
    except Exception as e:
        return {'error': str(e)}
