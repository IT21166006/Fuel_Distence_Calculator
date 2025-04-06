import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/MapSelectionScreen.css';
import maplogo from '../images/map.png'

const MapSelectionScreen = () => {
  const navigate = useNavigate();
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [distance, setDistance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectingStart, setSelectingStart] = useState(true);

  // Custom icons for start and end points
  const startIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const endIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const StartMarker = () => {
    useMapEvents({
      click(e) {
        if (selectingStart) {
          setStartPoint(e.latlng);
          setSelectingStart(false);
          setError(null);
        }
      },
    });

    return startPoint ? <Marker position={startPoint} icon={startIcon} /> : null;
  };

  const EndMarker = () => {
    useMapEvents({
      click(e) {
        if (!selectingStart) {
          setEndPoint(e.latlng);
          setSelectingStart(true);
          setError(null);
        }
      },
    });

    return endPoint ? <Marker position={endPoint} icon={endIcon} /> : null;
  };

  const calculateDistance = async () => {
    if (!startPoint || !endPoint) {
      setError('Please select both start and end points');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf62487ee0f8cdc1cf4d2c83c3d643823d8e60&start=${startPoint.lng},${startPoint.lat}&end=${endPoint.lng},${endPoint.lat}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      console.log('API Response:', data);

      if (!data.features || data.features.length === 0) {
        throw new Error('No route found between the selected points');
      }

      const distanceInKm = data.features[0].properties.segments[0].distance / 1000;
      console.log('Calculated Distance:', distanceInKm);

      setDistance(distanceInKm);
      localStorage.setItem('distance', distanceInKm);
      navigate('/results');
    } catch (error) {
      console.error('Error calculating distance:', error);
      setError(`Error calculating distance: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetPoints = () => {
    setStartPoint(null);
    setEndPoint(null);
    setSelectingStart(true);
    setError(null);
  };

  return (
    <div className="map-container">
      
      <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <img 
                src={maplogo} 
                alt="Vehicle Types" 
                className="img-fluid mb-3"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
              <h5 className="card-title mb-3">Select Journey Points</h5>
              <p className="card-text">
              Choose your start and end points on the map. We’ll calculate the distance.
              </p>
            </div>
          </div>
      <div className="map-instructions">
        <p>Click on the map to set {selectingStart ? 'start' : 'end'} point</p>
        {error && <p className="error-message">{error}</p>}
      </div>
      
      <div className="map-wrapper">
        <MapContainer
          center={[6.9271, 79.8612]}
          zoom={13}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <StartMarker />
          <EndMarker />
        </MapContainer>
      </div>

      <div className="points-info">
        {startPoint && (
          <p className="start-point">
            Start Point: {startPoint.lat.toFixed(4)}, {startPoint.lng.toFixed(4)}
          </p>
        )}
        {endPoint && (
          <p className="end-point">
            End Point: {endPoint.lat.toFixed(4)}, {endPoint.lng.toFixed(4)}
          </p>
        )}
        {loading && <p>Calculating distance...</p>}
      </div>

      <div className="button-group">
        <button
          className="reset-button"
          onClick={resetPoints}
          disabled={!startPoint && !endPoint}
        >
          Reset Points
        </button>
        <button
          className="calculate-button"
          onClick={calculateDistance}
          disabled={!startPoint || !endPoint || loading}
        >
          {loading ? 'Calculating...' : 'Calculate Distance'}
        </button>
      </div>
    </div>
  );
};

export default MapSelectionScreen; 