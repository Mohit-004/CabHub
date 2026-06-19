import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation, INDIAN_LANDMARKS } from '../context/SimulationContext';
import MapComponent from '../components/MapComponent';
import RideReceipt from '../components/RideReceipt';
import { useToast } from '../components/ToastNotification';
import { ArrowLeft, User, Wallet, Navigation, MapPin, Send, CheckCircle, Star, LogOut, ChevronRight, Info, ShieldAlert, Receipt } from 'lucide-react';

const PassengerPortal = () => {
  const navigate = useNavigate();
  const {
    passenger,
    login,
    register,
    logout,
    activeRide,
    rideHistory,
    requestRide,
    cancelRide,
    messages,
    sendMessage,
    sosAlert,
    triggerSOS,
    clearSOS
  } = useSimulation();
  const { addToast } = useToast();

  // Receipt modal state
  const [receiptRide, setReceiptRide] = useState(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  // Auth local inputs
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Chat local state
  const [chatInput, setChatInput] = useState('');
  const passengerPresets = [
    "I am waiting at the pickup point.",
    "Please call me when you arrive.",
    "I have luggage with me.",
    "Traffic is heavy near me."
  ];

  const handleSendChat = (text) => {
    if (!text.trim()) return;
    sendMessage('passenger', text);
    setChatInput('');
  };

  // Booking details inputs
  const [pickupIndex, setPickupIndex] = useState(0);
  const [dropIndex, setDropIndex] = useState(1);
  const [selectedTier, setSelectedTier] = useState('Sedan');
  const [ratingVal, setRatingVal] = useState(5);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  // Compute distance and estimates
  const pickupLandmark = INDIAN_LANDMARKS[pickupIndex];
  const dropLandmark = INDIAN_LANDMARKS[dropIndex];

  const rideStats = useMemo(() => {
    if (!pickupLandmark || !dropLandmark) return { distance: 0, duration: 0 };
    // Simulated distance: simple degrees offset * 111km per degree
    const dLat = dropLandmark.lat - pickupLandmark.lat;
    const dLng = dropLandmark.lng - pickupLandmark.lng;
    let distance = Math.sqrt(dLat * dLat + dLng * dLng) * 100;
    if (distance === 0) distance = 1.2; // default min distance
    distance = parseFloat(distance.toFixed(1));
    const duration = Math.round(distance * 1.5 + 5); // minutes
    return { distance, duration };
  }, [pickupIndex, dropIndex]);

  const fareTiers = useMemo(() => {
    const dist = rideStats.distance;
    return {
      Mini: Math.round(dist * 12 + 40),
      Sedan: Math.round(dist * 18 + 60),
      SUV: Math.round(dist * 28 + 100)
    };
  }, [rideStats.distance]);

  // Auth handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (isRegistering) {
      if (!name || !email || !password) {
        setErrorMsg('Please fill in all required fields');
        return;
      }
      register('passenger', { name, email, password, phone });
      addToast('Account created! Welcome to CabHub 🇮🇳', 'success');
    } else {
      if (!email || !password) {
        setErrorMsg('Please fill in all fields');
        return;
      }
      login('passenger', { email, password });
      addToast('Welcome back to CabHub! Ready to ride 🚖', 'success');
    }
  };

  const handleGuestLogin = () => {
    login('passenger', { email: 'aarav@gmail.com', password: 'guestpassword' });
    addToast('Logged in as Guest Passenger', 'info');
  };

  const handleBooking = () => {
    if (pickupIndex === dropIndex) {
      addToast('Pickup and drop locations cannot be the same!', 'error');
      return;
    }
    const fare = fareTiers[selectedTier];
    requestRide(pickupLandmark, dropLandmark, fare, selectedTier, rideStats.distance, rideStats.duration);
    setRatingSubmitted(false);
    addToast(`Ride requested! Searching for ${selectedTier} cabs nearby...`, 'info');
  };

  const handleViewReceipt = (ride) => {
    setReceiptRide(ride);
    setReceiptOpen(true);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '20px 12px'
    }}>
      {/* SOS Overlay */}
      {sosAlert && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(225, 29, 72, 0.98)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '24px',
          textAlign: 'center',
          backdropFilter: 'blur(8px)'
        }} className="animate-fade-in">
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            padding: '24px',
            borderRadius: '50%',
            animation: 'pulseGlow 1.5s infinite',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <ShieldAlert size={64} />
          </div>
          <h2 style={{ fontSize: '32px', fontFamily: 'var(--font-display)', fontWeight: '800', marginBottom: '12px' }}>
            SOS EMERGENCY TRIGGERED
          </h2>
          <p style={{ maxWidth: '500px', fontSize: '16px', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', marginBottom: '32px' }}>
            operations control center, dispatch logs, and local simulated emergency responder channels (112) have been alerted with your live trip information.
          </p>
          <button 
            onClick={clearSOS}
            style={{
              background: '#fff',
              color: '#E11D48',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '12px',
              fontFamily: 'var(--font-display)',
              fontWeight: '700',
              fontSize: '15px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Cancel Emergency Alert
          </button>
        </div>
      )}

      <div className="container-layout" style={{ maxWidth: '1000px' }}>
        {/* Top Navbar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <button 
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '15px',
              fontWeight: '600'
            }}
          >
            <ArrowLeft size={18} />
            <span>Portals</span>
          </button>
          
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800' }}>
            CabHub <span style={{ color: '#FF9933' }}>Passenger</span>
          </h2>

          {passenger && (
            <button 
              onClick={() => logout('passenger')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: '#E11D48',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </nav>

        {/* Auth Mode Block */}
        {!passenger ? (
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '440px',
            margin: '60px auto 0 auto',
            padding: '32px 24px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(19,136,8,0.15) 100%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: '#FF9933'
              }}>
                <User size={30} />
              </div>
              <h3 style={{ fontSize: '22px' }}>{isRegistering ? 'Create Passenger Account' : 'Passenger Sign In'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Join CabHub for premium, localized rides in India
              </p>
            </div>

            {errorMsg && (
              <div style={{
                background: 'rgba(225, 29, 72, 0.1)',
                border: '1px solid #E11D48',
                color: '#E11D48',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '13px',
                marginBottom: '16px'
              }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {isRegistering && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>PASSWORD</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontSize: '14px'
                  }}
                />
              </div>

              {isRegistering && (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>PHONE NUMBER</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                    placeholder="+91 XXXXX XXXXX"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              <button type="submit" className="glow-btn-saffron" style={{ padding: '12px 0', fontSize: '15px', marginTop: '8px' }}>
                {isRegistering ? 'Sign Up' : 'Sign In'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleGuestLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--emerald)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'block',
                  margin: '0 auto 12px auto'
                }}
              >
                Login as Guest Passenger (Instant)
              </button>

              <button 
                onClick={() => setIsRegistering(!isRegistering)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {isRegistering ? 'Already have an account? Sign In' : 'New to CabHub? Create an account'}
              </button>
            </div>
          </div>
        ) : (
          /* Active Passenger Dashboard */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginTop: '12px'
          }} className="animate-fade-in">
            {/* Left Panel: Booking Controls or Live Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Profile and Wallet Header */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    padding: '8px',
                    borderRadius: '50%'
                  }}>
                    <User size={20} color="var(--text-secondary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px' }}>{passenger.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Passenger</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(19,136,8,0.1)', padding: '6px 12px', borderRadius: '12px', color: 'var(--emerald)' }}>
                  <Wallet size={16} />
                  <span style={{ fontWeight: '700', fontSize: '14px' }}>₹{passenger.walletBalance}</span>
                </div>
              </div>

              {/* Ride Request Selector or Status */}
              {!activeRide ? (
                /* Booking Setup Card */
                <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <h3 style={{ fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Navigation size={18} color="#FF9933" />
                    <span>Book a CabHub Ride</span>
                  </h3>

                  {/* Pickups */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>PICKUP LANDMARK</label>
                    <select
                      value={pickupIndex}
                      onChange={e => setPickupIndex(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      {INDIAN_LANDMARKS.map((landmark, idx) => (
                        <option key={`pk-${idx}`} value={idx}>{landmark.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Dropoffs */}
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>DROPOFF LANDMARK</label>
                    <select
                      value={dropIndex}
                      onChange={e => setDropIndex(parseInt(e.target.value))}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      {INDIAN_LANDMARKS.map((landmark, idx) => (
                        <option key={`dp-${idx}`} value={idx}>{landmark.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ride Estimates Summary */}
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '13px'
                  }}>
                    <span>Est. Distance: <strong>{rideStats.distance} km</strong></span>
                    <span>Est. Duration: <strong>{rideStats.duration} mins</strong></span>
                  </div>

                  {/* Fare Tiers */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>SELECT CAB CATEGORY</label>
                    
                    {/* Mini */}
                    <div 
                      onClick={() => setSelectedTier('Mini')}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: selectedTier === 'Mini' ? '2px solid #FF9933' : '1px solid var(--border-color)',
                        background: selectedTier === 'Mini' ? 'rgba(255,153,51,0.06)' : 'var(--input-bg)',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>Cab Mini</div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Compact hatchbacks, quick trips</span>
                      </div>
                      <span style={{ fontWeight: '800', fontSize: '15px' }}>₹{fareTiers.Mini}</span>
                    </div>

                    {/* Sedan */}
                    <div 
                      onClick={() => setSelectedTier('Sedan')}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: selectedTier === 'Sedan' ? '2px solid #FF9933' : '1px solid var(--border-color)',
                        background: selectedTier === 'Sedan' ? 'rgba(255,153,51,0.06)' : 'var(--input-bg)',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>Sedan Royal</div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Comfortable sedans, daily commutes</span>
                      </div>
                      <span style={{ fontWeight: '800', fontSize: '15px' }}>₹{fareTiers.Sedan}</span>
                    </div>

                    {/* SUV */}
                    <div 
                      onClick={() => setSelectedTier('SUV')}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: selectedTier === 'SUV' ? '2px solid #FF9933' : '1px solid var(--border-color)',
                        background: selectedTier === 'SUV' ? 'rgba(255,153,51,0.06)' : 'var(--input-bg)',
                        cursor: 'pointer'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>SUV Prime</div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Premium spacious SUVs for family</span>
                      </div>
                      <span style={{ fontWeight: '800', fontSize: '15px' }}>₹{fareTiers.SUV}</span>
                    </div>
                  </div>

                  <button onClick={handleBooking} className="glow-btn-saffron" style={{ padding: '14px 0', fontSize: '16px', marginTop: '6px' }}>
                    Request Ride
                  </button>
                </div>
              ) : (
                /* Ride Active Status Panel */
                <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      background: 'rgba(255,153,51,0.15)',
                      color: '#FF9933',
                      textTransform: 'uppercase'
                    }}>
                      {activeRide.status}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>ID: {activeRide.id}</span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>
                      {activeRide.status === 'requested' && 'Searching for Nearest Cab...'}
                      {activeRide.status === 'accepted' && 'Driver is Heading to Pickup'}
                      {activeRide.status === 'arriving' && 'Cab is Approaching'}
                      {activeRide.status === 'arrived' && 'Cab has Arrived!'}
                      {activeRide.status === 'started' && 'En-route to Dropoff Destination'}
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      Route: {activeRide.pickup.name} to {activeRide.drop.name}
                    </p>
                  </div>

                  {/* Driver Profile card if accepted */}
                  {activeRide.driver ? (
                    <div style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '16px',
                      background: 'var(--bg-tertiary)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '15px' }}>{activeRide.driver.name}</div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{activeRide.driver.vehicle.model} ({activeRide.driver.vehicle.number})</span>
                        </div>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          background: 'var(--bg-secondary)',
                          padding: '4px 8px',
                          borderRadius: '8px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          <Star size={12} fill="#FFC700" color="#FFC700" />
                          <span>{activeRide.driver.rating}</span>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', justifyBetween: 'space-between', fontSize: '13px', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '10px' }}>
                        <span>Fare: <strong>₹{activeRide.fare}</strong></span>
                        <span style={{ marginLeft: 'auto' }}>OTP: <strong>7241</strong></span>
                      </div>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--bg-tertiary)',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      color: 'var(--text-secondary)'
                    }}>
                      <Info size={16} color="var(--saffron)" />
                      <span>Simulated pilots are analyzing your ride request...</span>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <button 
                      onClick={cancelRide}
                      style={{
                        border: '1px solid #E11D48',
                        background: 'transparent',
                        color: '#E11D48',
                        padding: '12px 0',
                        borderRadius: '12px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(225,29,72,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      Cancel Booking
                    </button>
                    
                    <button 
                      onClick={triggerSOS}
                      style={{
                        border: 'none',
                        background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                        color: '#FFF',
                        padding: '12px 0',
                        borderRadius: '12px',
                        fontFamily: 'var(--font-display)',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: 'rgba(239,68,68,0.2) 0 4px 12px',
                        animation: 'pulseGlow 2s infinite'
                      }}
                    >
                      Trigger SOS
                    </button>
                  </div>
                </div>
              )}

              {/* Passenger - Pilot Chat Drawer Box */}
              {activeRide && activeRide.status !== 'requested' && (
                <div className="glass-card animate-fade-in" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Chat with Pilot ({activeRide.driver?.name})</h4>
                  
                  {/* Messages container */}
                  <div style={{
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    padding: '12px',
                    height: '180px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    {messages.length === 0 ? (
                      <span style={{ margin: 'auto', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
                        No messages yet. Send a quick preset below!
                      </span>
                    ) : (
                      messages.map((msg, i) => (
                        <div 
                          key={msg.id || i}
                          style={{
                            alignSelf: msg.sender === 'passenger' ? 'flex-end' : msg.sender === 'system' ? 'center' : 'flex-start',
                            background: msg.sender === 'passenger' ? 'var(--saffron)' : msg.sender === 'system' ? 'var(--border-color)' : 'var(--bg-secondary)',
                            color: msg.sender === 'passenger' ? '#FFF' : 'var(--text-primary)',
                            padding: '6px 12px',
                            borderRadius: '12px',
                            maxWidth: '80%',
                            fontSize: '12px',
                            lineHeight: '1.4',
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          {msg.sender === 'system' ? (
                            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text-secondary)' }}>{msg.text}</span>
                          ) : (
                            <>
                              <div>{msg.text}</div>
                              <span style={{ fontSize: '9px', opacity: 0.7, float: 'right', marginTop: '2px', marginLeft: '6px' }}>{msg.timestamp}</span>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* Preset replies */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                    {passengerPresets.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => handleSendChat(preset)}
                        style={{
                          background: 'var(--bg-tertiary)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {preset.replace('.', '')}
                      </button>
                    ))}
                  </div>

                  {/* Text Input Row */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSendChat(chatInput)}
                      placeholder="Type a message..."
                      style={{
                        flexGrow: 1,
                        padding: '8px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '13px'
                      }}
                    />
                    <button 
                      onClick={() => handleSendChat(chatInput)}
                      style={{
                        background: 'var(--chakra)',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Map tracker & Trip history */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Interactive SVG map tracker */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="var(--emerald)" />
                  <span>Real-Time Travel Tracker</span>
                </h3>
                <MapComponent
                  pickup={activeRide ? activeRide.pickup : pickupLandmark}
                  drop={activeRide ? activeRide.drop : dropLandmark}
                  driverLat={activeRide ? activeRide.driverLat : null}
                  driverLng={activeRide ? activeRide.driverLng : null}
                  status={activeRide ? activeRide.status : null}
                />
              </div>

              {/* Ride feedback panel / ratings popover if last ride completed */}
              {!activeRide && rideHistory.length > 0 && !ratingSubmitted && (
                <div className="glass-card" style={{
                  padding: '20px',
                  border: '1px solid var(--border-color)',
                  background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(19,136,8,0.03) 100%)',
                  animation: 'fadeIn 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--emerald)', marginBottom: '8px' }}>
                    <CheckCircle size={18} />
                    <h4 style={{ fontSize: '15px' }}>Ride Completed Successfully!</h4>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                    Rate your last trip with pilot <strong>{rideHistory[0].driver?.name || 'Driver'}</strong>
                  </p>
                  
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <button 
                        key={`st-${star}`}
                        onClick={() => setRatingVal(star)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Star 
                          size={24} 
                          fill={star <= ratingVal ? '#FFC700' : 'none'} 
                          color={star <= ratingVal ? '#FFC700' : 'var(--text-muted)'} 
                        />
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setRatingSubmitted(true)}
                    className="glow-btn-emerald" 
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                  >
                    Submit Feedback
                  </button>
                </div>
              )}

              {/* History list */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', flexGrow: 1 }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Your Travel History</h3>
                
                {rideHistory.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0' }}>
                    No trips taken yet. Request a ride above to start!
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                    {rideHistory.map((ride, idx) => (
                      <div 
                        key={`h-${idx}`} 
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          background: 'var(--bg-secondary)',
                          fontSize: '13px',
                          cursor: ride.status === 'completed' ? 'pointer' : 'default',
                          transition: 'border-color 0.2s'
                        }}
                        onClick={() => ride.status === 'completed' && handleViewReceipt(ride)}
                        onMouseEnter={e => { if (ride.status === 'completed') e.currentTarget.style.borderColor = 'var(--saffron)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontWeight: '600' }}>{ride.pickup.name.split(',')[0]} &rarr; {ride.drop.name.split(',')[0]}</span>
                          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(ride.createdAt).toLocaleDateString()} &bull; {ride.vehicleType}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontWeight: '700', color: ride.status === 'cancelled' ? '#E11D48' : 'var(--emerald)' }}>
                              {ride.status === 'cancelled' ? 'Cancelled' : `₹${ride.fare}`}
                            </div>
                          </div>
                          {ride.status === 'completed' && (
                            <Receipt size={14} color="var(--text-muted)" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Ride Receipt Modal */}
              <RideReceipt
                ride={receiptRide}
                isOpen={receiptOpen}
                onClose={() => setReceiptOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerPortal;
