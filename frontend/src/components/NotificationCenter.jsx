import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';

const iconMap = {
  success: <CheckCircle size={14} color="#16a34a" />,
  error: <XCircle size={14} color="#dc2626" />,
  warning: <AlertTriangle size={14} color="#d97706" />,
  info: <Info size={14} color="#2563eb" />,
};

const colorMap = {
  success: 'rgba(22,163,74,0.08)',
  error: 'rgba(220,38,38,0.08)',
  warning: 'rgba(217,119,6,0.08)',
  info: 'rgba(37,99,235,0.08)',
};

const NotificationCenter = () => {
  const { notifications, markAllNotificationsRead, clearNotifications } = useSimulation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if (!open && unreadCount > 0) {
      setTimeout(markAllNotificationsRead, 600);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        id="notification-bell-btn"
        onClick={handleOpen}
        title="Notifications"
        style={{
          position: 'relative',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-primary)',
          boxShadow: 'var(--card-shadow)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
        onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: '#E11D48',
            color: '#fff',
            fontSize: '10px',
            fontWeight: '800',
            borderRadius: '50%',
            width: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
            border: '2px solid var(--bg-primary)',
            animation: 'pulseGlow 2s infinite',
          }}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: '320px',
            maxHeight: '420px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '18px',
            boxShadow: '0 20px 50px -15px rgba(0,0,0,0.25)',
            zIndex: 1000,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 16px 12px',
            borderBottom: '1px solid var(--border-color)',
          }}>
            <h4 style={{ fontSize: '15px', fontFamily: 'var(--font-display)', fontWeight: '700' }}>
              Notifications
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: '8px',
                  background: '#E11D48',
                  color: '#fff',
                  fontSize: '10px',
                  fontWeight: '800',
                  borderRadius: '20px',
                  padding: '2px 7px',
                }}>
                  {unreadCount} new
                </span>
              )}
            </h4>
            <div style={{ display: 'flex', gap: '6px' }}>
              {notifications.length > 0 && (
                <>
                  <button
                    onClick={markAllNotificationsRead}
                    title="Mark all as read"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      borderRadius: '6px',
                    }}
                  >
                    <CheckCheck size={15} />
                  </button>
                  <button
                    onClick={clearNotifications}
                    title="Clear all"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#E11D48',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '4px',
                      borderRadius: '6px',
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </>
              )}
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px',
                  borderRadius: '6px',
                }}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px 20px',
                color: 'var(--text-muted)',
                gap: '10px',
              }}>
                <Bell size={32} opacity={0.3} />
                <p style={{ fontSize: '13px' }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--border-color)',
                    background: !notif.read ? colorMap[notif.type] || 'rgba(255,153,51,0.05)' : 'transparent',
                    transition: 'background 0.3s ease',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'flex-start',
                  }}
                >
                  <span style={{ marginTop: '1px', flexShrink: 0 }}>
                    {iconMap[notif.type] || iconMap.info}
                  </span>
                  <div style={{ flex: 1 }}>
                    <p style={{
                      fontSize: '13px',
                      lineHeight: '1.4',
                      color: 'var(--text-primary)',
                      fontWeight: !notif.read ? '600' : '400',
                    }}>
                      {notif.message}
                    </p>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '3px', display: 'block' }}>
                      {notif.date} · {notif.time}
                    </span>
                  </div>
                  {!notif.read && (
                    <span style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#FF9933',
                      flexShrink: 0,
                      marginTop: '4px',
                    }} />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
