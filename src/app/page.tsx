'use client'

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Loader2, AlertCircle, Info, Camera, Brain, Eye, Zap } from 'lucide-react';

// Type definitions
interface Model {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface PredictionResult {
  label: string;
  confidence: number;
}

interface MockResults {
  [key: string]: PredictionResult;
}

const MODELS: Model[] = [
  {
    id: 'resnet',
    name: 'ResNet-50',
    description: 'Deep residual network for general image classification',
    icon: Brain,
    color: '#3b82f6'
  },
  {
    id: 'unet',
    name: 'U-Net',
    description: 'Lightweight model optimized for mobile devices',
    icon: Camera,
    color: '#10b981'
  },
  {
    id: 'efficientnet',
    name: 'EfficientNet',
    description: 'Balanced accuracy and efficiency',
    icon: Zap,
    color: '#8b5cf6'
  },
  {
    id: 'model4',
    name: 'Unknown',
    description: 'Under Progress',
    icon: Eye,
    color: '#f59e0b'
  }
];

const ACCEPTED_FORMATS: string[] = ['image/jpeg', 'image/jpg', 'image/png'];
const MAX_FILE_SIZE: number = 10 * 1024 * 1024; // 10MB

export default function MLPredictionApp(): React.ReactElement {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('resnet50');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FORMATS.includes(file.type)) {
      return 'Please upload a valid image file (JPG, JPEG, or PNG)';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 10MB';
    }
    return null;
  };

  const handleFileSelect = (file: File): void => {
    const validation = validateFile(file);
    if (validation) {
      setError(validation);
      return;
    }

    setSelectedImage(file);
    setError(null);
    setPrediction(null);

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>): void => {
      if (e.target?.result) {
        setImagePreview(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const clearImage = (): void => {
    setSelectedImage(null);
    setImagePreview(null);
    setPrediction(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePredict = async (): Promise<void> => {
    if (!selectedImage || !selectedModel) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("model_name", selectedModel);

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setPrediction({ label: data.prediction, confidence: data.confidence });
    } catch (err) {
      setError("Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };


  const selectedModelData: Model | undefined = MODELS.find(m => m.id === selectedModel);

  return (
    <>
      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .max-width {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          text-align: center;
          margin-bottom: 40px;
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 16px;
        }

        .header p {
          color: #4a5568;
          font-size: 1.125rem;
        }

        .grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          padding: 24px;
        }

        .card-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin-bottom: 16px;
        }

        .upload-area {
          border: 2px dashed #cbd5e0;
          border-radius: 8px;
          padding: 48px 32px;
          text-align: center;
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .upload-area.drag-over {
          border-color: #3182ce;
          background-color: #ebf8ff;
        }

        .upload-area:hover {
          border-color: #a0aec0;
        }

        .upload-text {
          color: #4a5568;
          margin-bottom: 8px;
        }

        .upload-button {
          display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background: #3182ce;
          color: white;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .upload-button:hover {
          background: #2c5282;
        }

        .upload-info {
          font-size: 0.75rem;
          color: #718096;
          margin-top: 8px;
        }

        .image-preview {
          position: relative;
        }

        .preview-image {
          width: 100%;
          height: 256px;
          object-fit: contain;
          border-radius: 8px;
          background-color: #f7fafc;
        }

        .clear-button {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 4px;
          background: #e53e3e;
          color: white;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s ease;
        }

        .clear-button:hover {
          background: #c53030;
        }

        .models-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .models-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .model-card {
          padding: 16px;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .model-card:hover {
          border-color: #cbd5e0;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .model-card.selected {
          border-color: #3182ce;
          background-color: #ebf8ff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .model-icon {
          padding: 8px;
          border-radius: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .model-info {
          flex: 1;
        }

        .model-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .model-card.selected .model-name {
          color: #1e3a8a;
        }

        .model-description {
          font-size: 0.875rem;
          color: #4a5568;
        }

        .model-card.selected .model-description {
          color: #1d4ed8;
        }

        .selected-model {
          background-color: #f7fafc;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .predict-button {
          width: 100%;
          background: linear-gradient(135deg, #3182ce 0%, #8b5cf6 100%);
          color: white;
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .predict-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #2c5282 0%, #7c3aed 100%);
        }

        .predict-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-box {
          background-color: #fed7d7;
          border: 1px solid #feb2b2;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .error-text {
          color: #c53030;
        }

        .results-box {
          background: linear-gradient(135deg, #f0fff4 0%, #ebf8ff 100%);
          border-radius: 8px;
          padding: 24px;
          text-align: center;
        }

        .result-label {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a202c;
          margin-bottom: 8px;
        }

        .confidence-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-bottom: 16px;
        }

        .confidence-text {
          font-size: 0.875rem;
          color: #4a5568;
        }

        .confidence-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #3182ce;
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background-color: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(135deg, #10b981 0%, #3182ce 100%);
          transition: width 1s ease;
          border-radius: 4px;
        }

        .info-box {
          margin-top: 16px;
          padding: 16px;
          background-color: #ebf8ff;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
        }

        .info-text {
          font-size: 0.875rem;
          color: #1e40af;
        }

        .hidden {
          display: none;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .spin {
          animation: spin 1s linear infinite;
        }
      `}</style>

      <div className="container">
        <div className="max-width">
          <div className="header">
            <h1>AI Vision Predictor</h1>
            <p>Upload an image and select a model to get AI-powered predictions</p>
          </div>

          <div className="grid">
            <div className="column">
              <div className="card">
                <h2 className="card-title">Upload Image</h2>
                
                {!imagePreview ? (
                  <div
                    className={`upload-area ${dragOver ? 'drag-over' : ''}`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                  >
                    <Upload style={{ width: '48px', height: '48px', color: '#a0aec0', margin: '0 auto 16px' }} />
                    <p className="upload-text">
                      Drag and drop an image here, or
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="upload-button"
                    >
                      Choose File
                    </button>
                    <p className="upload-info">
                      JPG, JPEG, PNG up to 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="image-preview">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="preview-image"
                    />
                    <button
                      onClick={clearImage}
                      className="clear-button"
                    >
                      <X style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                )}
              </div>

              <div className="card">
                <h2 className="card-title">Select Model</h2>
                <div className="models-grid">
                  {MODELS.map((model: Model) => {
                    const Icon = model.icon;
                    const isSelected = selectedModel === model.id;
                    
                    return (
                      <button
                        key={model.id}
                        onClick={() => setSelectedModel(model.id)}
                        className={`model-card ${isSelected ? 'selected' : ''}`}
                      >
                        <div className="model-icon" style={{ backgroundColor: model.color }}>
                          <Icon/>
                        </div>
                        <div className="model-info">
                          <h3 className="model-name">{model.name}</h3>
                          <p className="model-description">{model.description}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="column">
              <div className="card">
                <h2 className="card-title">Make Prediction</h2>
                
                {selectedModelData && (
                  <div className="selected-model">
                    <div className="model-icon" style={{ backgroundColor: selectedModelData.color }}>
                      <selectedModelData.icon/>
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 500, color: '#1a202c' }}>{selectedModelData.name}</h3>
                      <p style={{ fontSize: '0.875rem', color: '#4a5568' }}>{selectedModelData.description}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handlePredict}
                  disabled={!selectedImage || isLoading}
                  className="predict-button"
                >
                  {isLoading ? (
                    <>
                      <Loader2 style={{ width: '20px', height: '20px' }} className="spin" />
                      <span>Predicting...</span>
                    </>
                  ) : (
                    'Run Prediction'
                  )}
                </button>
              </div>

              {error && (
                <div className="error-box">
                  <AlertCircle style={{ width: '20px', height: '20px', color: '#e53e3e', flexShrink: 0 }} />
                  <p className="error-text">{error}</p>
                </div>
              )}

              {prediction && (
                <div className="card">
                  <h2 className="card-title">Prediction Results</h2>
                  <div className="results-box">
                    <h3 className="result-label">{prediction.label}</h3>
                    <div className="confidence-container">
                      <span className="confidence-text">Confidence:</span>
                      <span className="confidence-value">
                        {(prediction.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${prediction.confidence * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="info-box">
                    <Info style={{ width: '20px', height: '20px', color: '#3182ce', flexShrink: 0, marginTop: '2px' }} />
                    <p className="info-text">
                      Try switching to a different model to see how predictions vary!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}