import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { ArrowLeft, Lock, Users, TrendingUp, Compass, Calendar, ShieldCheck, Check, RotateCcw, LogOut } from 'lucide-react';

const AdminPortal = () => {
  const navigate = useNavigate();
  const {
    admin,
    login,
    logout,
    activeRide,
    rideHistory,
    onlineDrivers,
    resetSimulator
  } = useSimulation();

  // Auth inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Local state for driver verification board
  const [pendingDrivers, setPendingDrivers] = useState([
    { id: 'p_drv_1', name: 'Rahul Varma', city: 'New Delhi', vehicle: 'Hyundai Aura (Sedan)', status: 'pending' },
    { id: 'p_drv_2', name: 'Sanjay Nair', city: 'Mumbai', vehicle: 'Maruti Ertiga (SUV)', status: 'pending' },
    { id: 'p_drv_3', name: 'Kiran Gowda', city: 'Bengaluru', vehicle: 'Suzuki Celerio (Mini)', status: 'pending' }
  ]);

  const handleAdminAuth = (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login('admin', { email, password });
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = () => {
    login('admin', { email: 'admin@cabhub.com', password: 'admin123' });
  };

  const handleVerifyDriver = (id) => {
    setPendingDrivers(prev => prev.map(d => d.id === id ? { ...d, status: 'verified' } : d));
  };

  // Computes dashboard stats
  const stats = useMemo(() => {
    const completedRides = rideHistory.filter(r => r.status === 'completed');
    const revenue = completedRides.reduce((sum, r) => sum + r.fare, 0);
    const cancelled = rideHistory.filter(r => r.status === 'cancelled').length;
    const totalDiscounts = completedRides.reduce((sum, r) => sum + (r.discount || 0), 0);
    
    return {
      revenue,
      completedCount: completedRides.length,
      activeCount: activeRide ? 1 : 0,
      cancelledCount: cancelled,
      totalDiscounts
    };
  }, [rideHistory, activeRide]);

  // Generate logs feed dynamically based on state
  const logsFeed = useMemo(() => {
    const logs = [];
    
    // Core logs from history
    rideHistory.forEach((ride, i) => {
      const timeStr = new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (ride.status === 'completed') {
        const promoText = ride.promoCode ? ` (Promo ${ride.promoCode} applied: -₹${ride.discount})` : '';
        logs.push({
          time: timeStr,
          text: `Trip ${ride.id} completed. ₹${ride.fare} paid by passenger${promoText}. Pilot earnings credited: ₹${ride.originalFare || ride.fare}.`,
          type: 'success'
        });
      } else if (ride.status === 'cancelled') {
        logs.push({
          time: timeStr,
          text: `Trip ${ride.id} requested by ${ride.passenger.name} was cancelled.`,
          type: 'danger'
        });
      }
    });

    // Add active ride logs
    if (activeRide) {
      const timeStr = new Date(activeRide.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      logs.push({
        time: timeStr,
        text: `Trip request ${activeRide.id} active. Status: ${activeRide.status.toUpperCase()}.`,
        type: 'info'
      });
      if (activeRide.status === 'requested') {
        logs.push({
          time: timeStr,
          text: `Passenger ${activeRide.passenger.name} searching for nearby ${activeRide.vehicleType} cab.`,
          type: 'warning'
        });
      } else if (activeRide.status === 'accepted') {
        logs.push({
          time: timeStr,
          text: `Pilot ${activeRide.driver?.name} accepted dispatch order for trip ${activeRide.id}.`,
          type: 'info'
        });
      }
    }

    // Default startup logs if feed is empty
    if (logs.length === 0) {
      logs.push({ time: 'System', text: 'CabHub dispatch console initialized. Fleet tracking active.', type: 'info' });
      logs.push({ time: 'System', text: 'Simulated location hubs connected: Delhi, Mumbai, Bengaluru.', type: 'info' });
    }

    return logs.slice(0, 10); // keep last 10 entries
  }, [rideHistory, activeRide]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '20px 12px'
    }}>
      <div className="container-layout" style={{ maxWidth: '1080px' }}>
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
            CabHub <span style={{ color: 'var(--chakra)' }}>Operations Control</span>
          </h2>

          {admin && (
            <button 
              onClick={() => logout('admin')}
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

        {/* Login Card */}
        {!admin ? (
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '420px',
            margin: '80px auto 0 auto',
            padding: '32px 24px',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(0,0,128,0.15) 0%, rgba(15,23,42,0.15) 100%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto',
                color: 'var(--chakra)'
              }}>
                <Lock size={30} />
              </div>
              <h3 style={{ fontSize: '22px' }}>Operations Sign In</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>
                Secure terminal for fleet monitoring & statistics
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

            <form onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>ADMIN EMAIL</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  placeholder="admin@cabhub.com"
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
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>PASSWORD</label>
                <input 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  placeholder="admin123"
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

              <button type="submit" className="glow-btn-saffron" style={{ padding: '12px 0', fontSize: '15px', background: 'var(--chakra)', boxShadow: 'var(--chakra-glow) 0 8px 20px', marginTop: '8px' }}>
                Access Terminal
              </button>
            </form>

            <button 
              onClick={handleQuickLogin}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'block',
                margin: '20px auto 0 auto',
                textDecoration: 'underline'
              }}
            >
              Autofill & Login (admin@cabhub.com)
            </button>
          </div>
        ) : (
          /* Admin Dashboard Dashboard */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
            {/* Top Stat Summary Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px'
            }}>
              {/* Stat Card 1 */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,0,128,0.1)', color: 'var(--chakra)' }}>
                  <TrendingUp size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>TOTAL REVENUE</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '800' }}>₹{stats.revenue}</h3>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(19,136,8,0.1)', color: 'var(--emerald)' }}>
                  <Compass size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>COMPLETED TRIPS</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stats.completedCount}</h3>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,153,51,0.1)', color: 'var(--saffron)' }}>
                  <Calendar size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>ACTIVE TRIPS</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{stats.activeCount}</h3>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                  <Users size={24} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>ONLINE PILOTS</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '800' }}>{onlineDrivers.length}</h3>
                </div>
              </div>

              {/* Stat Card 5 (Platform Subsidies) */}
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                  <TrendingUp size={24} style={{ transform: 'rotate(180deg)' }} />
                </div>
                <div>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '500' }}>PLATFORM SUBSIDIES</span>
                  <h3 style={{ fontSize: '24px', fontWeight: '800' }}>₹{stats.totalDiscounts}</h3>
                </div>
              </div>
            </div>

            {/* Split Screen Panel */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
              gap: '24px'
            }}>
              {/* Left Screen: Live Dispatch Monitoring Logs */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Live Dispatch Logs Feed</h3>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  background: 'var(--bg-tertiary)',
                  borderRadius: '12px',
                  padding: '16px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                  flexGrow: 1,
                  maxHeight: '340px',
                  overflowY: 'auto'
                }}>
                  {logsFeed.map((log, idx) => (
                    <div key={`log-${idx}`} style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(0,0,0,0.03)', paddingBottom: '8px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>[{log.time}]</span>
                      <span style={{
                        color: log.type === 'success' ? 'var(--emerald)' : 
                               log.type === 'danger' ? '#E11D48' : 
                               log.type === 'warning' ? 'var(--saffron)' : 'var(--text-primary)'
                      }}>
                        {log.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Screen: Pilot Onboarding / Verification Panel */}
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--chakra)" />
                  <span>Pilot Verification Dashboard</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pendingDrivers.map((pilot, idx) => (
                    <div 
                      key={`pd-${idx}`}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: '12px',
                        background: 'var(--bg-secondary)'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '14px' }}>{pilot.name}</div>
                        <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{pilot.vehicle} &bull; {pilot.city}</span>
                      </div>

                      {pilot.status === 'verified' ? (
                        <span style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: 'var(--emerald)',
                          fontSize: '12px',
                          fontWeight: '700',
                          background: 'rgba(19,136,8,0.1)',
                          padding: '4px 8px',
                          borderRadius: '20px'
                        }}>
                          <Check size={12} />
                          Verified
                        </span>
                      ) : (
                        <button 
                          onClick={() => handleVerifyDriver(pilot.id)}
                          style={{
                            background: 'var(--chakra)',
                            color: '#FFF',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '10px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'opacity 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.opacity = 0.9}
                          onMouseLeave={e => e.currentTarget.style.opacity = 1}
                        >
                          Verify Pilot
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Fleet Monitoring Map list */}
            {activeRide && (
              <div className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Active Fleet Operations Monitor</h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', background: 'var(--bg-tertiary)', padding: '12px', borderRadius: '12px' }}>
                  <span>Active Ride ID: <strong>{activeRide.id}</strong></span>
                  <span>Passenger: <strong>{activeRide.passenger.name}</strong></span>
                  <span>Pilot: <strong>{activeRide.driver ? activeRide.driver.name : 'Searching...'}</strong></span>
                  <span>Fare: <strong>₹{activeRide.fare}</strong></span>
                  <span>Status: <strong style={{ color: 'var(--saffron)' }}>{activeRide.status.toUpperCase()}</strong></span>
                </div>
              </div>
            )}

            {/* Diagnostics reset section */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button
                onClick={resetSimulator}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer'
                }}
              >
                <RotateCcw size={14} />
                <span>Reset Simulation Database</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
