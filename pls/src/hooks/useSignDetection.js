import { useCallback } from 'react';
import { useTeachableMachine } from './useTeachableMachine';
import { SIGN_TRANSLATIONS } from '../types';

export const useSignDetection = (settings) => {
  // Use Teachable Machine as the primary detection method
  const {
    isInitialized,
    isDetecting,
    isProcessing,
    currentGesture,
    detectedSigns: rawDetectedSigns,
    modelInfo,
    canvasRef,
    startDetection: startTeachableDetection,
    stopDetection: stopTeachableDetection,
    clearDetections: clearTeachableDetections,
    initializeModel
  } = useTeachableMachine(settings);

  // Filter signs based on confidence threshold
  const detectedSigns = rawDetectedSigns.filter(sign => sign.confidence >= settings.minConfidence);

  const startDetection = useCallback((videoElement) => {
    if (videoElement && isInitialized) {
      startTeachableDetection(videoElement);
    }
  }, [startTeachableDetection, isInitialized]);

  const stopDetection = useCallback(() => {
    stopTeachableDetection();
  }, [stopTeachableDetection]);

  const translateSign = useCallback((sign) => {
    const translations = SIGN_TRANSLATIONS[settings.language];
    return translations[sign] || sign;
  }, [settings.language]);

  const clearDetections = useCallback(() => {
    clearTeachableDetections();
  }, [clearTeachableDetections]);

  return {
    // Detection state
    isInitialized,
    detectedSigns,
    currentGesture,
    isDetecting,
    isProcessing,
    canvasRef,
    
    // Detection controls
    startDetection,
    stopDetection,
    clearDetections,
    translateSign,
    
    // Teachable Machine specific
    modelInfo,
    initializeModel
  };
};