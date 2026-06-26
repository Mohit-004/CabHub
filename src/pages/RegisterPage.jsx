import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Car, Eye, EyeOff, User, Navigation, Sun, Moon, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { useToast } from '../components/ToastNotification';

// Password strength utility
const getPasswordStrength = (password) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const strengthMeta = [
  { label: '', color: 'transparent' },
  { label: 'Weak', color: '#dc2626' },
  { label: 'Fair', color: '#d97706' },
  { label: 'Good', color: '#2563eb' },
  { label: 'Strong', color: '#16a34a' },
  { label: 'Very Strong 🔒', color: '#16a34a' },
];

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, theme, toggleTheme } = useSimulation();
  const { addToast } = useToast();

  const [role, setRole] = useState('passenger');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    vehicleModel: '',
    vehicleNumber: '',
    vehicleType: 'Sedan',
    licenseNumber: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(formData.password);
  const strengthInfo = strengthMeta[passwordStrength];

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Full name is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Valid email address is required.';
    if (!formData.password || formData.password.length < 8) return 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    if (role === 'driver') {
      if (!formData.vehicleModel.trim()) return 'Vehicle model is required.';
      if (!formData.vehicleNumber.trim()) return 'Vehicle number is required.';
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register(role, formData);
    setLoading(false);
    if (result.success) {
      addToast(`Account created! Welcome to CabHub, ${formData.name.split(' ')[0]}! 🎉`, 'success');
      if (role === 'passenger') navigate('/passenger');
      else navigate('/driver');
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  const requirements = [
    { text: 'At least 8 characters', met: formData.password.length >= 8 },
    { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
    { text: 'Contains a number', met: /[0-9]/.test(formData.password) },
    { text: 'Contains special character', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
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
        </Link>
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

      {/* Main form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div className="glass-card animate-fade-in" style={{
          width: '100%',
          maxWidth: '560px',
          padding: '36px 32px',
          border: '1px solid var(--border-color)',
        }}>
          <h2 style={{ fontSize: '26px', fontFamily: 'var(--font-display)', fontWeight: '800', marginBottom: '4px' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '28px' }}>
            Join CabHub — India's premium ride-hailing platform
          </p>

          {/* Role selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>I WANT TO</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { id: 'passenger', label: 'Book Rides', sublabel: 'Passenger', icon: User, color: '#FF9933' },
                { id: 'driver', label: 'Drive & Earn', sublabel: 'Driver / Pilot', icon: Navigation, color: 'var(--emerald)' },
              ].map(r => {
                const Icon = r.icon;
                const isActive = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    style={{
                      flex: 1,
                      padding: '16px 12px',
                      borderRadius: '14px',
                      border: isActive ? `2px solid ${r.color}` : '1.5px solid var(--border-color)',
                      background: isActive ? `${r.color}12` : 'var(--bg-tertiary)',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <Icon size={22} color={isActive ? r.color : 'var(--text-muted)'} />
                    <div style={{ fontSize: '14px', fontWeight: '800', color: isActive ? r.color : 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                      {r.label}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.sublabel}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{
              background: 'rgba(225,29,72,0.08)',
              border: '1px solid #E11D48',
              color: '#E11D48',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '13px',
              marginBottom: '18px',
              fontWeight: '500',
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Full Name */}
            <div>
              <label style={labelStyle}>FULL NAME</label>
              <input
                id="reg-name"
                type="text"
                value={formData.name}
                onChange={handleChange('name')}
                placeholder="e.g. Priya Deshmukh"
                style={inputStyle}
              />
            </div>

            {/* Email + Phone */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input
                  id="reg-email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="name@example.com"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>PHONE NUMBER</label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="+91 98765 XXXXX"
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange('password')}
                  placeholder="Min. 8 characters"
                  style={{ ...inputStyle, paddingRight: '44px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength bar */}
              {formData.password && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '5px' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} style={{
                        flex: 1,
                        height: '4px',
                        borderRadius: '2px',
                        background: i <= passwordStrength ? strengthInfo.color : 'var(--border-color)',
                        transition: 'background 0.3s ease',
                      }} />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: strengthInfo.color }}>
                      {strengthInfo.label}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {requirements.map(req => (
                        <span key={req.text} title={req.text} style={{ display: 'flex', alignItems: 'center' }}>
                          {req.met
                            ? <CheckCircle size={11} color="#16a34a" />
                            : <XCircle size={11} color="#dc2626" />
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                    {requirements.filter(r => !r.met).map(r => (
                      <span key={r.text} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        • {r.text}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label style={labelStyle}>CONFIRM PASSWORD</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Re-enter your password"
                  style={{
                    ...inputStyle,
                    paddingRight: '44px',
                    borderColor: formData.confirmPassword && formData.confirmPassword !== formData.password
                      ? '#dc2626' : 'var(--border-color)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(v => !v)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                <p style={{ fontSize: '11px', color: '#dc2626', marginTop: '4px' }}>Passwords do not match</p>
              )}
            </div>

            {/* Driver-only fields */}
            {role === 'driver' && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(19,136,8,0.05) 0%, rgba(19,136,8,0.08) 100%)',
                border: '1px solid rgba(19,136,8,0.2)',
                borderRadius: '14px',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}>
                <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--emerald)', marginBottom: '2px' }}>
                  🚗 VEHICLE DETAILS (Required for Drivers)
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>VEHICLE MODEL</label>
                    <input
                      id="reg-vehicle-model"
                      type="text"
                      value={formData.vehicleModel}
                      onChange={handleChange('vehicleModel')}
                      placeholder="e.g. Maruti Dzire"
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>VEHICLE NUMBER</label>
                    <input
                      id="reg-vehicle-number"
                      type="text"
                      value={formData.vehicleNumber}
                      onChange={handleChange('vehicleNumber')}
                      placeholder="e.g. MH 12 AB 1234"
                      style={{ ...inputStyle, textTransform: 'uppercase' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={labelStyle}>VEHICLE TYPE</label>
                    <select
                      id="reg-vehicle-type"
                      value={formData.vehicleType}
                      onChange={handleChange('vehicleType')}
                      style={inputStyle}
                    >
                      <option value="Mini">Mini (Hatchback)</option>
                      <option value="Sedan">Sedan (Dzire/Etios)</option>
                      <option value="SUV">SUV (Ertiga/Crysta)</option>
                      <option value="Auto">Auto Rickshaw</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>LICENSE NUMBER</label>
                    <input
                      id="reg-license-number"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleChange('licenseNumber')}
                      placeholder="e.g. MH1220220001234"
                      style={{ ...inputStyle, textTransform: 'uppercase' }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              id="register-submit-btn"
              type="submit"
              disabled={loading}
              className={role === 'driver' ? 'glow-btn-emerald' : 'glow-btn-saffron'}
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
                  Creating account...
                </span>
              ) : (
                <>
                  {role === 'driver' ? '🚗 Register as Driver' : '🚖 Create Passenger Account'} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link
              to="/"
              style={{ color: '#FF9933', fontWeight: '700', textDecoration: 'none' }}
            >
              Sign In →
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 560px) {
          .register-grid { grid-template-columns: 1fr !important; }
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
  padding: '11px 14px',
  borderRadius: '10px',
  border: '1.5px solid var(--border-color)',
  background: 'var(--input-bg)',
  color: 'var(--text-primary)',
  fontSize: '14px',
  fontFamily: 'var(--font-sans)',
  outline: 'none',
  transition: 'border-color 0.2s ease',
};

export default RegisterPage;
