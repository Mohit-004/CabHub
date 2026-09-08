import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SimulationProvider } from './context/SimulationContext';
import { ToastProvider } from './components/ToastNotification';
import SplashScreen from './components/SplashScreen';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PassengerPortal from './pages/PassengerPortal';
import DriverPortal from './pages/DriverPortal';
import AdminPortal from './pages/AdminPortal';
import ProfilePage from './pages/ProfilePage';
import NotFound from './pages/NotFound';


function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show splash for 1.8 seconds on first load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SimulationProvider>
      <ToastProvider>
        <AnimatePresence mode="wait">
          {isLoading && <SplashScreen key="splash" isLoading={isLoading} />}
        </AnimatePresence>

        {!isLoading && (
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/passenger" element={<PassengerPortal />} />
              <Route path="/driver" element={<DriverPortal />} />
              <Route path="/admin" element={<AdminPortal />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        )}
      </ToastProvider>
    </SimulationProvider>
  );
}

export default App;
