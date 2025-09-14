// Google Teachable Machine Model Service
class TeachableMachineService {
  constructor() {
    this.model = null;
    this.isLoaded = false;
    this.modelPath = '/models/';
    this.classLabels = [];
  }

  // Load the Teachable Machine model
  async loadModel() {
    try {
      // Import TensorFlow.js
      const tf = await import('@tensorflow/tfjs');
      
      // Load metadata first to get class labels
      await this.loadMetadata();
      
      // Load the model from the public/models folder
      const modelUrl = `${this.modelPath}model.json`;
      this.model = await tf.loadLayersModel(modelUrl);
      
      this.isLoaded = true;
      console.log('Teachable Machine model loaded successfully');
      console.log('Class labels:', this.classLabels);
      return true;
    } catch (error) {
      console.error('Failed to load Teachable Machine model:', error);
      this.isLoaded = false;
      return false;
    }
  }

  // Load metadata from metadata.json
  async loadMetadata() {
    try {
      const response = await fetch(`${this.modelPath}metadata.json`);
      const metadata = await response.json();
      
      if (metadata.labels) {
        this.classLabels = metadata.labels;
      } else {
        // Fallback labels if metadata doesn't contain them
        this.classLabels = [
          'hello',
          'how are you',
          'bye',
          'good',
          'thank you',
          'please',
          'yes',
          'no'
        ];
      }
      
      console.log('Metadata loaded:', metadata);
      return metadata;
    } catch (error) {
      console.error('Failed to load metadata:', error);
      // Use fallback labels
      this.classLabels = [
        'hello',
        'how are you', 
        'bye',
        'good',
        'thank you',
        'please',
        'yes',
        'no'
      ];
      return null;
    }
  }

  // Preprocess canvas for the model
  async preprocessCanvas(canvas) {
    const tf = await import('@tensorflow/tfjs');
    
    // Create a temporary canvas for preprocessing
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    
    // Set canvas size to match model input (224x224 for Teachable Machine)
    tempCanvas.width = 224;
    tempCanvas.height = 224;
    
    // Draw and resize the image
    tempCtx.drawImage(canvas, 0, 0, 224, 224);
    
    // Convert to tensor and normalize
    const tensor = tf.browser.fromPixels(tempCanvas)
      .resizeNearestNeighbor([224, 224])
      .toFloat()
      .div(255.0)
      .expandDims(0);
    
    return tensor;
  }

  // Predict sign from canvas
  async predictSign(canvas) {
    if (!this.isLoaded || !this.model) {
      throw new Error('Model not loaded');
    }

    try {
      // Preprocess the canvas
      const tensor = await this.preprocessCanvas(canvas);
      
      // Make prediction
      const predictions = await this.model.predict(tensor).data();
      
      // Clean up tensor
      tensor.dispose();
      
      // Process predictions
      return this.processPredictions(predictions);
    } catch (error) {
      console.error('Prediction error:', error);
      throw error;
    }
  }

  // Process model predictions
  processPredictions(predictions) {
    // Find the highest confidence prediction
    let maxConfidence = 0;
    let predictedIndex = 0;
    
    for (let i = 0; i < predictions.length; i++) {
      if (predictions[i] > maxConfidence) {
        maxConfidence = predictions[i];
        predictedIndex = i;
      }
    }
    
    const predictedClass = this.classLabels[predictedIndex] || `Class_${predictedIndex}`;
    
    return {
      sign: predictedClass,
      confidence: maxConfidence,
      category: this.categorizeSign(predictedClass),
      allPredictions: predictions.map((confidence, index) => ({
        class: this.classLabels[index] || `Class_${index}`,
        confidence: confidence
      }))
    };
  }

  // Categorize detected signs
  categorizeSign(sign) {
    const categories = {
      greeting: ['hello', 'hi'],
      question: ['how are you', 'what', 'where', 'when', 'why', 'how'],
      farewell: ['bye', 'goodbye', 'see you'],
      courtesy: ['thank you', 'please', 'sorry', 'excuse me'],
      response: ['yes', 'no', 'maybe'],
      adjective: ['good', 'bad', 'happy', 'sad', 'big', 'small']
    };

    for (const [category, words] of Object.entries(categories)) {
      if (words.some(word => sign.toLowerCase().includes(word))) {
        return category;
      }
    }

    return 'unknown';
  }

  // Check if model is ready
  isModelReady() {
    return this.isLoaded && this.model !== null;
  }

  // Get model info
  getModelInfo() {
    if (!this.isLoaded) {
      return null;
    }

    return {
      inputShape: this.model.inputs[0].shape,
      outputShape: this.model.outputs[0].shape,
      classLabels: this.classLabels,
      isLoaded: this.isLoaded
    };
  }

  // Get class labels
  getClassLabels() {
    return this.classLabels;
  }
}

export const teachableMachineService = new TeachableMachineService();