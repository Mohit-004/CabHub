import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import MapComponent from '../components/MapComponent';
import { useToast } from '../components/ToastNotification';
import { ArrowLeft, User, Wallet, Navigation, MapPin, Check, X, LogOut, ShieldAlert, Star } from 'lucide-react';

const DriverPortal = () => {
  const navigate = useNavigate();
  const {
    driver,
    login,
    register,
    logout,
    activeRide,
    rideHistory,
    acceptRideByDriver,
    updateRideStatus,
    cancelRide,
    toggleDriverDuty,
    messages,
    sendMessage,
    sosAlert,
    triggerSOS,
    clearSOS
  } = useSimulation();
  const { addToast } = useToast();

  // Auth local inputs
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [errorMsg, setErrorMsg] = useState('');
  
  // OTP states
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState(false);

  // Chat local state
  const [chatInput, setChatInput] = useState('');
  const driverPresets = [
    "I have arrived at your location.",
    "Stuck in traffic. Reaching in 3 mins.",
    "Please share your trip OTP code.",
    "I am on my way."
  ];

  const handleSendChat = (text) => {
    if (!text.trim()) return;
    sendMessage('driver', text);
    setChatInput('');
  };

  const handleStartRide = () => {
    if (otpInput === '7241') {
      updateRideStatus('started');
      setOtpInput('');
      setOtpError(false);
      addToast('OTP verified! Ride started. Drive safe! 🚗', 'success');
    } else {
      setOtpError(true);
      addToast('Invalid OTP. Please verify with the customer.', 'error');
    }
  };

  // Auth handlers
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (isRegistering) {
      if (!name || !email || !password || !vehicleModel || !vehicleNumber) {
        setErrorMsg('Please fill in all required fields');
        return;
      }
      register('driver', { name, email, password, phone, vehicleModel, vehicleNumber, vehicleType });
    } else {
      if (!email || !password) {
        setErrorMsg('Please fill in all fields');
        return;
      }
      login('driver', { email, password });
    }
  };

  const handleGuestLogin = () => {
    login('driver', { email: 'rajesh@bharatnav.in', password: 'guestpassword' });
    addToast('Welcome back, Pilot! Ready for dispatch.', 'success');
  };

  const handleAcceptRide = () => {
    if (!driver) return;
    acceptRideByDriver(driver);
    addToast('Ride accepted! Navigating to pickup location...', 'success');
  };

  // Get driver trip history count
  const driverTrips = rideHistory.filter(ride => ride.driver?.id === driver?.id);

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
            The active operations dispatcher, admin console, and simulated law enforcement (112 emergency) have been patched into your vehicle GPS stream.
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
            Acknowledge Emergency
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
            CabHub <span style={{ color: 'var(--emerald)' }}>Driver (Bharat Nav)</span>
          </h2>

          {driver && (
            <button 
              onClick={() => logout('driver')}
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

        {/* Auth Block */}
        {!driver ? (
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '460px',
            margin: '40px auto 0 auto',
            padding: '32px 24px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(19,136,8,0.15) 0%, rgba(0,0,128,0.15) 100%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--emerald)'
              }}>
                <Navigation size={30} />
              </div>
              <h3 style={{ fontSize: '22px' }}>{isRegistering ? 'Register as Pilot' : 'Pilot Sign In'}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Access Bharat Nav and start earning today
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
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>FULL NAME</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="Enter your name"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>EMAIL</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    placeholder="pilot@cabhub.in"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>PASSWORD</label>
                  <input 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="••••••••"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      background: 'var(--input-bg)',
                      color: 'var(--text-primary)',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              {isRegistering ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>VEHICLE MODEL</label>
                      <input 
                        type="text" 
                        value={vehicleModel} 
                        onChange={e => setVehicleModel(e.target.value)} 
                        placeholder="e.g. Maruti Dzire"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>VEHICLE NUMBER</label>
                      <input 
                        type="text" 
                        value={vehicleNumber} 
                        onChange={e => setVehicleNumber(e.target.value)} 
                        placeholder="e.g. DL 3C Z 1234"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          borderRadius: '10px',
                          border: '1px solid var(--border-color)',
                          background: 'var(--input-bg)',
                          color: 'var(--text-primary)',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>VEHICLE CATEGORY</label>
                    <select
                      value={vehicleType}
                      onChange={e => setVehicleType(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      <option value="Mini">Mini (Hatchback)</option>
                      <option value="Sedan">Sedan (Dzire/Etios)</option>
                      <option value="SUV">SUV (Ertiga/Crysta)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '4px' }}>PHONE</label>
                    <input 
                      type="tel" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      placeholder="+91 XXXXX XXXXX"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid var(--border-color)',
                        background: 'var(--input-bg)',
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </>
              ) : null}

              <button type="submit" className="glow-btn-emerald" style={{ padding: '12px 0', fontSize: '15px', marginTop: '8px' }}>
                {isRegistering ? 'Register & Go Online' : 'Sign In to Dashboard'}
              </button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button 
                onClick={handleGuestLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--saffron)',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'block',
                  margin: '0 auto 12px auto'
                }}
              >
                Login as Guest Pilot (Instant)
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
                {isRegistering ? 'Already registered? Sign In' : 'Join the fleet? Register as pilot'}
              </button>
            </div>
          </div>
        ) : (
          /* Active Driver Dashboard */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            marginTop: '12px'
          }} className="animate-fade-in">
            {/* Left Column: Duty control, stats & incoming missions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Duty Toggle and profile stats */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: driver.status !== 'inactive' ? 'var(--emerald)' : 'var(--text-muted)',
                      animation: driver.status !== 'inactive' ? 'onlinePulse 1.5s infinite' : 'none'
                    }} />
                    <div>
                      <h4 style={{ fontSize: '16px' }}>{driver.name}</h4>
                      <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{driver.vehicle.model} &bull; {driver.vehicle.number}</span>
                    </div>
                  </div>
                  
                  {/* Toggle Button */}
                  <button 
                    onClick={toggleDriverDuty}
                    disabled={activeRide !== null}
                    style={{
                      background: driver.status !== 'inactive' ? 'var(--emerald)' : 'var(--bg-tertiary)',
                      color: driver.status !== 'inactive' ? '#FFF' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      cursor: activeRide ? 'not-allowed' : 'pointer',
                      opacity: activeRide ? 0.6 : 1,
                      boxShadow: driver.status !== 'inactive' ? 'var(--emerald-glow) 0 4px 12px' : 'none'
                    }}
                  >
                    {driver.status === 'inactive' ? 'Go Online' : 'Go Offline'}
                  </button>
                </div>

                {/* Dashboard Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr',
                  gap: '12px',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '20px'
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--emerald)' }}>₹{driver.earnings}</div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Earning (INR)</span>
                  </div>
                  <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                    <div style={{ fontSize: '20px', fontWeight: '800' }}>{driverTrips.length}</div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Trips</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '18px', fontWeight: '800', color: '#FFC700' }}>
                      <Star size={16} fill="#FFC700" />
                      <span>{driver.rating}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Rating</span>
                  </div>
                </div>
              </div>

              {/* Duty Portal Interactive Area */}
              {driver.status === 'inactive' ? (
                <div className="glass-card" style={{ padding: '32px 20px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                  <div style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
                    <ShieldAlert size={40} style={{ margin: '0 auto' }} />
                  </div>
                  <h4 style={{ fontSize: '16px', marginBottom: '8px' }}>You are Offline</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    Toggle "Go Online" at the top to start searching for customer bookings and receiving dispatch alerts.
                  </p>
                </div>
              ) : (
                /* Online Mode Panels */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {/* Waiting for ride alerts */}
                  {!activeRide && (
                    <div className="glass-card" style={{
                      padding: '40px 20px',
                      textAlign: 'center',
                      border: '1px solid var(--border-color)',
                      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255,153,51,0.02) 100%)'
                    }}>
                      <div className="flex-center" style={{
                        background: 'rgba(255,153,51,0.1)',
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        margin: '0 auto 20px auto',
                        animation: 'pulseGlow 2s infinite'
                      }}>
                        <Navigation size={28} color="var(--saffron)" />
                      </div>
                      <h4 style={{ fontSize: '18px', marginBottom: '6px' }}>Bharat Nav Dispatch Active</h4>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                        Waiting for passenger ride requests in your area...
                      </p>
                    </div>
                  )}

                  {/* Incoming ride request alert card */}
                  {activeRide && activeRide.status === 'requested' && (
                    <div className="glass-card animate-fade-in" style={{
                      padding: '24px',
                      border: '2px solid var(--saffron)',
                      boxShadow: '0 0 25px var(--saffron-glow)',
                      background: 'linear-gradient(135deg, var(--bg-secondary) 0%, rgba(255,153,51,0.04) 100%)',
                      animation: 'pulseGlow 2.5s infinite'
                    }}>
                      <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', background: 'var(--saffron)', color: '#FFF', padding: '3px 8px', borderRadius: '8px' }}>
                          INCOMING DISPATCH
                        </span>
                        <span style={{ fontSize: '16px', fontWeight: '800', color: 'var(--emerald)' }}>₹{activeRide.fare}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <MapPin size={16} color="var(--emerald)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>PICKUP</span>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>{activeRide.pickup.name}</span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <MapPin size={16} color="#E11D48" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>DROPOFF</span>
                            <span style={{ fontSize: '13px', fontWeight: '600' }}>{activeRide.drop.name}</span>
                          </div>
                        </div>
                      </div>

                      <div style={{
                        background: 'var(--bg-tertiary)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        marginBottom: '20px'
                      }}>
                        <span>Distance: <strong>{activeRide.distance} km</strong></span>
                        <span>Passenger: <strong>{activeRide.passenger.name}</strong></span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '12px' }}>
                        <button 
                          onClick={cancelRide}
                          style={{
                            border: '1px solid var(--border-color)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: '600'
                          }}
                        >
                          Decline
                        </button>
                        <button 
                          onClick={handleAcceptRide}
                          className="glow-btn-emerald" 
                          style={{ padding: '12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <Check size={16} />
                          <span>Accept Ride</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Trip Navigation Active controls */}
                  {activeRide && activeRide.status !== 'requested' && (
                    <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', justifyBetween: 'space-between', alignItems: 'center' }}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          background: 'rgba(19,136,8,0.15)',
                          color: 'var(--emerald)',
                          textTransform: 'uppercase'
                        }}>
                          Mission: {activeRide.status}
                        </span>
                        <span style={{ fontSize: '13px', fontWeight: '800' }}>Fare: ₹{activeRide.fare}</span>
                      </div>

                      <div>
                        {activeRide.status === 'accepted' || activeRide.status === 'arriving' ? (
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            Navigating to pickup: <strong>{activeRide.pickup.name}</strong>. The GPS engine is moving your cab.
                          </p>
                        ) : activeRide.status === 'arrived' ? (
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            You have arrived at pickup. Verify OTP with <strong>{activeRide.passenger.name}</strong> to start the ride.
                          </p>
                        ) : activeRide.status === 'started' ? (
                          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                            En-route to Dropoff: <strong>{activeRide.drop.name}</strong>. Tracking progress.
                          </p>
                        ) : null}
                      </div>

                      <div style={{
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        background: 'var(--bg-tertiary)',
                        fontSize: '13px'
                      }}>
                        <div style={{ display: 'flex', justifyBetween: 'space-between', marginBottom: '6px' }}>
                          <span>Customer:</span>
                          <strong>{activeRide.passenger.name}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyBetween: 'space-between' }}>
                          <span>Phone:</span>
                          <strong>{activeRide.passenger.phone}</strong>
                        </div>
                      </div>

                      {/* Dynamic step actions */}
                      <div>
                        {activeRide.status === 'arrived' && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                                ENTER CUSTOMER OTP (Check Passenger Screen)
                              </label>
                              <input 
                                type="text"
                                maxLength={4}
                                value={otpInput}
                                onChange={e => {
                                  setOtpInput(e.target.value);
                                  setOtpError(false);
                                }}
                                placeholder="e.g. 7241"
                                style={{
                                  width: '100%',
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  border: otpError ? '1.5px solid #E11D48' : '1px solid var(--border-color)',
                                  background: 'var(--input-bg)',
                                  color: 'var(--text-primary)',
                                  fontSize: '14px',
                                  textAlign: 'center',
                                  fontWeight: '800',
                                  letterSpacing: '0.2em'
                                }}
                              />
                            </div>
                            {otpError && (
                              <div style={{ color: '#E11D48', fontSize: '11px', fontWeight: '600', textAlign: 'center' }}>
                                Invalid OTP code! Verify with customer. (Hint: 7241)
                              </div>
                            )}
                            <button 
                              onClick={handleStartRide}
                              className="glow-btn-saffron"
                              style={{ width: '100%', padding: '12px 0', fontSize: '15px' }}
                            >
                              Verify OTP & Start Ride
                            </button>
                          </div>
                        )}
                        {(activeRide.status === 'accepted' || activeRide.status === 'arriving') && (
                          <button 
                            disabled
                            style={{
                              width: '100%',
                              padding: '14px 0',
                              fontSize: '14px',
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-muted)',
                              border: '1px solid var(--border-color)',
                              borderRadius: '12px',
                              cursor: 'not-allowed'
                            }}
                          >
                            Driving to Pickup...
                          </button>
                        )}
                        {activeRide.status === 'started' && (
                          <button 
                            onClick={() => updateRideStatus('completed')}
                            className="glow-btn-emerald"
                            style={{ width: '100%', padding: '14px 0', fontSize: '15px' }}
                          >
                            Complete Ride & Collect ₹{activeRide.fare}
                          </button>
                        )}
                        {/* Emergency SOS button inside trip console */}
                        {activeRide.status === 'started' && (
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
                              fontSize: '15px',
                              cursor: 'pointer',
                              marginTop: '12px',
                              boxShadow: 'rgba(239,68,68,0.2) 0 4px 12px',
                              animation: 'pulseGlow 2s infinite'
                            }}
                          >
                            Trigger Emergency SOS
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Driver - Passenger Chat Console */}
                  {activeRide && activeRide.status !== 'requested' && (
                    <div className="glass-card animate-fade-in" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: '700' }}>Chat with Passenger ({activeRide.passenger?.name})</h4>
                      
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
                                alignSelf: msg.sender === 'driver' ? 'flex-end' : msg.sender === 'system' ? 'center' : 'flex-start',
                                background: msg.sender === 'driver' ? 'var(--emerald)' : msg.sender === 'system' ? 'var(--border-color)' : 'var(--bg-secondary)',
                                color: msg.sender === 'driver' ? '#FFF' : 'var(--text-primary)',
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
                        {driverPresets.map((preset, i) => (
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
                          placeholder="Type message for customer..."
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
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: GPS Simulator Map & Trip Logs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Map */}
              <div className="glass-card" style={{ padding: '16px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Navigation size={16} color="var(--emerald)" />
                  <span>Bharat Nav HUD</span>
                </h3>
                <MapComponent
                  pickup={activeRide ? activeRide.pickup : null}
                  drop={activeRide ? activeRide.drop : null}
                  driverLat={activeRide ? activeRide.driverLat : driver.lat}
                  driverLng={activeRide ? activeRide.driverLng : driver.lng}
                  status={activeRide ? activeRide.status : null}
                />
              </div>

              {/* Earnings list history */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', flexGrow: 1 }}>
                <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Your Completed Missions</h3>
                
                {driverTrips.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', padding: '24px 0' }}>
                    No completed dispatches yet today.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto', paddingRight: '4px' }}>
                    {driverTrips.map((ride, idx) => (
                      <div 
                        key={`dt-${idx}`}
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '10px 12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '10px',
                          background: 'var(--bg-secondary)',
                          fontSize: '13px'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: '600' }}>{ride.pickup.name.split(',')[0]} &rarr; {ride.drop.name.split(',')[0]}</div>
                          <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Passenger: {ride.passenger.name}</div>
                        </div>
                        <span style={{ fontWeight: '800', color: 'var(--emerald)' }}>+₹{ride.fare}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverPortal;
