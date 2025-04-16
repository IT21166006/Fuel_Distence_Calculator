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
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mapCenter, setMapCenter] = useState([6.9271, 79.8612]); // Default to Colombo

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

  const searchLocations = async () => {
    if (searchQuery.length < 3) {
      setError('Please enter at least 3 characters to search');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error searching locations:', error);
      setError('Error searching locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const { lat, lon, display_name } = suggestion;
    const position = [parseFloat(lat), parseFloat(lon)];
    
    if (selectingStart) {
      setStartPoint({ lat: position[0], lng: position[1] });
    } else {
      setEndPoint({ lat: position[0], lng: position[1] });
    }
    
    setMapCenter(position);
    setSearchQuery(display_name);
    setShowSuggestions(false);
    setSelectingStart(!selectingStart);
  };

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
      if (!data.features || data.features.length === 0) {
        throw new Error('No route found between the selected points');
      }

      const distanceInKm = data.features[0].properties.segments[0].distance / 1000;
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
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card mb-4 shadow-sm">
            <div className="card-body text-center">
              <img 
                src={maplogo} 
                alt="Map Selection" 
                className="img-fluid mb-3"
                style={{ maxHeight: '200px', objectFit: 'contain' }}
              />
              <h5 className="card-title mb-3">Select Journey Points</h5>
              <p className="card-text">
                Search and select your start and end points on the map.
              </p>
            </div>
          </div>

          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="search-container">
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder={`Enter ${selectingStart ? 'start' : 'end'} location...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}

                    
                  />
                  {searchQuery && (
                    <button
                      className="btn btn-outline-secondary clear-button justify-content-center"
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                    >
                      <span className="clear-icon">×</span>
                    </button>
                  )}
                </div>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-success rounded-pill px-4"
                    onClick={searchLocations}
                    disabled={loading}
                  >
                    {loading ? 'Searching...' : 'Search Location'}
                  </button>
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <div className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="suggestion-item"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        {suggestion.display_name}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="map-instructions mt-3">
                <p className="text-center">
                  {selectingStart ? 'Select start point' : 'Select end point'} on the map
                </p>
                {error && <p className="error-message text-center">{error}</p>}
              </div>
            </div>
          </div>

          <div className="map-wrapper mb-4">
            <MapContainer
              center={mapCenter}
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

          <div className="points-info text-center mb-4">
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

          <div className="button-group d-flex justify-content-center gap-3">
            <button
              className="btn btn-secondary"
              onClick={resetPoints}
              disabled={!startPoint && !endPoint}
            >
              Reset Points
            </button>
            <button
              className="btn btn-success"
              onClick={calculateDistance}
              disabled={!startPoint || !endPoint || loading}
            >
              {loading ? 'Calculating...' : 'Calculate Distance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapSelectionScreen; 