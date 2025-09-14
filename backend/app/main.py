# backend/app/main.py
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import base64
import io
from PIL import Image
import numpy as np
import json
import os
import uuid
from datetime import datetime

from app.services.prediction_service import PredictionService
from app.schemas.schemas import PredictionResponse, HealthResponse, PredictionRequest

app = FastAPI(title="Sign Language to Subtitle API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize prediction service
prediction_service = PredictionService()

@app.get("/")
async def root():
    return {
        "message": "Sign Language to Subtitle API",
        "version": "1.0.0",
        "model_loaded": prediction_service.is_model_loaded()
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(
        status="healthy",
        message="API is running",
        model_loaded=prediction_service.is_model_loaded(),
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/words")
async def get_supported_words():
    words = prediction_service.get_supported_words()
    return {
        "words": words,
        "count": len(words)
    }

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_sign_language(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read image file
        contents = await file.read()
        
        # Convert to PIL Image
        image = Image.open(io.BytesIO(contents)).convert('RGB')
        
        # Make prediction
        result = prediction_service.predict(image)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return PredictionResponse(
            predicted_word=result["predicted_word"],
            confidence=result["confidence"],
            status="success",
            timestamp=datetime.now().isoformat()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict-base64")
async def predict_from_base64(request: PredictionRequest):
    try:
        if not request.image:
            raise HTTPException(status_code=400, detail="No image provided")
        
        # Convert base64 to image
        from app.utils.image_processor import base64_to_image
        image = base64_to_image(request.image)
        
        # Make prediction
        result = prediction_service.predict(image)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        return PredictionResponse(
            predicted_word=result["predicted_word"],
            confidence=result["confidence"],
            status="success",
            timestamp=datetime.now().isoformat(),
            session_id=request.session_id or str(uuid.uuid4())
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/model-info")
async def get_model_info():
    return {
        "model_loaded": prediction_service.is_model_loaded(),
        "labels": prediction_service.get_supported_words(),
        "label_count": len(prediction_service.get_supported_words())
    }

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "status": "error",
            "message": exc.detail,
            "timestamp": datetime.now().isoformat()
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)