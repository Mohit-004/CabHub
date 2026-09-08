import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = ({ isLoading = true }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: '32px'
      }}
    >
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,153,51,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Animated Logo */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        style={{ position: 'relative' }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: '-20px',
            left: '-20px',
            right: '-20px',
            bottom: '-20px',
            borderRadius: '50%',
            border: '2px solid transparent',
            borderTopColor: 'var(--saffron)',
            borderRightColor: 'rgba(255,153,51,0.3)',
            opacity: 0.6
          }}
        />

        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            top: '-32px',
            left: '-32px',
            right: '-32px',
            bottom: '-32px',
            borderRadius: '50%',
            border: '1px solid transparent',
            borderBottomColor: 'var(--emerald)',
            borderLeftColor: 'rgba(19,136,8,0.2)',
            opacity: 0.4
          }}
        />

        <div style={{
          background: 'linear-gradient(135deg, #FF9933 0%, #FF5500 100%)',
          padding: '20px',
          borderRadius: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 12px 40px rgba(255,153,51,0.3)',
          position: 'relative'
        }}>
          {/* Car icon SVG */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '36px',
          fontWeight: '800',
          background: 'linear-gradient(135deg, #FF9933 0%, var(--emerald) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          letterSpacing: '-0.03em',
          marginBottom: '4px'
        }}>
          CabHub
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-muted)',
          fontWeight: '500',
          letterSpacing: '0.06em'
        }}>
          PREMIUM RIDE-HAILING • INDIA
        </p>
      </motion.div>

      {/* Loading pulse dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{ display: 'flex', gap: '8px' }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut'
            }}
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: 'var(--saffron)'
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default SplashScreen;
