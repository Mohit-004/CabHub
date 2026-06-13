import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SimulationProvider } from './context/SimulationContext';
import PortalSelector from './pages/PortalSelector';
import PassengerPortal from './pages/PassengerPortal';
import DriverPortal from './pages/DriverPortal';
import AdminPortal from './pages/AdminPortal';

function App() {
  return (
    <SimulationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<PortalSelector />} />
          <Route path="/passenger" element={<PassengerPortal />} />
          <Route path="/driver" element={<DriverPortal />} />
          <Route path="/admin" element={<AdminPortal />} />
        </Routes>
      </Router>
    </SimulationProvider>
  );
}

export default App;
