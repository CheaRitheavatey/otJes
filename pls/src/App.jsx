// frontend/src/App.js
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [prediction, setPrediction] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [supportedWords, setSupportedWords] = useState([]);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchSupportedWords();
  }, []);

  const fetchSupportedWords = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/words');
      setSupportedWords(response.data.words);
    } catch (error) {
      console.error('Error fetching supported words:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480 } 
      });
      videoRef.current.srcObject = stream;
      setIsRecording(true);
      setCameraError(null);
    } catch (error) {
      setCameraError('Cannot access camera: ' + error.message);
      setIsRecording(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsRecording(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const captureAndPredict = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Draw current video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert canvas to base64
    const base64Image = canvas.toDataURL('image/jpeg');

    try {
      const response = await axios.post('http://localhost:8080/api/predict-base64', {
        image: base64Image
      });

      setPrediction(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      setPrediction({
        predicted_word: 'ERROR',
        confidence: 0,
        status: 'error'
      });
    }
  };

  const startRealTimePrediction = () => {
    startCamera();
    // Predict every 500ms
    intervalRef.current = setInterval(captureAndPredict, 500);
  };

  const stopRealTimePrediction = () => {
    stopCamera();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sign Language to Subtitle</h1>
        <p>Real-time sign language detection using AI</p>
      </header>

      <main className="main-content">
        <div className="camera-section">
          <div className="video-container">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="camera-feed"
            />
            <canvas
              ref={canvasRef}
              width="640"
              height="480"
              style={{ display: 'none' }}
            />
          </div>

          <div className="controls">
            {!isRecording ? (
              <button onClick={startRealTimePrediction} className="btn-start">
                Start Detection
              </button>
            ) : (
              <button onClick={stopRealTimePrediction} className="btn-stop">
                Stop Detection
              </button>
            )}
            
            <button onClick={captureAndPredict} className="btn-capture">
              Capture & Predict
            </button>
          </div>

          {cameraError && (
            <div className="error-message">
              {cameraError}
            </div>
          )}
        </div>

        <div className="results-section">
          <h2>Prediction Results</h2>
          
          {prediction && (
            <div className="prediction-result">
              <div className="predicted-word">
                {prediction.predicted_word}
              </div>
              <div className="confidence">
                Confidence: {(prediction.confidence * 100).toFixed(2)}%
              </div>
              <div className="status">
                Status: {prediction.status}
              </div>
            </div>
          )}

          <div className="supported-words">
            <h3>Supported Words</h3>
            <div className="words-list">
              {supportedWords.map((word, index) => (
                <span key={index} className="word-tag">{word}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;