# backend/app/services/prediction_service.py
import tensorflow as tf
import numpy as np
from PIL import Image
import os

class PredictionService:
    def __init__(self):
        self.model = None
        self.labels = []
        self.load_model()
    
    def load_model(self):
        try:
            # Load model from .h5 
            model_path = os.path.join(os.path.dirname(__file__), '../../model/keras_model.h5')
            self.model = tf.keras.models.load_model(model_path)
            
            # Load labels
            labels_path = os.path.join(os.path.dirname(__file__), '../../model/labels.txt')
            with open(labels_path, 'r') as f:
                self.labels = [line.strip() for line in f.readlines()]
            
            print("✅ Model loaded successfully!")
            print(f"📊 Labels: {self.labels}")
            
        except Exception as e:
            print(f"❌ Error loading model: {e}")
            raise e
    
    def is_model_loaded(self):
        return self.model is not None
    
    def get_supported_words(self):
        return self.labels
    
    def preprocess_image(self, image):
        """
        Preprocess image for the model
        Adjust this based on your model's requirements
        """
        # Resize to model's expected input size
        image = image.resize((224, 224))
        
        # Convert to numpy array and normalize
        image_array = np.array(image) / 255.0
        
        # Add batch dimension
        image_array = np.expand_dims(image_array, axis=0)
        
        return image_array
    
    def predict(self, image):
        try:
            if not self.is_model_loaded():
                return {
                    "predicted_word": "MODEL_NOT_LOADED",
                    "confidence": 0.0,
                    "error": "Model is not loaded"
                }
            
            # Preprocess image
            processed_image = self.preprocess_image(image)
            
            # Make prediction
            predictions = self.model.predict(processed_image)
            predicted_class = np.argmax(predictions[0])
            confidence = float(predictions[0][predicted_class])
            
            # Get predicted word
            predicted_word = self.labels[predicted_class]
            
            # Apply confidence threshold (adjust as needed)
            if confidence < 0.6:
                predicted_word = "UNCERTAIN"
            
            return {
                "predicted_word": predicted_word,
                "confidence": confidence,
                "all_predictions": predictions[0].tolist()
            }
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return {
                "predicted_word": "ERROR",
                "confidence": 0.0,
                "error": str(e)
            }