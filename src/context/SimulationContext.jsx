import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { playRequestChime, startIncomingRequestRing, stopIncomingRequestRing, playSuccessChime, playSirenSound } from '../utils/audio';

const SimulationContext = createContext(null);

// Maharashtra & Pune/Mumbai landmark locations
export const INDIAN_LANDMARKS = [
  { name: 'Shivaji Nagar, Pune', lat: 18.5308, lng: 73.8474 },
  { name: 'FC Road, Pune', lat: 18.5196, lng: 73.8383 },
  { name: 'Deccan Gymkhana, Pune', lat: 18.5163, lng: 73.8473 },
  { name: 'Koregaon Park, Pune', lat: 18.5362, lng: 73.8939 },
  { name: 'Hinjewadi IT Park, Pune', lat: 18.5912, lng: 73.7392 },
  { name: 'Magarpatta City, Pune', lat: 18.5133, lng: 73.9311 },
  { name: 'Kothrud, Pune', lat: 18.5074, lng: 73.8077 },
  { name: 'Viman Nagar, Pune', lat: 18.5679, lng: 73.9143 },
  { name: 'Pimpri-Chinchwad, Pune', lat: 18.6298, lng: 73.7997 },
  { name: 'Hadapsar, Pune', lat: 18.5019, lng: 73.9332 },
  { name: 'Bandra Kurla Complex, Mumbai', lat: 19.0658, lng: 72.8695 },
  { name: 'Dadar Station, Mumbai', lat: 19.0194, lng: 72.8428 },
  { name: 'Worli Sea Face, Mumbai', lat: 18.9952, lng: 72.8155 },
  { name: 'Andheri West, Mumbai', lat: 19.1288, lng: 72.8354 },
  { name: 'Lonavala, Maharashtra', lat: 18.7481, lng: 73.4072 },
  { name: 'Nashik Road, Nashik', lat: 19.9975, lng: 73.7898 },
  { name: 'Chhatrapati Shivaji Terminus, Mumbai', lat: 18.9400, lng: 72.8353 },
  { name: 'Gateway of India, Mumbai', lat: 18.9220, lng: 72.8347 },
];

export const PREDEFINED_PROMOS = [
  { code: 'CABHUB50', discountType: 'fixed', value: 50, desc: '₹50 flat off on your ride' },
  { code: 'WELCOME10', discountType: 'percent', value: 10, maxDiscount: 40, desc: '10% off up to ₹40' },
  { code: 'BUMPER20', discountType: 'percent', value: 20, maxDiscount: 80, desc: '20% off up to ₹80' },
  { code: 'PUNE25', discountType: 'fixed', value: 25, desc: '₹25 off on Pune rides' },
];

// --- Maharashtra Dummy Users ---
export const DUMMY_PASSENGERS = [
  { id: 'usr_p001', name: 'Priya Deshmukh', email: 'priya@example.com', password: 'Pass@1234', phone: '+91 98230 45678', walletBalance: 1200 },
  { id: 'usr_p002', name: 'Amit Jadhav', email: 'amit@example.com', password: 'Pass@1234', phone: '+91 97654 32100', walletBalance: 850 },
  { id: 'usr_p003', name: 'Sneha Kulkarni', email: 'sneha@example.com', password: 'Pass@1234', phone: '+91 96211 78934', walletBalance: 2000 },
  { id: 'usr_p004', name: 'Rahul Patil', email: 'rahul@example.com', password: 'Pass@1234', phone: '+91 99870 12345', walletBalance: 500 },
  { id: 'usr_p005', name: 'Pooja Shinde', email: 'pooja@example.com', password: 'Pass@1234', phone: '+91 95432 67890', walletBalance: 1500 },
  { id: 'usr_p006', name: 'Sunil Waghmare', email: 'sunil@example.com', password: 'Pass@1234', phone: '+91 98765 43210', walletBalance: 750 },
];

export const DUMMY_DRIVERS = [
  {
    id: 'drv_d001', name: 'Santosh Mane', email: 'santosh@driver.com', password: 'Drive@123',
    phone: '+91 99881 12345', status: 'inactive',
    vehicle: { model: 'Maruti Suzuki Dzire', number: 'MH 12 AB 3456', type: 'Sedan' },
    rating: 4.8, earnings: 3450, lat: 18.5308, lng: 73.8474
  },
  {
    id: 'drv_d002', name: 'Ganesh Bhosale', email: 'ganesh@driver.com', password: 'Drive@123',
    phone: '+91 99782 23456', status: 'inactive',
    vehicle: { model: 'Tata Nexon', number: 'MH 14 CD 7890', type: 'SUV' },
    rating: 4.9, earnings: 5820, lat: 18.5362, lng: 73.8939
  },
  {
    id: 'drv_d003', name: 'Suresh Jadhav', email: 'suresh@driver.com', password: 'Drive@123',
    phone: '+91 98634 34567', status: 'inactive',
    vehicle: { model: 'Maruti WagonR', number: 'MH 15 EF 2345', type: 'Mini' },
    rating: 4.6, earnings: 2100, lat: 18.5196, lng: 73.8383
  },
  {
    id: 'drv_d004', name: 'Ramesh Pawar', email: 'ramesh@driver.com', password: 'Drive@123',
    phone: '+91 97520 45678', status: 'inactive',
    vehicle: { model: 'Toyota Innova Crysta', number: 'MH 11 GH 5678', type: 'SUV' },
    rating: 4.7, earnings: 8900, lat: 18.5074, lng: 73.8077
  },
  {
    id: 'drv_d005', name: 'Deepak Salunkhe', email: 'deepak@driver.com', password: 'Drive@123',
    phone: '+91 96410 56789', status: 'inactive',
    vehicle: { model: 'Maruti Swift', number: 'MH 09 IJ 9012', type: 'Mini' },
    rating: 4.5, earnings: 1780, lat: 18.5679, lng: 73.9143
  },
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

  // Chat and SOS Simulation States
  const [messages, setMessages] = useState([]);
  const [sosAlert, setSosAlert] = useState(false);

  // Notifications
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('cabhub_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  // Available drivers online (for map visual)
  const [onlineDrivers, setOnlineDrivers] = useState([
    { id: 'drv_1', name: 'Santosh Mane', vehicle: 'Maruti Suzuki Dzire (Sedan)', lat: 18.5330, lng: 73.8490, rating: 4.8 },
    { id: 'drv_2', name: 'Ganesh Bhosale', vehicle: 'Tata Nexon (SUV)', lat: 18.5380, lng: 73.8960, rating: 4.9 },
    { id: 'drv_3', name: 'Suresh Jadhav', vehicle: 'Maruti WagonR (Mini)', lat: 18.5175, lng: 73.8350, rating: 4.6 },
    { id: 'drv_4', name: 'Ramesh Pawar', vehicle: 'Innova Crysta (SUV)', lat: 18.5090, lng: 73.8100, rating: 4.7 },
    { id: 'drv_5', name: 'Deepak Salunkhe', vehicle: 'Maruti Swift (Mini)', lat: 18.5700, lng: 73.9160, rating: 4.5 },
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

  useEffect(() => {
    localStorage.setItem('cabhub_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Notification actions
  const addNotification = (message, type = 'info') => {
    const notif = {
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      message,
      type,
      read: false,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };
    setNotifications(prev => [notif, ...prev.slice(0, 19)]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotifications = () => setNotifications([]);

  // Auth Operations — matches against dummy users OR any custom registered user
  const login = (role, credentials) => {
    // Get registered users from localStorage
    const registeredPassengers = JSON.parse(localStorage.getItem('cabhub_registered_passengers') || '[]');
    const registeredDrivers = JSON.parse(localStorage.getItem('cabhub_registered_drivers') || '[]');

    if (role === 'passenger') {
      // Check dummy passengers first
      const dummy = DUMMY_PASSENGERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      if (dummy) {
        const { password: _, ...safeUser } = dummy;
        setPassenger(safeUser);
        addNotification('Welcome back, ' + dummy.name + '! Ready to ride 🚖', 'success');
        return { success: true, user: safeUser };
      }
      // Check registered passengers
      const registered = registeredPassengers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      if (registered) {
        const { password: _, ...safeUser } = registered;
        setPassenger(safeUser);
        addNotification('Welcome back, ' + registered.name + '! 🚖', 'success');
        return { success: true, user: safeUser };
      }
      // Fallback — allow any email+password for demo
      const mockUser = {
        id: 'usr_p' + Math.random().toString(36).substring(2, 7),
        name: credentials.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        email: credentials.email,
        phone: '+91 98765 43210',
        walletBalance: 750
      };
      setPassenger(mockUser);
      addNotification('Logged in as passenger 🚖', 'info');
      return { success: true, user: mockUser };
    }

    if (role === 'driver') {
      // Check dummy drivers first
      const dummy = DUMMY_DRIVERS.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      if (dummy) {
        const { password: _, ...safeDriver } = dummy;
        setDriver(safeDriver);
        addNotification('Welcome back, ' + dummy.name + '! Go Online to start 🚗', 'success');
        return { success: true, user: safeDriver };
      }
      // Check registered drivers
      const registered = registeredDrivers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );
      if (registered) {
        const { password: _, ...safeDriver } = registered;
        setDriver(safeDriver);
        addNotification('Welcome back, ' + registered.name + '! 🚗', 'success');
        return { success: true, user: safeDriver };
      }
      // Fallback
      const mockDriver = {
        id: 'drv_d' + Math.random().toString(36).substring(2, 7),
        name: credentials.email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        email: credentials.email,
        phone: '+91 99999 88888',
        status: 'inactive',
        vehicle: { model: 'Maruti Suzuki Dzire', number: 'MH 12 ZZ 0000', type: 'Sedan' },
        rating: 4.9,
        earnings: 1250,
        lat: 18.5308,
        lng: 73.8474
      };
      setDriver(mockDriver);
      addNotification('Logged in as pilot 🚗', 'info');
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
        addNotification('Admin console access granted ✅', 'success');
        return { success: true, user: mockAdmin };
      }
      return { success: false, message: 'Invalid admin credentials. Use admin@cabhub.com / admin123' };
    }
    return { success: false, message: 'Invalid Role' };
  };

  const register = (role, data) => {
    if (role === 'passenger') {
      // Check if email already exists
      const existing = JSON.parse(localStorage.getItem('cabhub_registered_passengers') || '[]');
      const alreadyExists = DUMMY_PASSENGERS.find(u => u.email === data.email) || existing.find(u => u.email === data.email);
      if (alreadyExists) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newUser = {
        id: 'usr_p' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '+91 98765 00000',
        walletBalance: 500
      };
      localStorage.setItem('cabhub_registered_passengers', JSON.stringify([...existing, newUser]));
      const { password: _, ...safeUser } = newUser;
      setPassenger(safeUser);
      addNotification('Account created! Welcome to CabHub 🎉', 'success');
      return { success: true, user: safeUser };
    }

    if (role === 'driver') {
      const existing = JSON.parse(localStorage.getItem('cabhub_registered_drivers') || '[]');
      const alreadyExists = DUMMY_DRIVERS.find(u => u.email === data.email) || existing.find(u => u.email === data.email);
      if (alreadyExists) {
        return { success: false, message: 'An account with this email already exists.' };
      }
      const newDriver = {
        id: 'drv_d' + Math.random().toString(36).substring(2, 9),
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || '+91 99999 00000',
        status: 'inactive',
        vehicle: {
          model: data.vehicleModel || 'Maruti Suzuki Dzire',
          number: data.vehicleNumber || 'MH 12 ZZ 9999',
          type: data.vehicleType || 'Sedan'
        },
        licenseNumber: data.licenseNumber || '',
        rating: 5.0,
        earnings: 0,
        lat: 18.5308,
        lng: 73.8474
      };
      localStorage.setItem('cabhub_registered_drivers', JSON.stringify([...existing, newDriver]));
      const { password: _, ...safeDriver } = newDriver;
      setDriver(safeDriver);
      addNotification('Driver account created! You can now go online 🚗', 'success');
      return { success: true, user: safeDriver };
    }

    return { success: false, message: 'Invalid role' };
  };

  const logout = (role) => {
    if (role === 'passenger') setPassenger(null);
    if (role === 'driver') setDriver(null);
    if (role === 'admin') setAdmin(null);
  };

  // Rate driver after ride
  const rateDriver = (rideId, stars, feedback = '') => {
    setRideHistory(prev => prev.map(ride => {
      if (ride.id === rideId) {
        return { ...ride, passengerRating: stars, passengerFeedback: feedback, rated: true };
      }
      return ride;
    }));
    addNotification(`You rated your driver ${stars} ⭐`, 'success');
    return { success: true };
  };

  // Chat messaging actions
  const sendMessage = (sender, text) => {
    setMessages(prev => [
      ...prev,
      {
        id: 'msg_' + Math.random().toString(36).substring(2, 9),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  // SOS Emergency actions
  const triggerSOS = () => {
    setSosAlert(true);
    playSirenSound();
    addNotification('⚠️ SOS Emergency triggered! Help is on the way.', 'error');
  };

  const clearSOS = () => {
    setSosAlert(false);
  };

  // Wallet operations
  const rechargeWallet = (amount) => {
    if (!passenger) return { success: false, message: 'Please log in as passenger first' };
    const numAmt = parseFloat(amount);
    if (isNaN(numAmt) || numAmt <= 0) return { success: false, message: 'Invalid recharge amount' };

    let updated;
    setPassenger(prev => {
      if (!prev) return null;
      const newBalance = prev.walletBalance + numAmt;
      updated = { ...prev, walletBalance: newBalance };
      localStorage.setItem('cabhub_passenger', JSON.stringify(updated));
      return updated;
    });
    addNotification(`Wallet recharged with ₹${numAmt} successfully 💳`, 'success');
    return { success: true };
  };

  // Ride Operations
  const requestRide = (pickup, drop, fare, vehicleType, distance, duration, discount = 0, promoCode = '') => {
    if (!passenger) return { success: false, message: 'Please log in as passenger first' };

    const originalFare = parseFloat(fare);
    const finalFare = Math.max(0, originalFare - discount);

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
      originalFare,
      fare: finalFare,
      discount,
      promoCode,
      vehicleType,
      distance,
      duration,
      status: 'requested',
      createdAt: new Date().toISOString(),
      driver: null,
      driverLat: pickup.lat - 0.012,
      driverLng: pickup.lng - 0.012,
      rated: false,
    };

    setActiveRide(newRide);
    setMessages([]);
    setSosAlert(false);

    playRequestChime();
    startIncomingRequestRing();

    addNotification(`Ride requested! Searching for ${vehicleType} near you... 🔍`, 'info');
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
    stopIncomingRequestRing();

    if (driver && driver.id === driverProfile.id) {
      setDriver(prev => ({ ...prev, status: 'on-ride' }));
    }

    sendMessage('system', `Pilot ${driverProfile.name} is on the way!`);
    addNotification(`Driver ${driverProfile.name} accepted your ride! 🚗`, 'success');

    return { success: true, ride: updatedRide };
  };

  const updateRideStatus = (newStatus) => {
    if (!activeRide) return { success: false, message: 'No active ride found' };

    let updatedRide = { ...activeRide, status: newStatus };

    if (newStatus === 'started') {
      updatedRide.startTime = new Date().toISOString();
      sendMessage('system', `Ride started. OTP verified. Drive safe!`);
      addNotification('Your ride has started! Enjoy your journey 🛣️', 'info');
    }

    if (newStatus === 'completed') {
      updatedRide.endTime = new Date().toISOString();

      if (passenger && activeRide.passenger.id === passenger.id) {
        setPassenger(prev => ({
          ...prev,
          walletBalance: Math.max(0, prev.walletBalance - activeRide.fare)
        }));
      }

      if (driver && activeRide.driver && activeRide.driver.id === driver.id) {
        setDriver(prev => ({
          ...prev,
          earnings: prev.earnings + (activeRide.originalFare || activeRide.fare),
          status: 'active'
        }));
      }

      setRideHistory(prev => [updatedRide, ...prev]);
      setActiveRide(null);
      setMessages([]);
      setSosAlert(false);

      playSuccessChime();
      addNotification(`Ride completed! ₹${activeRide.fare} paid. Please rate your driver ⭐`, 'success');
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
    setMessages([]);
    setSosAlert(false);
    stopIncomingRequestRing();

    if (driver && activeRide.driver && activeRide.driver.id === driver.id) {
      setDriver(prev => ({ ...prev, status: 'active' }));
    }

    addNotification('Ride cancelled.', 'warning');
    return { success: true };
  };

  const toggleDriverDuty = () => {
    if (!driver) return;
    const newStatus = driver.status === 'inactive' ? 'active' : 'inactive';
    setDriver(prev => ({ ...prev, status: newStatus }));
    addNotification(
      newStatus === 'active' ? 'You are now Online! Awaiting dispatch 📡' : 'You went Offline.',
      newStatus === 'active' ? 'success' : 'info'
    );
  };

  // Simulation Interval: Move Driver GPS marker closer to pickup / dropoff
  useEffect(() => {
    if (!activeRide) return;

    let intervalId;

    if (activeRide.status === 'accepted' || activeRide.status === 'arriving') {
      intervalId = setInterval(() => {
        setActiveRide(prev => {
          if (!prev) return null;
          const targetLat = prev.pickup.lat;
          const targetLng = prev.pickup.lng;

          const dLat = targetLat - prev.driverLat;
          const dLng = targetLng - prev.driverLng;

          const distanceLeft = Math.sqrt(dLat * dLat + dLng * dLng);

          if (distanceLeft < 0.001) {
            clearInterval(intervalId);
            return { ...prev, status: 'arrived', driverLat: targetLat, driverLng: targetLng };
          }

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
      intervalId = setInterval(() => {
        setActiveRide(prev => {
          if (!prev) return null;
          const targetLat = prev.drop.lat;
          const targetLng = prev.drop.lng;

          const dLat = targetLat - prev.driverLat;
          const dLng = targetLng - prev.driverLng;

          const distanceLeft = Math.sqrt(dLat * dLat + dLng * dLng);

          if (distanceLeft < 0.001) {
            clearInterval(intervalId);
            return { ...prev, driverLat: targetLat, driverLng: targetLng };
          }

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

  const resetSimulator = () => {
    setPassenger(null);
    setDriver(null);
    setAdmin(null);
    setActiveRide(null);
    setRideHistory([]);
    setMessages([]);
    setSosAlert(false);
    setNotifications([]);
    stopIncomingRequestRing();
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
        messages,
        sendMessage,
        sosAlert,
        triggerSOS,
        clearSOS,
        notifications,
        addNotification,
        markAllNotificationsRead,
        clearNotifications,
        login,
        register,
        logout,
        rechargeWallet,
        requestRide,
        acceptRideByDriver,
        updateRideStatus,
        cancelRide,
        toggleDriverDuty,
        resetSimulator,
        rateDriver,
        setPassenger,
        setDriver,
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
