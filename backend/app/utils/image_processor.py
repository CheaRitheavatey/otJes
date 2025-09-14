# backend/app/utils/image_processor.py
import cv2
import numpy as np
from PIL import Image
import base64
from io import BytesIO

def process_image_for_model(image, target_size=(224, 224)):
    """
    Process image for model prediction
    Adjust this based on your model's specific requirements
    """
    # Convert to numpy array if it's a PIL Image
    if isinstance(image, Image.Image):
        image_array = np.array(image)
    else:
        image_array = image
    
    # Convert RGB to BGR if needed (some models expect BGR)
    # image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)
    
    # Resize
    image_array = cv2.resize(image_array, target_size)
    
    # Normalize to [0, 1]
    image_array = image_array.astype(np.float32) / 255.0
    
    # Add batch dimension
    image_array = np.expand_dims(image_array, axis=0)
    
    return image_array

def base64_to_image(base64_string):
    """
    Convert base64 string to PIL Image
    """
    try:
        if ',' in base64_string:
            base64_string = base64_string.split(',')[1]
        
        image_data = base64.b64decode(base64_string)
        image = Image.open(BytesIO(image_data))
        return image.convert('RGB')
    except Exception as e:
        raise ValueError(f"Invalid base64 image: {e}")

def image_to_base64(image):
    """
    Convert PIL Image to base64 string
    """
    buffered = BytesIO()
    image.save(buffered, format="JPEG")
    return base64.b64encode(buffered.getvalue()).decode('utf-8')