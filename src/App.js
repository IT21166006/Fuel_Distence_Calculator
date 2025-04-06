import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/CommonStyles.css';
import WelcomeScreen from './screens/WelcomeScreen';
import VehicleTypeScreen from './screens/VehicleTypeScreen';
import FuelTypeScreen from './screens/FuelTypeScreen';
import MapSelectionScreen from './screens/MapSelectionScreen';
import ResultsScreen from './screens/ResultsScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/vehicle-type" element={<VehicleTypeScreen />} />
          <Route path="/fuel-type" element={<FuelTypeScreen />} />
          <Route path="/map-selection" element={<MapSelectionScreen />} />
          <Route path="/results" element={<ResultsScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
