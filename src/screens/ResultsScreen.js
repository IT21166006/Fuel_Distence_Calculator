import React from 'react';
import '../styles/ResultsScreen.css';

const ResultsScreen = () => {
  const vehicleType = localStorage.getItem('vehicleType');
  const fuelConsumption = localStorage.getItem('fuelConsumption');
  const fuelType = localStorage.getItem('fuelType');
  const fuelPrice = localStorage.getItem('fuelPrice');
  const distance = localStorage.getItem('distance');

  const calculateResults = () => {
    const litersNeeded = distance / fuelConsumption;
    const totalCost = litersNeeded * fuelPrice;

    return {
      litersNeeded: litersNeeded.toFixed(2),
      totalCost: totalCost.toFixed(2)
    };
  };

  const results = calculateResults();

  return (
    <div className="results-container">
      <h2>Journey Summary</h2>
      
      <div className="results-card">
        <div className="result-item">
          <span className="label">Vehicle Type:</span>
          <span className="value">{vehicleType}</span>
        </div>

        <div className="result-item">
          <span className="label">Fuel Consumption:</span>
          <span className="value">{fuelConsumption} KM per 1 Liter</span>
        </div>

        <div className="result-item">
          <span className="label">Distance:</span>
          <span className="value">{distance} KM</span>
        </div>

        <div className="result-item">
          <span className="label">Fuel Type:</span>
          <span className="value">{fuelType}</span>
        </div>

        <div className="result-item">
          <span className="label">Current Fuel Price:</span>
          <span className="value">{fuelPrice} LKR per liter</span>
        </div>

        <div className="result-item highlight">
          <span className="label">Liters Needed:</span>
          <span className="value">{results.litersNeeded} L</span>
        </div>

        <div className="result-item highlight">
          <span className="label">Total Cost:</span>
          <span className="value">{results.totalCost} LKR</span>
        </div>
      </div>

      <button 
        className="restart-button"
        onClick={() => window.location.href = '/'}
      >
        Start New Calculation
      </button>
    </div>
  );
};

export default ResultsScreen; 