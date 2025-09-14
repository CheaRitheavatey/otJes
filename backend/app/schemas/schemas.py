# backend/app/schemas/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class PredictionResponse(BaseModel):
    predicted_word: str
    confidence: float
    status: str
    timestamp: str
    session_id: Optional[str] = None
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    message: str
    model_loaded: bool
    timestamp: str

class PredictionRequest(BaseModel):
    image: str  # base64 encoded image
    session_id: Optional[str] = None

class ModelInfoResponse(BaseModel):
    model_loaded: bool
    labels: List[str]
    label_count: int