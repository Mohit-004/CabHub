import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Navigation, Star, Wallet, Car, Phone, Mail, Edit3, Save, X, Award, TrendingUp } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useToast } from '../components/ToastNotification';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { passenger, driver, setPassenger, setDriver, rideHistory, logout } = useSimulation();
  const { addToast } = useToast();

  const user = passenger || driver;
  const role = passenger ? 'passenger' : 'driver';

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '16px',
        color: 'var(--text-secondary)',
      }}>
        <User size={48} opacity={0.3} />
        <p>No user session found.</p>
        <button onClick={() => navigate('/')} className="glow-btn-saffron" style={{ padding: '10px 24px', fontSize: '14px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  const userRides = rideHistory.filter(r =>
    role === 'passenger'
      ? r.passenger?.id === user.id
      : r.driver?.id === user.id
  );

  const completedRides = userRides.filter(r => r.status === 'completed');
  const cancelledRides = userRides.filter(r => r.status === 'cancelled');
  const totalSpent = completedRides.reduce((sum, r) => sum + (r.fare || 0), 0);
  const avgRating = completedRides.filter(r => r.passengerRating).reduce((sum, r, _, arr) => sum + r.passengerRating / arr.length, 0);

  const handleSave = () => {
    if (!editName.trim()) {
      addToast('Name cannot be empty', 'error');
      return;
    }
    const updated = { ...user, name: editName.trim(), phone: editPhone.trim() };
    if (role === 'passenger') {
      setPassenger(updated);
    } else {
      setDriver(updated);
    }
    setEditing(false);
    addToast('Profile updated successfully!', 'success');
  };

  const handleCancelEdit = () => {
    setEditName(user.name);
    setEditPhone(user.phone);
    setEditing(false);
  };

  const accentColor = role === 'passenger' ? '#FF9933' : 'var(--emerald)';
  const gradientBg = role === 'passenger'
    ? 'linear-gradient(135deg, rgba(255,153,51,0.12) 0%, rgba(255,85,0,0.06) 100%)'
    : 'linear-gradient(135deg, rgba(19,136,8,0.12) 0%, rgba(9,87,3,0.06) 100%)';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      padding: '20px 16px',
    }}>
      <div className="container-layout" style={{ maxWidth: '700px' }}>
        {/* Nav */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <button
            onClick={() => navigate(role === 'passenger' ? '/passenger' : '/driver')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: 'var(--text-secondary)',
              fontSize: '15px',
              fontWeight: '600',
            }}
          >
            <ArrowLeft size={18} />
            <span>Back to Portal</span>
          </button>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800' }}>
            My Profile
          </h2>
          <div style={{ width: '80px' }} />
        </nav>

        {/* Profile hero card */}
        <div className="glass-card animate-fade-in" style={{
          padding: '32px',
          border: '1px solid var(--border-color)',
          marginBottom: '24px',
          background: gradientBg,
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {/* Avatar */}
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}15 100%)`,
                border: `3px solid ${accentColor}40`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                fontWeight: '800',
                color: accentColor,
                fontFamily: 'var(--font-display)',
              }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-display)' }}>{user.name}</h3>
                  <span style={{
                    fontSize: '10px',
                    background: `${accentColor}20`,
                    color: accentColor,
                    border: `1px solid ${accentColor}30`,
                    borderRadius: '20px',
                    padding: '2px 10px',
                    fontWeight: '700',
                    letterSpacing: '0.05em',
                  }}>
                    {role === 'passenger' ? '🧑 PASSENGER' : '🚗 DRIVER'}
                  </span>
                </div>
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                  {user.email}
                </p>
                {driver && driver.status && (
                  <span style={{
                    fontSize: '11px',
                    color: driver.status !== 'inactive' ? 'var(--emerald)' : 'var(--text-muted)',
                    fontWeight: '600',
                  }}>
                    ● {driver.status === 'inactive' ? 'Offline' : driver.status === 'active' ? 'Online' : 'On Ride'}
                  </span>
                )}
              </div>
            </div>

            {/* Edit controls */}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  padding: '8px 14px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                }}
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSave}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'var(--emerald)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#fff',
                  }}
                >
                  <Save size={14} />
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '10px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Edit form */}
          {editing ? (
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>FULL NAME</label>
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  style={inputStyle}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value)}
                  style={inputStyle}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px' }}>
              <div style={infoRowStyle}>
                <Mail size={14} color={accentColor} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.04em' }}>EMAIL</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{user.email}</div>
                </div>
              </div>
              <div style={infoRowStyle}>
                <Phone size={14} color={accentColor} />
                <div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.04em' }}>PHONE</div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{user.phone || 'Not set'}</div>
                </div>
              </div>
              {driver && (
                <div style={infoRowStyle}>
                  <Car size={14} color={accentColor} />
                  <div>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600', letterSpacing: '0.04em' }}>VEHICLE</div>
                    <div style={{ fontSize: '13px', fontWeight: '600' }}>{driver.vehicle?.model} · {driver.vehicle?.number}</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Stats grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          {[
            {
              icon: <TrendingUp size={20} color={accentColor} />,
              label: 'Total Rides',
              value: completedRides.length,
              sub: `${cancelledRides.length} cancelled`,
            },
            role === 'passenger'
              ? {
                  icon: <Wallet size={20} color={accentColor} />,
                  label: 'Wallet Balance',
                  value: `₹${passenger?.walletBalance?.toLocaleString('en-IN')}`,
                  sub: `₹${totalSpent} total spent`,
                }
              : {
                  icon: <Wallet size={20} color={accentColor} />,
                  label: 'Total Earnings',
                  value: `₹${driver?.earnings?.toLocaleString('en-IN')}`,
                  sub: `From ${completedRides.length} rides`,
                },
            {
              icon: <Star size={20} color="#FFC700" fill="#FFC700" />,
              label: 'Avg Rating',
              value: avgRating ? avgRating.toFixed(1) + ' ⭐' : (driver?.rating || '—'),
              sub: role === 'driver' ? 'Driver rating' : 'Ratings given',
            },
            {
              icon: <Award size={20} color={accentColor} />,
              label: 'Member Since',
              value: 'Jun 2026',
              sub: 'CabHub Premium',
            },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{
              padding: '20px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {stat.icon}
                <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
                  {stat.label.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Recent rides */}
        {userRides.length > 0 && (
          <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '16px', fontFamily: 'var(--font-display)', marginBottom: '16px' }}>
              Recent Rides
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {userRides.slice(0, 5).map((ride, i) => (
                <div key={i} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--bg-tertiary)',
                  gap: '12px',
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {ride.pickup?.name?.split(',')[0]} → {ride.drop?.name?.split(',')[0]}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {ride.vehicleType}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      background: ride.status === 'completed' ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.1)',
                      color: ride.status === 'completed' ? '#16a34a' : '#dc2626',
                    }}>
                      {ride.status.charAt(0).toUpperCase() + ride.status.slice(1)}
                    </span>
                    <span style={{ fontSize: '14px', fontWeight: '800' }}>₹{ride.fare}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={() => { logout(role); navigate('/'); }}
          style={{
            width: '100%',
            padding: '13px',
            background: 'rgba(225,29,72,0.06)',
            border: '1px solid rgba(225,29,72,0.2)',
            borderRadius: '12px',
            color: '#E11D48',
            fontFamily: 'var(--font-display)',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(225,29,72,0.12)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(225,29,72,0.06)'}
        >
          Sign Out of CabHub
        </button>
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  letterSpacing: '0.05em',
};

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--border-color)',
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
};

const infoRowStyle = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  background: 'var(--bg-secondary)',
  borderRadius: '10px',
  padding: '12px',
};

export default ProfilePage;
