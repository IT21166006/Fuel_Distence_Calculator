import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/VehicleTypeScreen.css';
import vehitypeimg from '../images/vehicletype.png'

const VehicleTypeScreen = () => {
  const navigate = useNavigate();
  const [vehicleType, setVehicleType] = useState('');
  const [customConsumption, setCustomConsumption] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const vehicleTypes = [
    { type: 'Threewheeler', consumption: 25 },
    { type: 'Bike', consumption: 45 },
    { type: 'Mini Car', consumption: 18 },
    { type: 'Car', consumption: 14 },
    { type: 'Luxury Car', consumption: 10 },
    { type: 'Van', consumption: 8 },
    { type: 'Buddy Lorry', consumption: 6 },
    { type: 'Truck', consumption: 5 },
    { type: 'Lorry', consumption: 4 }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (vehicleType) {
      const selectedVehicle = vehicleTypes.find(v => v.type === vehicleType);
      const consumption = showCustomInput ? customConsumption : selectedVehicle.consumption;
      
      localStorage.setItem('vehicleType', vehicleType);
      localStorage.setItem('fuelConsumption', consumption);
      navigate('/fuel-type');
    }
  };

  const handleVehicleChange = (e) => {
    const selectedType = e.target.value;
    setVehicleType(selectedType);
    setShowCustomInput(false);
    setCustomConsumption('');
  };

  const getRecommendedConsumption = () => {
    const selectedVehicle = vehicleTypes.find(v => v.type === vehicleType);
    return selectedVehicle ? selectedVehicle.consumption : '';
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <img 
                src={vehitypeimg} 
                alt="Vehicle Types" 
                className="img-fluid mb-3"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
              <h5 className="card-title mb-3">Choose your vehicle type</h5>
              <p className="card-text">
                Select your vehicle type and enter how many KM it runs per liter.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="card shadow-sm">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="vehicleType" className="form-label">Select Vehicle Type:</label>
                <select
                  id="vehicleType"
                  className="form-select"
                  value={vehicleType}
                  onChange={handleVehicleChange}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicleTypes.map((vehicle) => (
                    <option key={vehicle.type} value={vehicle.type}>
                      {vehicle.type} ({vehicle.consumption} km/L)
                    </option>
                  ))}
                </select>
              </div>

              {vehicleType && (
                <div className="consumption-info">
                  <p className="recommended-consumption">
                    Recommended fuel consumption: {getRecommendedConsumption()} km/L
                  </p>
                  <div className="custom-consumption">
                    <div className="form-check mb-3">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="customConsumption"
                        checked={showCustomInput}
                        onChange={(e) => setShowCustomInput(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="customConsumption">
                        Use custom fuel consumption
                      </label>
                    </div>
                    {showCustomInput && (
                      <div className="input-group mb-3">
                        <input
                          type="number"
                          className="form-control"
                          value={customConsumption}
                          onChange={(e) => setCustomConsumption(e.target.value)}
                          placeholder="Enter custom consumption (km/L)"
                          min="1"
                          step="0.1"
                          required
                        />
                        <span className="input-group-text">km/L</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-success w-100"
                disabled={!vehicleType || (showCustomInput && !customConsumption)}
              >
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehicleTypeScreen; 