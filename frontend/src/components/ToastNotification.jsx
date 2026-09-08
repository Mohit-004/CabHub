import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

const TOAST_ICONS = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info
};

const TOAST_COLORS = {
  success: { bg: 'rgba(19,136,8,0.12)', border: 'var(--emerald)', icon: 'var(--emerald)' },
  error: { bg: 'rgba(225,29,72,0.12)', border: '#E11D48', icon: '#E11D48' },
  warning: { bg: 'rgba(255,153,51,0.12)', border: 'var(--saffron)', icon: 'var(--saffron)' },
  info: { bg: 'rgba(0,0,128,0.12)', border: 'var(--chakra)', icon: 'var(--chakra)' }
};

const Toast = ({ id, message, type = 'info', onDismiss }) => {
  const Icon = TOAST_ICONS[type] || Info;
  const colors = TOAST_COLORS[type] || TOAST_COLORS.info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 80, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.85 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 18px',
        borderRadius: '14px',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: `1px solid ${colors.border}`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.12), inset 0 0 0 1px ${colors.bg}`,
        minWidth: '280px',
        maxWidth: '400px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={() => onDismiss(id)}
    >
      {/* Accent bar */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '4px',
        background: colors.border,
        borderRadius: '14px 0 0 14px'
      }} />

      <div style={{
        padding: '6px',
        borderRadius: '10px',
        background: colors.bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginLeft: '4px'
      }}>
        <Icon size={18} color={colors.icon} />
      </div>

      <span style={{
        fontSize: '13px',
        fontWeight: '500',
        color: 'var(--text-primary)',
        lineHeight: '1.4',
        flexGrow: 1
      }}>
        {message}
      </span>

      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(id); }}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-muted)',
          padding: '4px',
          borderRadius: '6px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <X size={14} />
      </button>

      {/* Auto-dismiss progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 4, ease: 'linear' }}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: colors.border,
          transformOrigin: 'left',
          opacity: 0.5
        }}
      />
    </motion.div>
  );
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        pointerEvents: 'none'
      }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(toast => (
            <div key={toast.id} style={{ pointerEvents: 'auto' }}>
              <Toast
                id={toast.id}
                message={toast.message}
                type={toast.type}
                onDismiss={dismissToast}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
