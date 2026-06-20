import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Clock, Route, Car, User, Star, Download, IndianRupee, Receipt, Shield } from 'lucide-react';

const RideReceipt = ({ ride, isOpen, onClose }) => {
  const receiptRef = useRef(null);

  if (!ride) return null;

  const tripDate = new Date(ride.createdAt);
  const formattedDate = tripDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedTime = tripDate.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Fare breakdown simulation
  const baseFare = Math.round(ride.fare * 0.25);
  const distanceCharge = Math.round(ride.fare * 0.55);
  const platformFee = Math.round(ride.fare * 0.08);
  const gst = Math.round(ride.fare * 0.12);
  const total = ride.fare;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9998,
            padding: '20px'
          }}
          onClick={onClose}
        >
          <motion.div
            ref={receiptRef}
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 30 }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'var(--bg-secondary)',
              borderRadius: '24px',
              width: '100%',
              maxWidth: '420px',
              maxHeight: '90vh',
              overflowY: 'auto',
              border: '1px solid var(--border-color)',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '24px 24px 20px',
              background: 'linear-gradient(135deg, rgba(255,153,51,0.08) 0%, rgba(19,136,8,0.08) 100%)',
              borderBottom: '1px solid var(--border-color)',
              borderRadius: '24px 24px 0 0',
              position: 'relative'
            }}>
              <button
                onClick={onClose}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'var(--bg-tertiary)',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #FF9933 0%, #FF5500 100%)',
                  padding: '10px',
                  borderRadius: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'var(--saffron-glow) 0px 6px 16px'
                }}>
                  <Receipt size={22} color="#FFF" />
                </div>
                <div>
                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-display)',
                    margin: 0
                  }}>
                    Ride Receipt
                  </h3>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    #{ride.id}
                  </span>
                </div>
              </div>

              <div style={{
                display: 'flex',
                gap: '16px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={12} /> {formattedTime}
                </span>
                <span>{formattedDate}</span>
              </div>
            </div>

            {/* Trip Route */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', gap: '12px', position: 'relative' }}>
                {/* Vertical connector line */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  flexShrink: 0
                }}>
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: 'var(--emerald)',
                    border: '2px solid rgba(19,136,8,0.3)'
                  }} />
                  <div style={{
                    width: '2px',
                    flexGrow: 1,
                    background: 'linear-gradient(180deg, var(--emerald), #E11D48)',
                    minHeight: '30px',
                    borderRadius: '2px'
                  }} />
                  <div style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: '#E11D48',
                    border: '2px solid rgba(225,29,72,0.3)'
                  }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                  <div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: 'var(--emerald)',
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '2px'
                    }}>PICKUP</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {ride.pickup.name}
                    </span>
                  </div>
                  <div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: '700',
                      color: '#E11D48',
                      letterSpacing: '0.05em',
                      display: 'block',
                      marginBottom: '2px'
                    }}>DROPOFF</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>
                      {ride.drop.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                marginTop: '20px',
                background: 'var(--bg-tertiary)',
                borderRadius: '14px',
                padding: '14px'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Route size={14} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>{ride.distance} km</div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Distance</span>
                </div>
                <div style={{ textAlign: 'center', borderLeft: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)' }}>
                  <Clock size={14} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>{ride.duration} min</div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Duration</span>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <Car size={14} color="var(--text-muted)" style={{ margin: '0 auto 4px' }} />
                  <div style={{ fontSize: '15px', fontWeight: '800' }}>{ride.vehicleType}</div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Category</span>
                </div>
              </div>
            </div>

            {/* Driver Info */}
            {ride.driver && (
              <div style={{
                padding: '16px 24px',
                borderBottom: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, rgba(19,136,8,0.15) 0%, rgba(0,0,128,0.15) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--emerald)'
                  }}>
                    <User size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '700', fontSize: '14px' }}>{ride.driver.name}</div>
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                      {ride.driver.vehicle?.model} • {ride.driver.vehicle?.number}
                    </span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: 'rgba(255,199,0,0.1)',
                  padding: '4px 10px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '700'
                }}>
                  <Star size={14} fill="#FFC700" color="#FFC700" />
                  <span>{ride.driver.rating}</span>
                </div>
              </div>
            )}

            {/* Fare Breakdown */}
            <div style={{ padding: '20px 24px' }}>
              <h4 style={{
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                letterSpacing: '0.04em',
                marginBottom: '14px'
              }}>
                FARE BREAKDOWN
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Base Fare</span>
                  <span style={{ fontWeight: '600' }}>₹{baseFare}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Distance Charge ({ride.distance} km)</span>
                  <span style={{ fontWeight: '600' }}>₹{distanceCharge}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Platform Fee</span>
                  <span style={{ fontWeight: '600' }}>₹{platformFee}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>GST (18%)</span>
                  <span style={{ fontWeight: '600' }}>₹{gst}</span>
                </div>

                {/* Divider */}
                <div style={{
                  borderTop: '2px dashed var(--border-color)',
                  margin: '6px 0'
                }} />

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 14px',
                  background: 'linear-gradient(135deg, rgba(255,153,51,0.08) 0%, rgba(19,136,8,0.08) 100%)',
                  borderRadius: '12px'
                }}>
                  <span style={{ fontSize: '15px', fontWeight: '700' }}>Total Paid</span>
                  <span style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    fontFamily: 'var(--font-display)',
                    background: 'linear-gradient(135deg, #FF9933 0%, var(--emerald) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    ₹{total}
                  </span>
                </div>
              </div>

              {/* Payment method */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '16px',
                padding: '10px 14px',
                background: 'var(--bg-tertiary)',
                borderRadius: '10px',
                fontSize: '12px',
                color: 'var(--text-secondary)'
              }}>
                <IndianRupee size={14} />
                <span>Paid via <strong>CabHub Wallet</strong></span>
                <span style={{ marginLeft: 'auto' }}>
                  <Shield size={12} color="var(--emerald)" style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                  Secured
                </span>
              </div>
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}>
                CabHub © 2026 • India
              </span>

              <button
                onClick={onClose}
                className="glow-btn-saffron"
                style={{
                  padding: '8px 20px',
                  fontSize: '13px'
                }}
              >
                Close Receipt
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RideReceipt;
