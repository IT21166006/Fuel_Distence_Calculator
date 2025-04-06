import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/FuelTypeScreen.css';
import fueltypelogo from '../images/fueltype.png'

const FuelTypeScreen = () => {
  const navigate = useNavigate();
  const [fuelType, setFuelType] = useState('');
  const [fuelPrice, setFuelPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [fuelTypes, setFuelTypes] = useState([]);

  useEffect(() => {
    fetchFuelTypes();
  }, []);

  useEffect(() => {
    if (fuelType) {
      fetchFuelPrice();
    }
  }, [fuelType]);

  const fetchFuelTypes = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://sl-fuel-price-api.onrender.com/fuel-prices');
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      setFuelTypes(data.fuel_prices);
    } catch (error) {
      console.error('Error fetching fuel types:', error);
      setError('Unable to fetch fuel types. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFuelPrice = () => {
    if (fuelType) {
      const selectedFuel = fuelTypes.find(fuel => fuel.fuel_type === fuelType);
      if (selectedFuel) {
        setFuelPrice(selectedFuel.price_per_litre);
        setLastUpdated(selectedFuel.effective_date);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (fuelType && fuelPrice) {
      localStorage.setItem('fuelType', fuelType);
      localStorage.setItem('fuelPrice', fuelPrice);
      navigate('/map-selection');
    }
  };

  return (
    <div className="fuel-container">
      <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <img 
                src={fueltypelogo } 
                alt="Vehicle Types" 
                className="img-fluid mb-3"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
              <h5 className="card-title mb-3">Select Your Fuel Type</h5>
              <p className="card-text">
              Pick your fuel type and get the latest fuel price.


              </p>
            </div>
          </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="fuelType">Select Fuel Type:</label>
          <select
            id="fuelType"
            value={fuelType}
            onChange={(e) => setFuelType(e.target.value)}
            required
          >
            <option value="">Select Fuel</option>
            {fuelTypes.map((fuel) => (
              <option key={fuel.fuel_type} value={fuel.fuel_type}>
                {fuel.fuel_type}
              </option>
            ))}
          </select>
        </div>

        {fuelType && (
          <div className="price-display">
            <h3>Current Price</h3>
            {loading ? (
              <p>Loading price...</p>
            ) : error ? (
              <p className="error-message">{error}</p>
            ) : (
              <>
                <p>{fuelPrice} LKR per liter</p>
                {lastUpdated && (
                  <p className="last-updated">{lastUpdated}</p>
                )}
              </>
            )}
          </div>
        )}

        <button 
          type="submit" 
          className="next-button"
          disabled={!fuelType || !fuelPrice || loading}
        >
          {loading ? 'Wait,Updating Today Prices...' : 'Next'}
        </button>
      </form>
    </div>
  );
};

export default FuelTypeScreen; 