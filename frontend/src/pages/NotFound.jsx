import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MapPin, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        right: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,153,51,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(19,136,8,0.06) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="glass-card"
        style={{
          padding: '48px 40px',
          textAlign: 'center',
          maxWidth: '480px',
          width: '100%',
          border: '1px solid var(--border-color)',
          position: 'relative'
        }}
      >
        {/* Animated lost car SVG */}
        <motion.div
          animate={{
            x: [0, 8, -8, 4, 0],
            rotate: [0, 2, -2, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          style={{ marginBottom: '24px' }}
        >
          <svg width="120" height="80" viewBox="0 0 120 80" fill="none" style={{ margin: '0 auto', display: 'block' }}>
            {/* Road */}
            <rect x="0" y="62" width="120" height="4" rx="2" fill="var(--border-color)" />
            <rect x="20" y="63" width="12" height="2" rx="1" fill="var(--text-muted)" opacity="0.5" />
            <rect x="50" y="63" width="12" height="2" rx="1" fill="var(--text-muted)" opacity="0.5" />
            <rect x="80" y="63" width="12" height="2" rx="1" fill="var(--text-muted)" opacity="0.5" />
            
            {/* Car body */}
            <rect x="32" y="40" width="56" height="22" rx="6" fill="var(--saffron)" />
            {/* Car roof */}
            <rect x="44" y="28" width="32" height="16" rx="5" fill="var(--saffron)" />
            {/* Windshield */}
            <rect x="48" y="31" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
            {/* Rear window */}
            <rect x="62" y="31" width="10" height="9" rx="2" fill="var(--bg-secondary)" />
            {/* Headlight */}
            <circle cx="34" cy="51" r="3" fill="#FFE800" />
            {/* Taillight */}
            <circle cx="86" cy="51" r="3" fill="#FF4444" />
            {/* Front wheel */}
            <circle cx="44" cy="62" r="6" fill="var(--text-primary)" />
            <circle cx="44" cy="62" r="3" fill="var(--bg-tertiary)" />
            {/* Back wheel */}
            <circle cx="76" cy="62" r="6" fill="var(--text-primary)" />
            <circle cx="76" cy="62" r="3" fill="var(--bg-tertiary)" />
            
            {/* Question mark above car */}
            <text x="60" y="20" textAnchor="middle" fill="var(--saffron)" fontSize="18" fontWeight="800" fontFamily="var(--font-display)">?</text>
          </svg>
        </motion.div>

        {/* Error icon badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255,153,51,0.1)',
          color: 'var(--saffron)',
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '700',
          marginBottom: '20px'
        }}>
          <AlertTriangle size={14} />
          <span>ROUTE NOT FOUND</span>
        </div>

        <h1 style={{
          fontSize: '56px',
          fontWeight: '800',
          fontFamily: 'var(--font-display)',
          background: 'linear-gradient(135deg, #FF9933 0%, var(--emerald) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '8px',
          lineHeight: '1'
        }}>
          404
        </h1>

        <h2 style={{
          fontSize: '22px',
          fontWeight: '700',
          fontFamily: 'var(--font-display)',
          marginBottom: '12px'
        }}>
          Destination Unknown
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '14px',
          lineHeight: '1.6',
          marginBottom: '32px',
          maxWidth: '350px',
          margin: '0 auto 32px auto'
        }}>
          Looks like this cab took a wrong turn! The page you're looking for doesn't exist or has been moved to a new route.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={() => navigate('/')}
            className="glow-btn-saffron"
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Home size={16} />
            <span>Back to Hub</span>
          </button>

          <button
            onClick={() => navigate('/passenger')}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-display)',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border-color)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
          >
            <MapPin size={16} />
            <span>Book a Ride</span>
          </button>
        </div>
      </motion.div>

      {/* Footer text */}
      <p style={{
        marginTop: '32px',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        CabHub India • Premium Ride-Hailing Platform
      </p>
    </div>
  );
};

export default NotFound;
