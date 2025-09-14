import React from 'react';
import { ArrowLeft, Play, Camera, Brain, Zap } from 'lucide-react';

export const AboutPage = ({ onBackToMain }) => {
  const videoUrl =" https://www.youtube.com/embed/s-GCGppMOGQ?rel=0&modestbranding=1";
  return (
    <div className="about-page">
      {/* Header */}
      <header className="about-header">
        <div className="header-content">
          <button
            onClick={onBackToMain}
            className="back-btn"
          >
            <ArrowLeft size={20} />
            <span>Back to Main</span>
          </button>
          
          <div className="header-center">
            <div className="app-logo">
              <Camera size={20} />
            </div>
            <h1 className="page-title">About the Project</h1>
          </div>
          
          <div className="header-spacer"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="about-main">
        <div className="about-container">
          {/* Project Description */}
          <section className="project-description">
            <div className="description-header">
              <Brain className="section-icon" size={24} />
              <h2>Sign Language to Subtitle Converter</h2>
            </div>
            
            <p className="description-text">
              This innovative application leverages cutting-edge computer vision and artificial intelligence 
              to provide real-time American Sign Language (ASL) recognition and subtitle generation. 
              Using advanced MediaPipe hand tracking technology and Sea Lion AI natural language processing, 
              the system can detect sign language gestures from live camera feeds or uploaded videos, 
              translate them into readable text, and convert individual signs into fluent, grammatically 
              correct sentences. The application supports multiple languages, customizable subtitle positioning, 
              and provides comprehensive detection analytics, making it an invaluable tool for accessibility, 
              education, and communication bridging between deaf and hearing communities.
            </p>

            <div className="features-grid">
              <div className="feature-card">
                <Camera className="feature-icon" size={20} />
                <h3>Real-time Detection</h3>
                <p>Live camera feed processing with instant sign recognition</p>
              </div>
              
              <div className="feature-card">
                <Brain className="feature-icon" size={20} />
                <h3>AI-Powered Translation</h3>
                <p>Sea Lion AI converts signs into natural, fluent sentences</p>
              </div>
              
              <div className="feature-card">
                <Zap className="feature-icon" size={20} />
                <h3>Multi-language Support</h3>
                <p>Supports English, Spanish, and Khmer translations</p>
              </div>
            </div>
          </section>

          {/* Video Demo */}
          <section className="video-demo">
            <div className="demo-header">
              <Play className="section-icon" size={24} />
              <h2>Technology Demonstration</h2>
            </div>
            
            <div className="video-container">
              <iframe
                width="100%"
                height="400"
                src={videoUrl}
                title="Sign Language Technology Demo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="demo-video"
              ></iframe>
            </div>
            
            <p className="video-caption">
              Watch this demonstration of advanced sign language recognition technology 
              and real-time subtitle generation in action.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};