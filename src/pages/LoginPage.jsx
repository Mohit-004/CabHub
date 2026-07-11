import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, Eye, EyeOff, User, Navigation, ShieldAlert, Sun, Moon, ArrowRight, Zap } from 'lucide-react';
import { useSimulation, DUMMY_PASSENGERS, DUMMY_DRIVERS } from '../context/SimulationContext';
import { useToast } from '../components/ToastNotification';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, theme, toggleTheme } = useSimulation();
  const { addToast } = useToast();

  const [role, setRole] = useState('passenger');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(role, { email, password });
    setLoading(false);
    if (result.success) {
      addToast(`Welcome back! Logged in as ${role}. 🚖`, 'success');
      if (role === 'passenger') navigate('/passenger');
      else if (role === 'driver') navigate('/driver');
      else navigate('/admin');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleQuickLogin = (type) => {
    setLoading(true);
    setTimeout(() => {
      let result;
      if (type === 'passenger') {
        result = login('passenger', { email: DUMMY_PASSENGERS[0].email, password: DUMMY_PASSENGERS[0].password });
        if (result.success) navigate('/passenger');
      } else if (type === 'driver') {
        result = login('driver', { email: DUMMY_DRIVERS[0].email, password: DUMMY_DRIVERS[0].password });
        if (result.success) navigate('/driver');
      } else {
        result = login('admin', { email: 'admin@cabhub.com', password: 'admin123' });
        if (result.success) navigate('/admin');
      }
      setLoading(false);
      addToast(`Logged in as ${type}! 🚖`, 'success');
    }, 500);
  };

  const roles = [
    { id: 'passenger', label: 'Passenger', icon: User, color: '#FF9933' },
    { id: 'driver', label: 'Driver / Pilot', icon: Navigation, color: 'var(--emerald)' },
    { id: 'admin', label: 'Admin', icon: ShieldAlert, color: 'var(--chakra)' },
  ];

  const demoCredentials = {
    passenger: DUMMY_PASSENGERS.slice(0, 3),
    driver: DUMMY_DRIVERS.slice(0, 3),
    admin: [{ name: 'CabHub Director', email: 'admin@cabhub.com', password: 'admin123' }],
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #FF9933 0%, #FF5500 100%)',
            padding: '8px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--saffron-glow) 0 6px 14px',
          }}>
            <Car size={20} color="#FFF" />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #FF9933 0%, var(--emerald) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
          }}>
            CabHub
          </span>
        </div>
        <button
          onClick={toggleTheme}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '8px',
            cursor: 'pointer',
            display: 'flex',
            color: 'var(--text-primary)',
          }}
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>

      {/* Main layout */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        padding: '40px 24px',
        gap: '48px',
        alignItems: 'start',
      }} className="auth-grid">
        {/* Left hero panel */}
        <div className="auth-hero-panel" style={{ paddingTop: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, rgba(255,153,51,0.15) 0%, rgba(19,136,8,0.15) 100%)',
            border: '1px solid rgba(255,153,51,0.3)',
            borderRadius: '20px',
            padding: '5px 14px',
            fontSize: '12px',
            fontWeight: '700',
            color: '#FF9933',
            marginBottom: '24px',
            letterSpacing: '0.05em',
          }}>
            <Zap size={12} /> INDIA'S PREMIER RIDE-HAILING APP
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '800',
            lineHeight: '1.15',
            fontFamily: 'var(--font-display)',
            marginBottom: '16px',
            letterSpacing: '-0.03em',
          }}>
            Your premium
            <br />
            <span style={{
              background: 'linear-gradient(135deg, #FF9933 0%, #FF5500 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ride awaits
            </span>{' '}
            🚖
          </h1>

          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '16px',
            lineHeight: '1.7',
            marginBottom: '32px',
            maxWidth: '400px',
          }}>
            Maharashtra's most reliable cab service. Real-time tracking, secure payments, and verified drivers across Pune & Mumbai.
          </p>

          {/* Feature highlights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '36px' }}>
            {[
              { emoji: '📍', title: 'Live GPS Tracking', desc: 'Watch your driver on the map in real-time' },
              { emoji: '💳', title: 'Secure Wallet', desc: 'Pay instantly with your CabHub balance' },
              { emoji: '⭐', title: 'Rated Drivers', desc: 'Verified pilots with 4.5+ ratings' },
              { emoji: '🔒', title: 'OTP-verified rides', desc: 'Safe boarding with trip verification' },
            ].map((f) => (
              <div key={f.title} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '20px', flexShrink: 0 }}>{f.emoji}</span>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '2px' }}>{f.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Demo credentials hint */}
          <div style={{
            background: 'var(--bg-tertiary)',
            borderRadius: '14px',
            padding: '16px',
            border: '1px solid var(--border-color)',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.06em' }}>
              🎯 DEMO CREDENTIALS ({role.toUpperCase()})
            </p>
            {demoCredentials[role].map((u) => (
              <div
                key={u.email}
                onClick={() => { setEmail(u.email); setPassword(u.password); }}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                  marginBottom: '4px',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--border-color)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div>
                  <div style={{ fontSize: '13px', fontWeight: '600' }}>{u.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span style={{
                  fontSize: '10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '6px',
                  padding: '2px 8px',
                  color: 'var(--text-secondary)',
                  fontFamily: 'monospace',
                }}>
                  {u.password}
                </span>
              </div>
            ))}
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px' }}>
              ↑ Click any row to autofill
            </p>
          </div>
        </div>

        {/* Right form panel */}
        <div>
          <div className="glass-card animate-fade-in" style={{
            padding: '36px 32px',
            border: '1px solid var(--border-color)',
          }}>
            <h2 style={{
              fontSize: '26px',
              fontFamily: 'var(--font-display)',
              fontWeight: '800',
              marginBottom: '6px',
            }}>
              Sign In
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
              Select your role and enter credentials to continue
            </p>

            {/* Role selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: 'var(--text-secondary)', marginBottom: '10px', letterSpacing: '0.06em' }}>
                LOGIN AS
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {roles.map(r => {
                  const Icon = r.icon;
                  const isActive = role === r.id;
                  return (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id)}
                      style={{
                        flex: 1,
                        padding: '10px 8px',
                        borderRadius: '12px',
                        border: isActive ? `2px solid ${r.color}` : '1px solid var(--border-color)',
                        background: isActive ? `${r.color}15` : 'var(--bg-tertiary)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '5px',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Icon size={18} color={isActive ? r.color : 'var(--text-muted)'} />
                      <span style={{
                        fontSize: '10px',
                        fontWeight: '700',
                        color: isActive ? r.color : 'var(--text-muted)',
                        letterSpacing: '0.04em',
                      }}>
                        {r.label.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                background: 'rgba(225,29,72,0.08)',
                border: '1px solid #E11D48',
                color: '#E11D48',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '13px',
                marginBottom: '16px',
                fontWeight: '500',
              }}>
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Email */}
              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  autoComplete="email"
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label style={labelStyle}>PASSWORD</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    style={{ ...inputStyle, paddingRight: '44px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)',
                      display: 'flex',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={loading}
                className="glow-btn-saffron"
                style={{
                  padding: '14px 0',
                  fontSize: '15px',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  opacity: loading ? 0.8 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Quick login */}
            <div style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <p style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '10px', letterSpacing: '0.06em' }}>
                ⚡ QUICK DEMO ACCESS
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { label: '🧑 Passenger', type: 'passenger', color: '#FF9933' },
                  { label: '🚗 Driver', type: 'driver', color: 'var(--emerald)' },
                  { label: '🛡️ Admin', type: 'admin', color: 'var(--chakra)' },
                ].map(q => (
                  <button
                    key={q.type}
                    onClick={() => handleQuickLogin(q.type)}
                    disabled={loading}
                    style={{
                      flex: 1,
                      minWidth: '90px',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: `1px solid ${q.color}40`,
                      background: `${q.color}10`,
                      color: q.color,
                      fontSize: '12px',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-display)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Register link */}
            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              New to CabHub?{' '}
              <Link
                to="/register"
                style={{
                  color: '#FF9933',
                  fontWeight: '700',
                  textDecoration: 'none',
                }}
              >
                Create an account →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 720px) {
          .auth-grid {
            grid-template-columns: 1fr !important;
          }
          .auth-hero-panel {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

const labelStyle = {
  display: 'block',
  fontSize: '11px',
  fontWeight: '700',
  color: 'var(--text-secondary)',
  marginBottom: '7px',
  letterSpacing: '0.06em',
};

const inputStyle = {
  width: '100%',
  padding: '12px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--border-color)',
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

export default LoginPage;
