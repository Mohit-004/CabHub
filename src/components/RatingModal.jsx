import React, { useState } from 'react';
import { Star, X, MessageSquare, CheckCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const RatingModal = ({ ride, onClose }) => {
  const { rateDriver } = useSimulation();
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedStar, setSelectedStar] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  const quickFeedback = [
    'Very polite driver',
    'Clean vehicle',
    'Safe driving',
    'On time',
    'Helpful & friendly',
    'AC was perfect',
  ];

  const handleSubmit = () => {
    if (selectedStar === 0) return;
    rateDriver(ride.id, selectedStar, feedback);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  if (submitted) {
    return (
      <div style={overlayStyle}>
        <div className="glass-card animate-fade-in" style={modalStyle}>
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, rgba(22,163,74,0.25) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
            }}>
              <CheckCircle size={36} color="#16a34a" />
            </div>
            <h3 style={{ fontSize: '22px', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
              Thanks for the Rating!
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Your feedback helps drivers improve. 🙏
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '16px' }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={24} fill={s <= selectedStar ? '#FFC700' : 'none'} color={s <= selectedStar ? '#FFC700' : 'var(--border-color)'} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="glass-card animate-fade-in" style={modalStyle}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--bg-tertiary)',
            border: 'none',
            borderRadius: '8px',
            padding: '6px',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            display: 'flex',
          }}
        >
          <X size={16} />
        </button>

        {/* Driver info */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(255,153,51,0.2) 0%, rgba(19,136,8,0.2) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto',
            fontSize: '26px',
          }}>
            🚗
          </div>
          <h3 style={{ fontSize: '20px', fontFamily: 'var(--font-display)', marginBottom: '4px' }}>
            Rate your ride
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {ride?.driver?.name || 'Your Driver'} · {ride?.vehicleType}
          </p>
          <div style={{
            marginTop: '10px',
            display: 'flex',
            gap: '6px',
            justifyContent: 'center',
            fontSize: '12px',
            color: 'var(--text-muted)',
          }}>
            <span>📍 {ride?.pickup?.name?.split(',')[0]}</span>
            <span>→</span>
            <span>🏁 {ride?.drop?.name?.split(',')[0]}</span>
          </div>
        </div>

        {/* Star selector */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          {[1,2,3,4,5].map(s => (
            <button
              key={s}
              onMouseEnter={() => setHoveredStar(s)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setSelectedStar(s)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                transform: (hoveredStar >= s || selectedStar >= s) ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}
            >
              <Star
                size={36}
                fill={(hoveredStar >= s || selectedStar >= s) ? '#FFC700' : 'none'}
                color={(hoveredStar >= s || selectedStar >= s) ? '#FFC700' : 'var(--border-color)'}
                strokeWidth={1.5}
              />
            </button>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          fontSize: '14px',
          fontWeight: '700',
          color: selectedStar ? '#FFC700' : 'var(--text-muted)',
          marginBottom: '20px',
          minHeight: '20px',
          transition: 'color 0.2s',
        }}>
          {ratingLabels[hoveredStar || selectedStar] || 'Tap a star to rate'}
        </p>

        {/* Quick feedback chips */}
        <div style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            QUICK FEEDBACK (OPTIONAL)
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {quickFeedback.map(fb => (
              <button
                key={fb}
                onClick={() => setFeedback(prev =>
                  prev.includes(fb) ? prev.replace(` · ${fb}`, '').replace(fb, '').trim() : prev ? prev + ' · ' + fb : fb
                )}
                style={{
                  background: feedback.includes(fb) ? 'rgba(255,153,51,0.15)' : 'var(--bg-tertiary)',
                  border: feedback.includes(fb) ? '1.5px solid #FF9933' : '1px solid var(--border-color)',
                  borderRadius: '20px',
                  padding: '5px 12px',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: feedback.includes(fb) ? '#FF9933' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {fb}
              </button>
            ))}
          </div>
        </div>

        {/* Text area */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <MessageSquare size={12} color="var(--text-secondary)" />
            <span style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>
              ADDITIONAL COMMENTS
            </span>
          </div>
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder="Share your experience (optional)..."
            rows={2}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--input-bg)',
              color: 'var(--text-primary)',
              fontSize: '13px',
              resize: 'vertical',
              fontFamily: 'var(--font-sans)',
              lineHeight: '1.5',
            }}
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={selectedStar === 0}
          className="glow-btn-saffron"
          style={{
            width: '100%',
            padding: '13px 0',
            fontSize: '15px',
            opacity: selectedStar === 0 ? 0.5 : 1,
            cursor: selectedStar === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          Submit Rating
        </button>

        <button
          onClick={onClose}
          style={{
            width: '100%',
            marginTop: '8px',
            padding: '10px 0',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '13px',
            color: 'var(--text-muted)',
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(6px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9000,
  padding: '20px',
};

const modalStyle = {
  position: 'relative',
  width: '100%',
  maxWidth: '420px',
  padding: '32px 28px 24px',
  border: '1px solid var(--border-color)',
};

export default RatingModal;
