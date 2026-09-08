import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { Car, Navigation, ShieldAlert, Sun, Moon, RefreshCw, Smartphone } from 'lucide-react';

const PortalSelector = () => {
  const { theme, toggleTheme, resetSimulator, passenger, driver, activeRide } = useSimulation();
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '24px',
      position: 'relative',
      background: 'var(--bg-primary)'
    }} className="animate-fade-in">
      {/* Top Header Row */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF9933 0%, #FF5500 100%)',
            padding: '10px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--saffron-glow) 0px 8px 16px'
          }}>
            <Car size={24} color="#FFF" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FF9933 0%, var(--emerald) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em'
          }}>
            CabHub
          </span>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={toggleTheme}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)'
            }}
            title="Toggle theme"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button 
            onClick={resetSimulator}
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '10px 16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontFamily: 'var(--font-display)',
              fontWeight: '600',
              fontSize: '14px',
              color: 'var(--text-primary)',
              boxShadow: 'var(--card-shadow)'
            }}
            title="Reset simulated data"
          >
            <RefreshCw size={16} />
            <span>Reset Demo</span>
          </button>
        </div>
      </header>

      {/* Main Hero & Selectors */}
      <main style={{
        maxWidth: '1000px',
        width: '100%',
        margin: 'auto',
        textAlign: 'center',
        padding: '40px 0'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '800',
          lineHeight: '1.1',
          marginBottom: '16px',
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(180deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Premium Ride-Hailing Platform
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto 48px auto',
          lineHeight: '1.6'
        }}>
          Explore the localized, real-time mobility dashboard tailored for passengers, pilots, and operations control in India.
        </p>

        {/* Portals grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px',
          marginTop: '20px'
        }}>
          {/* Passenger App Card */}
          <div 
            onClick={() => navigate('/passenger')}
            className="glass-card"
            style={{
              padding: '32px 24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = '#FF9933';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px var(--saffron-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--card-shadow)';
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(255,85,0,0.15) 100%)',
              padding: '20px',
              borderRadius: '24px',
              color: '#FF9933',
              marginBottom: '20px'
            }}>
              <Smartphone size={32} />
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Passenger Portal</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
              Request premium rides, select luxury cabs, calculate fares in INR, and track active bookings on the map.
            </p>
            {passenger && (
              <span style={{
                marginTop: '16px',
                fontSize: '12px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontWeight: '500'
              }}>
                Active Session: {passenger.name}
              </span>
            )}
          </div>

          {/* Driver App Card */}
          <div 
            onClick={() => navigate('/driver')}
            className="glass-card"
            style={{
              padding: '32px 24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'var(--emerald)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px var(--emerald-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--card-shadow)';
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(19,136,8,0.15) 0%, rgba(9,87,3,0.15) 100%)',
              padding: '20px',
              borderRadius: '24px',
              color: 'var(--emerald)',
              marginBottom: '20px'
            }}>
              <Navigation size={32} />
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Driver (Bharat Nav)</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
              Accept ride dispatch orders, toggle duty status, navigate routes, and review your daily fare earnings.
            </p>
            {driver && (
              <span style={{
                marginTop: '16px',
                fontSize: '12px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-secondary)',
                padding: '4px 10px',
                borderRadius: '20px',
                fontWeight: '500'
              }}>
                On-Duty: {driver.name} ({driver.status})
              </span>
            )}
          </div>

          {/* Admin App Card */}
          <div 
            onClick={() => navigate('/admin')}
            className="glass-card"
            style={{
              padding: '32px 24px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              border: '1px solid var(--border-color)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.borderColor = 'var(--chakra)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px var(--chakra-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.boxShadow = 'var(--card-shadow)';
            }}
          >
            <div style={{
              background: 'linear-gradient(135deg, rgba(0,0,128,0.15) 0%, rgba(0,0,80,0.15) 100%)',
              padding: '20px',
              borderRadius: '24px',
              color: 'var(--chakra)',
              marginBottom: '20px'
            }}>
              <ShieldAlert size={32} />
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px' }}>Admin Console</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: '1.5', flexGrow: 1 }}>
              Manage fleet metrics, monitor ongoing trips, track revenue streams, and verify driver credentials.
            </p>
            {activeRide && (
              <span style={{
                marginTop: '16px',
                fontSize: '12px',
                background: 'linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(19,136,8,0.15) 100%)',
                color: '#FF7700',
                padding: '4px 10px',
                borderRadius: '20px',
                fontWeight: '600'
              }}>
                1 Trip In-Progress
              </span>
            )}
          </div>
        </div>
      </main>

      {/* Simulator Quick Status Info */}
      <footer style={{
        textAlign: 'center',
        padding: '20px 0 8px 0',
        fontSize: '13px',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--border-color)',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <span>CabHub Demo Platform &copy; 2026. Made with Indian Pride 🚖🇮🇳</span>
        <div style={{ display: 'flex', gap: '16px' }}>
          <span>Active Booking Status: <strong style={{ color: activeRide ? '#FF9933' : 'var(--text-muted)' }}>{activeRide ? activeRide.status.toUpperCase() : 'NO BOOKINGS'}</strong></span>
        </div>
      </footer>
    </div>
  );
};

export default PortalSelector;
