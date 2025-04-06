import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/WelcomeScreen.css';

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mount
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const handleGetStarted = () => {
    navigate('/vehicle-type');
  };

  return (
    <div className="welcome-container">
      <div className="background-image"></div>
      <div className="background-overlay"></div>
      
      <div className={`content-overlay ${isLoaded ? 'loaded' : ''}`}>
        <div className="logo-container">
          <div className="logo-circle">
            <img 
              src="/images/logo.png" 
              alt="Fuel Calculator Logo" 
              className="logo-image"
            />
          </div>
        </div>
        
        <h1 className="title">
          <span className="title-line">Fuel Cost</span>
          <span className="title-line">Calculator</span>
        </h1>
        
        <p className="subtitle">
          Plan your journey and calculate fuel costs with precision
        </p>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">📊</span>
            <span>Accurate Calculations</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🚗</span>
            <span>Multiple Vehicles</span>
          </div>
          <div className="feature">
            <span className="feature-icon">📍</span>
            <span>Route Planning</span>
          </div>
          <div className="feature">
            <span className="feature-icon">🤖</span>
            <span>Realtime Price Updating</span>
          </div>
        </div>

        <button 
          onClick={handleGetStarted} 
          className="get-started-button"
        >
          <span className="button-text">Get Started</span>
          <span className="button-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen; 