import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const SimulationContext = createContext(null);

// Popular landmark locations in India for mapping and selection
export const INDIAN_LANDMARKS = [
  { name: 'Connaught Place, New Delhi', lat: 28.6304, lng: 77.2177 },
  { name: 'Gateway of India, Mumbai', lat: 18.9220, lng: 72.8347 },
  { name: 'Bangalore Palace, Bengaluru', lat: 12.9980, lng: 77.5920 },
  { name: 'Victoria Memorial, Kolkata', lat: 22.5448, lng: 88.3426 },
  { name: 'Hawa Mahal, Jaipur', lat: 26.9239, lng: 75.8267 },
  { name: 'Taj Mahal, Agra', lat: 27.1751, lng: 78.0421 },
  { name: 'Charminar, Hyderabad', lat: 17.3616, lng: 78.4747 },
  { name: 'Marina Beach, Chennai', lat: 13.0418, lng: 80.2824 },
  { name: 'India Gate, New Delhi', lat: 28.6129, lng: 77.2295 },
  { name: 'Chhatrapati Shivaji Terminus, Mumbai', lat: 18.9400, lng: 72.8353 }
];

export const SimulationProvider = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // Auth States
  const [passenger, setPassenger] = useState(() => {
    const saved = localStorage.getItem('cabhub_passenger');
    return saved ? JSON.parse(saved) : null;
  });
  const [driver, setDriver] = useState(() => {
    const saved = localStorage.getItem('cabhub_driver');
    return saved ? JSON.parse(saved) : null;
  });
  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem('cabhub_admin');
    return saved ? JSON.parse(saved) : null;
  });

  // Active Rides and History
  const [activeRide, setActiveRide] = useState(() => {
    const saved = localStorage.getItem('cabhub_active_ride');
    return saved ? JSON.parse(saved) : null;
  });
  const [rideHistory, setRideHistory] = useState(() => {
    const saved = localStorage.getItem('cabhub_ride_history');
    return saved ? JSON.parse(saved) : [];
  });

  // Available drivers online (for simulator visual)
  const [onlineDrivers, setOnlineDrivers] = useState([
    { id: 'drv_1', name: 'Rajesh Kumar', vehicle: 'Maruti Suzuki Dzire (Sedan)', lat: 28.625, lng: 77.210, rating: 4.8 },
    { id: 'drv_2', name: 'Amit Singh', vehicle: 'Tata Nexon (SUV)', lat: 28.635, lng: 77.225, rating: 4.9 },
    { id: 'drv_3', name: 'Vikram Patel', vehicle: 'WagonR (Mini)', lat: 28.620, lng: 77.230, rating: 4.6 }
  ]);

  // Handle document theme attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Persist sessions
  useEffect(() => {
    if (passenger) localStorage.setItem('cabhub_passenger', JSON.stringify(passenger));
    else localStorage.removeItem('cabhub_passenger');
  }, [passenger]);

  useEffect(() => {
    if (driver) localStorage.setItem('cabhub_driver', JSON.stringify(driver));
    else localStorage.removeItem('cabhub_driver');
  }, [driver]);

  useEffect(() => {
    if (admin) localStorage.setItem('cabhub_admin', JSON.stringify(admin));
    else localStorage.removeItem('cabhub_admin');
  }, [admin]);

  useEffect(() => {
    if (activeRide) localStorage.setItem('cabhub_active_ride', JSON.stringify(activeRide));
    else localStorage.removeItem('cabhub_active_ride');
  }, [activeRide]);

  useEffect(() => {
    localStorage.setItem('cabhub_ride_history', JSON.stringify(rideHistory));
  }, [rideHistory]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Auth Operations
  const login = (role, credentials) => {
    if (role === 'passenger') {
      const mockUser = {
        id: 'usr_p123',
        name: credentials.email.split('@')[0].toUpperCase(),
        email: credentials.email,
        phone: '+91 98765 43210',
        walletBalance: 750
      };
      setPassenger(mockUser);
      return { success: true, user: mockUser };
    }
    if (role === 'driver') {
      const mockDriver = {
        id: 'drv_d456',
        name: credentials.email.split('@')[0].toUpperCase(),
        email: credentials.email,
        phone: '+91 99999 88888',
        status: 'inactive', // inactive, active, on-ride
        vehicle: {
          model: 'Maruti Suzuki Dzire',
          number: 'DL 3C AM 4567',
          type: 'Sedan'
        },
        rating: 4.9,
        earnings: 1250,
        lat: 28.6139,
        lng: 77.2090
      };
      setDriver(mockDriver);
      return { success: true, user: mockDriver };
    }
    if (role === 'admin') {
      if (credentials.email === 'admin@cabhub.com' && credentials.password === 'admin123') {
        const mockAdmin = {
          id: 'admin_001',
          name: 'CabHub Director',
          email: 'admin@cabhub.com'
        };
        setAdmin(mockAdmin);
        return { success: true, user: mockAdmin };
      }
      return { success: false, message: 'Invalid Admin Credentials' };
    }
    return { success: false, message: 'Invalid Role' };
  };

  const register = (role, data) => {
    if (role === 'passenger') {
      const mockUser = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 98765 00000',
        walletBalance: 500
      };
      setPassenger(mockUser);
      return { success: true, user: mockUser };
    }
    if (role === 'driver') {
      const mockDriver = {
        id: 'drv_' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        phone: data.phone || '+91 99999 00000',
        status: 'inactive',
        vehicle: {
          model: data.vehicleModel || 'Suzuki Tour S',
          number: data.vehicleNumber || 'DL 1C Z 9999',
          type: data.vehicleType || 'Mini'
        },
        rating: 5.0,
        earnings: 0,
        lat: 28.6129,
        lng: 77.2295
      };
      setDriver(mockDriver);
      return { success: true, user: mockDriver };
    }
  };

  const logout = (role) => {
    if (role === 'passenger') setPassenger(null);
    if (role === 'driver') setDriver(null);
    if (role === 'admin') setAdmin(null);
  };

  // Ride Operations
  const requestRide = (pickup, drop, fare, vehicleType, distance, duration) => {
    if (!passenger) return { success: false, message: 'Please log in as passenger first' };
    
    const newRide = {
      id: 'ride_' + Math.random().toString(36).substring(2, 9),
      passenger: {
        id: passenger.id,
        name: passenger.name,
        phone: passenger.phone
      },
      pickup: {
        name: pickup.name,
        lat: pickup.lat,
        lng: pickup.lng
      },
      drop: {
        name: drop.name,
        lat: drop.lat,
        lng: drop.lng
      },
      fare: parseFloat(fare),
      vehicleType,
      distance,
      duration,
      status: 'requested', // requested, accepted, arriving, arrived, started, completed, cancelled
      createdAt: new Date().toISOString(),
      driver: null,
      driverLat: pickup.lat - 0.012, // start driver slightly away
      driverLng: pickup.lng - 0.012,
    };

    setActiveRide(newRide);
    return { success: true, ride: newRide };
  };

  const acceptRideByDriver = (driverProfile) => {
    if (!activeRide) return { success: false, message: 'No active ride request found' };
    
    const updatedRide = {
      ...activeRide,
      status: 'accepted',
      driver: {
        id: driverProfile.id,
        name: driverProfile.name,
        phone: driverProfile.phone,
        vehicle: driverProfile.vehicle,
        rating: driverProfile.rating
      }
    };

    setActiveRide(updatedRide);
    
    // Update driver state
    if (driver && driver.id === driverProfile.id) {
      setDriver(prev => ({ ...prev, status: 'on-ride' }));
    }

    return { success: true, ride: updatedRide };
  };

  const updateRideStatus = (newStatus) => {
    if (!activeRide) return { success: false, message: 'No active ride found' };

    let updatedRide = { ...activeRide, status: newStatus };

    if (newStatus === 'started') {
      updatedRide.startTime = new Date().toISOString();
    }

    if (newStatus === 'completed') {
      updatedRide.endTime = new Date().toISOString();
      
      // Update passenger balance (deduct fare)
      if (passenger && activeRide.passenger.id === passenger.id) {
        setPassenger(prev => ({
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance - activeRide.fare)
        }));
      }

      // Update driver earnings
      if (driver && activeRide.driver && activeRide.driver.id === driver.id) {
        setDriver(prev => ({
          ...prev,
          earnings: prev.earnings + activeRide.fare,
          status: 'active'
        }));
      }

      // Add to history
      setRideHistory(prev => [updatedRide, ...prev]);
      setActiveRide(null);
    } else {
      setActiveRide(updatedRide);
    }

    return { success: true, ride: updatedRide };
  };

  const cancelRide = () => {
    if (!activeRide) return { success: false };
    
    const cancelledRide = {
      ...activeRide,
      status: 'cancelled',
      endTime: new Date().toISOString()
    };

    setRideHistory(prev => [cancelledRide, ...prev]);
    setActiveRide(null);

    if (driver && activeRide.driver && activeRide.driver.id === driver.id) {
      setDriver(prev => ({ ...prev, status: 'active' }));
    }

    return { success: true };
  };

  // Driver Status toggler (Online / Offline)
  const toggleDriverDuty = () => {
    if (!driver) return;
    const newStatus = driver.status === 'inactive' ? 'active' : 'inactive';
    setDriver(prev => ({ ...prev, status: newStatus }));
  };

  // Simulation Interval: Move Driver GPS marker closer to pickup / dropoff
  useEffect(() => {
    if (!activeRide) return;

    let intervalId;

    if (activeRide.status === 'accepted' || activeRide.status === 'arriving') {
      // Driver moving to pickup
      intervalId = setInterval(() => {
        setActiveRide(prev => {
          if (!prev) return null;
          const targetLat = prev.pickup.lat;
          const targetLng = prev.pickup.lng;
          
          const dLat = targetLat - prev.driverLat;
          const dLng = targetLng - prev.driverLng;
          
          const distanceLeft = Math.sqrt(dLat * dLat + dLng * dLng);
          
          if (distanceLeft < 0.001) {
            // Arrived at pickup
            clearInterval(intervalId);
            return { ...prev, status: 'arrived', driverLat: targetLat, driverLng: targetLng };
          }
          
          // Move 10% closer each second
          return {
            ...prev,
            status: 'arriving',
            driverLat: prev.driverLat + dLat * 0.15,
            driverLng: prev.driverLng + dLng * 0.15
          };
        });
      }, 1500);
    } 
    else if (activeRide.status === 'started') {
      // Driver driving to dropoff
      intervalId = setInterval(() => {
        setActiveRide(prev => {
          if (!prev) return null;
          const targetLat = prev.drop.lat;
          const targetLng = prev.drop.lng;
          
          const dLat = targetLat - prev.driverLat;
          const dLng = targetLng - prev.driverLng;
          
          const distanceLeft = Math.sqrt(dLat * dLat + dLng * dLng);
          
          if (distanceLeft < 0.001) {
            // Completed route, wait for driver to hit complete
            clearInterval(intervalId);
            return { ...prev, driverLat: targetLat, driverLng: targetLng };
          }
          
          // Move 8% closer to dropoff each second
          return {
            ...prev,
            driverLat: prev.driverLat + dLat * 0.10,
            driverLng: prev.driverLng + dLng * 0.10
          };
        });
      }, 1500);
    }

    return () => clearInterval(intervalId);
  }, [activeRide?.status]);

  // Reset simulator back to fresh states
  const resetSimulator = () => {
    setPassenger(null);
    setDriver(null);
    setAdmin(null);
    setActiveRide(null);
    setRideHistory([]);
    localStorage.clear();
    setTheme('light');
  };

  return (
    <SimulationContext.Provider
      value={{
        theme,
        toggleTheme,
        passenger,
        driver,
        admin,
        activeRide,
        rideHistory,
        onlineDrivers,
        login,
        register,
        logout,
        requestRide,
        acceptRideByDriver,
        updateRideStatus,
        cancelRide,
        toggleDriverDuty,
        resetSimulator,
        setPassenger,
        setDriver
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error('useSimulation must be used within a SimulationProvider');
  }
  return context;
};
