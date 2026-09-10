import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { adminAPI } from '../utils/api';
import { ArrowLeft, Lock, Users, TrendingUp, Compass, Calendar, ShieldCheck, Check, RotateCcw, LogOut, AlertCircle, Tag, RefreshCw, X } from 'lucide-react';

const AdminPortal = () => {
  const navigate = useNavigate();
  const {
    admin,
    login,
    logout,
    activeRide,
    rideHistory,
    onlineDrivers,
    resetSimulator
  } = useSimulation();

  // Auth inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Active tab
  const [activeTab, setActiveTab] = useState('overview');

  // Backend state
  const [backendStats, setBackendStats] = useState(null);
  const [pendingDrivers, setPendingDrivers] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loadingSection, setLoadingSection] = useState('');

  // Coupon form
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [couponMin, setCouponMin] = useState('');
  const [couponMsg, setCouponMsg] = useState('');

  const fetchAdminData = useCallback(async () => {
    if (!admin) return;
    try {
      setLoadingSection('all');
      const [statsRes, driversRes, complaintsRes, couponsRes] = await Promise.allSettled([
        adminAPI.getStats(),
        adminAPI.getPendingDrivers(),
        adminAPI.getComplaints(),
        adminAPI.getCoupons()
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value?.success) {
        setBackendStats(statsRes.value.stats || statsRes.value);
      }
      if (driversRes.status === 'fulfilled' && driversRes.value?.drivers) {
        setPendingDrivers(driversRes.value.drivers);
      } else {
        // Simulation fallback
        setPendingDrivers([
          { _id: 'p_drv_1', name: 'Rahul Varma', city: 'New Delhi', vehicle: { model: 'Hyundai Aura', type: 'Sedan' }, verificationStatus: 'pending' },
          { _id: 'p_drv_2', name: 'Sanjay Nair', city: 'Mumbai', vehicle: { model: 'Maruti Ertiga', type: 'SUV' }, verificationStatus: 'pending' },
          { _id: 'p_drv_3', name: 'Kiran Gowda', city: 'Bengaluru', vehicle: { model: 'Suzuki Celerio', type: 'Mini' }, verificationStatus: 'pending' }
        ]);
      }
      if (complaintsRes.status === 'fulfilled' && complaintsRes.value?.complaints) {
        setComplaints(complaintsRes.value.complaints);
      }
      if (couponsRes.status === 'fulfilled' && couponsRes.value?.coupons) {
        setCoupons(couponsRes.value.coupons);
      }
    } catch (_) {
      console.warn('Admin data fetch failed');
    } finally {
      setLoadingSection('');
    }
  }, [admin]);

  useEffect(() => {
    if (admin) fetchAdminData();
  }, [admin, fetchAdminData]);

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const res = await login('admin', { email, password });
    if (!res.success) {
      setErrorMsg(res.message);
    }
  };

  const handleQuickLogin = () => {
    login('admin', { email: 'admin@cabhub.com', password: 'admin123' });
  };

  const handleVerifyDriver = async (id, action) => {
    try {
      await adminAPI.verifyDriver(id, action);
    } catch (_) {}
    setPendingDrivers(prev => prev.map(d => d._id === id ? { ...d, verificationStatus: action } : d));
  };

  const handleResolveComplaint = async (complaintId) => {
    try {
      await adminAPI.resolveComplaint(complaintId, 'Resolved by admin');
    } catch (_) {}
    setComplaints(prev => prev.map(c => c._id === complaintId ? { ...c, status: 'resolved' } : c));
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    setCouponMsg('');
    if (!couponCode || !couponDiscount) return;
    try {
      const res = await adminAPI.createCoupon({
        code: couponCode.toUpperCase(),
        discountAmount: parseFloat(couponDiscount),
        minFare: parseFloat(couponMin) || 0,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      if (res && res.success) {
        setCoupons(prev => [res.coupon, ...prev]);
        setCouponCode(''); setCouponDiscount(''); setCouponMin('');
        setCouponMsg('Coupon created successfully!');
      }
    } catch (_) {
      // Simulation fallback
      const mockCoupon = {
        _id: 'cpn_' + Math.random().toString(36).substring(2, 8),
        code: couponCode.toUpperCase(),
        discountAmount: parseFloat(couponDiscount),
        minFare: parseFloat(couponMin) || 0,
        isActive: true
      };
      setCoupons(prev => [mockCoupon, ...prev]);
      setCouponCode(''); setCouponDiscount(''); setCouponMin('');
      setCouponMsg('Coupon created (simulation mode)!');
    }
  };

  // Computes dashboard stats (local + backend merged)
  const stats = useMemo(() => {
    if (backendStats) return backendStats;
    const completedRides = rideHistory.filter(r => r.status === 'completed');
    const revenue = completedRides.reduce((sum, r) => sum + r.fare, 0);
    const cancelled = rideHistory.filter(r => r.status === 'cancelled').length;
    const totalDiscounts = completedRides.reduce((sum, r) => sum + (r.discount || 0), 0);
    return {
      revenue,
      completedCount: completedRides.length,
      activeCount: activeRide ? 1 : 0,
      cancelledCount: cancelled,
      totalDiscounts,
      totalUsers: onlineDrivers.length,
      totalDrivers: onlineDrivers.length
    };
  }, [rideHistory, activeRide, backendStats, onlineDrivers]);

  const logsFeed = useMemo(() => {
    const logs = [];
    rideHistory.forEach((ride) => {
      const timeStr = new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      if (ride.status === 'completed') {
        const promoText = ride.promoCode ? ` (Promo ${ride.promoCode}: -â‚¹${ride.discount})` : '';
        logs.push({ time: timeStr, text: `Trip ${ride.id?.slice(-6)} completed. â‚¹${ride.fare} paid${promoText}.`, type: 'success' });
      } else if (ride.status === 'cancelled') {
        logs.push({ time: timeStr, text: `Trip ${ride.id?.slice(-6)} by ${ride.passenger?.name} cancelled.`, type: 'danger' });
      }
    });
    if (activeRide) {
      const timeStr = new Date(activeRide.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      logs.push({ time: timeStr, text: `Active trip ${activeRide.id?.slice(-6)} â€” ${activeRide.status.toUpperCase()}.`, type: 'info' });
      if (activeRide.status === 'accepted') {
        logs.push({ time: timeStr, text: `Pilot ${activeRide.driver?.name} en-route for pickup.`, type: 'warning' });
      }
    }
    if (logs.length === 0) {
      logs.push({ time: 'System', text: 'CabHub dispatch console initialized. Fleet tracking active.', type: 'info' });
    }
    return logs.slice(0, 12);
  }, [rideHistory, activeRide]);

  const tabStyle = (tab) => ({
    padding: '8px 18px',
    borderRadius: '20px',
    border: 'none',
    background: activeTab === tab ? 'var(--saffron)' : 'var(--bg-tertiary)',
    color: activeTab === tab ? '#FFF' : 'var(--text-secondary)',
    fontFamily: 'var(--font-display)',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
    background: 'var(--input-bg)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    boxSizing: 'border-box'
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '20px 12px' }}>
      <div className="container-layout" style={{ maxWidth: '1080px' }}>
        {/* Top Navbar */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '600' }}>
            <ArrowLeft size={18} />
            <span>Portals</span>
          </button>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', fontWeight: '800' }}>
            CabHub <span style={{ color: 'var(--chakra)' }}>Operations Control</span>
          </h2>
          {admin && (
            <button onClick={() => logout('admin')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#E11D48', fontSize: '14px', fontWeight: '600' }}>
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </nav>

        {/* Login Card */}
        {!admin ? (
          <div className="glass-card animate-fade-in" style={{ maxWidth: '420px', margin: '80px auto 0 auto', padding: '32px 24px', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(0,0,128,0.15) 0%, rgba(15,23,42,0.15) 100%)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--chakra)' }}>
                <Lock size={30} />
              </div>
              <h3 style={{ fontSize: '22px' }}>Operations Sign In</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '4px' }}>Secure terminal for fleet monitoring & statistics</p>
            </div>
            {errorMsg && (
              <div style={{ background: 'rgba(225, 29, 72, 0.1)', border: '1px solid #E11D48', color: '#E11D48', borderRadius: '8px', padding: '10px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleAdminAuth} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>ADMIN EMAIL</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@cabhub.com" style={inputStyle} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>PASSWORD</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="admin123" style={inputStyle} />
              </div>
              <button type="submit" className="glow-btn-saffron" style={{ padding: '12px 0', fontSize: '15px', background: 'var(--chakra)', boxShadow: 'var(--chakra-glow) 0 8px 20px', marginTop: '8px' }}>
                Access Terminal
              </button>
            </form>
            <button onClick={handleQuickLogin} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'block', margin: '20px auto 0 auto', textDecoration: 'underline' }}>
              Autofill & Login (admin@cabhub.com)
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-fade-in">
            {/* Tab Bar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button style={tabStyle('overview')} onClick={() => setActiveTab('overview')}>Overview</button>
              <button style={tabStyle('drivers')} onClick={() => setActiveTab('drivers')}>Driver Verification</button>
              <button style={tabStyle('complaints')} onClick={() => setActiveTab('complaints')}>
                Complaints {complaints.filter(c => c.status !== 'resolved').length > 0 && `(${complaints.filter(c => c.status !== 'resolved').length})`}
              </button>
              <button style={tabStyle('coupons')} onClick={() => setActiveTab('coupons')}>Coupons</button>
              <button
                onClick={fetchAdminData}
                style={{ marginLeft: 'auto', background: 'none', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', borderRadius: '10px', padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
              >
                <RefreshCw size={13} />
                Refresh
              </button>
            </div>

            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                  {[
                    { label: 'TOTAL REVENUE', value: `â‚¹${stats.revenue?.toFixed?.(2) ?? stats.revenue ?? 0}`, icon: <TrendingUp size={22} />, color: 'var(--chakra)', bg: 'rgba(0,0,128,0.1)' },
                    { label: 'COMPLETED TRIPS', value: stats.completedCount ?? 0, icon: <Compass size={22} />, color: 'var(--emerald)', bg: 'rgba(19,136,8,0.1)' },
                    { label: 'ACTIVE TRIPS', value: stats.activeCount ?? stats.activeRides ?? (activeRide ? 1 : 0), icon: <Calendar size={22} />, color: 'var(--saffron)', bg: 'rgba(255,153,51,0.1)' },
                    { label: 'CANCELLED', value: stats.cancelledCount ?? stats.cancelledRides ?? 0, icon: <X size={22} />, color: '#EF4444', bg: 'rgba(239,68,68,0.1)' },
                    { label: 'ONLINE PILOTS', value: stats.totalDrivers ?? onlineDrivers.length, icon: <Users size={22} />, color: 'var(--text-secondary)', bg: 'var(--bg-tertiary)' },
                    { label: 'PLATFORM SUBSIDIES', value: `â‚¹${stats.totalDiscounts ?? 0}`, icon: <Tag size={22} />, color: '#F97316', bg: 'rgba(249,115,22,0.1)' },
                  ].map((s, i) => (
                    <div key={i} className="glass-card" style={{ padding: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ padding: '12px', borderRadius: '12px', background: s.bg, color: s.color }}>{s.icon}</div>
                      <div>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '600' }}>{s.label}</span>
                        <h3 style={{ fontSize: '22px', fontWeight: '800', marginTop: '2px' }}>{s.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Logs + Active fleet */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
                  <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Live Dispatch Logs</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-tertiary)', borderRadius: '12px', padding: '16px', fontFamily: 'monospace', fontSize: '12px', maxHeight: '320px', overflowY: 'auto' }}>
                      {logsFeed.map((log, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(0,0,0,0.04)', paddingBottom: '8px' }}>
                          <span style={{ color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>[{log.time}]</span>
                          <span style={{ color: log.type === 'success' ? 'var(--emerald)' : log.type === 'danger' ? '#E11D48' : log.type === 'warning' ? 'var(--saffron)' : 'var(--text-primary)' }}>{log.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {activeRide ? (
                    <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                      <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Fleet Monitor</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {[
                          { label: 'Ride ID', value: activeRide.id?.slice(-8) },
                          { label: 'Passenger', value: activeRide.passenger?.name },
                          { label: 'Pilot', value: activeRide.driver ? activeRide.driver.name : 'Searching...' },
                          { label: 'Route', value: `${activeRide.pickup?.name} â†’ ${activeRide.drop?.name}` },
                          { label: 'Fare', value: `â‚¹${activeRide.fare}` },
                          { label: 'Status', value: activeRide.status.toUpperCase(), highlight: true },
                        ].map((row, i) => (
                          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '8px 12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>{row.label}</span>
                            <strong style={{ color: row.highlight ? 'var(--saffron)' : 'var(--text-primary)' }}>{row.value}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px', color: 'var(--text-muted)' }}>
                      <Compass size={36} style={{ opacity: 0.3 }} />
                      <p style={{ fontSize: '14px' }}>No active trips at this moment</p>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                  <button onClick={resetSimulator} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <RotateCcw size={14} />
                    <span>Reset Simulation Database</span>
                  </button>
                </div>
              </>
            )}

            {/* DRIVER VERIFICATION TAB */}
            {activeTab === 'drivers' && (
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--chakra)" />
                  Pilot Verification Dashboard
                </h3>
                {pendingDrivers.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No pending driver applications.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {pendingDrivers.map((pilot, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                        <div>
                          <div style={{ fontWeight: '700', fontSize: '14px' }}>{pilot.name}</div>
                          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                            {pilot.vehicle?.model} ({pilot.vehicle?.type}) &bull; {pilot.city || pilot.email}
                          </span>
                        </div>
                        {pilot.verificationStatus === 'verified' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--emerald)', fontSize: '12px', fontWeight: '700', background: 'rgba(19,136,8,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                            <Check size={12} /> Verified
                          </span>
                        ) : pilot.verificationStatus === 'rejected' ? (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E11D48', fontSize: '12px', fontWeight: '700', background: 'rgba(225,29,72,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                            <X size={12} /> Rejected
                          </span>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleVerifyDriver(pilot._id, 'verified')} style={{ background: 'var(--chakra)', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                              Approve
                            </button>
                            <button onClick={() => handleVerifyDriver(pilot._id, 'rejected')} style={{ background: 'rgba(225,29,72,0.1)', color: '#E11D48', border: '1px solid #E11D48', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMPLAINTS TAB */}
            {activeTab === 'complaints' && (
              <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} color="#EF4444" />
                  Complaints Management
                </h3>
                {complaints.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No complaints filed yet.</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {complaints.map((c, idx) => (
                      <div key={idx} style={{ padding: '14px 18px', border: `1px solid ${c.status === 'resolved' ? 'var(--border-color)' : '#EF4444'}`, borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                          <div>
                            <div style={{ fontWeight: '700', fontSize: '13px', marginBottom: '4px' }}>
                              Ride: {c.ride?._id?.slice(-8) || c.rideId?.slice(-8) || 'N/A'}
                              <span style={{ marginLeft: '8px', fontSize: '11px', color: c.type === 'driver' ? 'var(--chakra)' : 'var(--saffron)', background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '20px' }}>
                                {c.type === 'driver' ? 'By Driver' : 'By Passenger'}
                              </span>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{c.description || c.text}</p>
                            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          {c.status === 'resolved' ? (
                            <span style={{ whiteSpace: 'nowrap', color: 'var(--emerald)', fontSize: '12px', fontWeight: '700', background: 'rgba(19,136,8,0.1)', padding: '4px 10px', borderRadius: '20px' }}>
                              <Check size={12} style={{ marginRight: '4px', verticalAlign: 'middle' }} />Resolved
                            </span>
                          ) : (
                            <button onClick={() => handleResolveComplaint(c._id)} style={{ whiteSpace: 'nowrap', background: 'var(--chakra)', color: '#FFF', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COUPONS TAB */}
            {activeTab === 'coupons' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
                {/* Create Coupon */}
                <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={18} color="var(--saffron)" />
                    Create Coupon
                  </h3>
                  <form onSubmit={handleCreateCoupon} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>COUPON CODE</label>
                      <input value={couponCode} onChange={e => setCouponCode(e.target.value)} placeholder="e.g. SAVE50" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>DISCOUNT AMOUNT (â‚¹)</label>
                      <input type="number" min="1" value={couponDiscount} onChange={e => setCouponDiscount(e.target.value)} placeholder="50" style={inputStyle} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '6px' }}>MINIMUM FARE (â‚¹)</label>
                      <input type="number" min="0" value={couponMin} onChange={e => setCouponMin(e.target.value)} placeholder="100" style={inputStyle} />
                    </div>
                    <button type="submit" className="glow-btn-saffron" style={{ padding: '10px 0', fontSize: '14px' }}>
                      Create Coupon
                    </button>
                    {couponMsg && <p style={{ fontSize: '13px', color: 'var(--emerald)', textAlign: 'center' }}>{couponMsg}</p>}
                  </form>
                </div>

                {/* Active Coupons List */}
                <div className="glass-card" style={{ padding: '24px', border: '1px solid var(--border-color)' }}>
                  <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Coupons</h3>
                  {coupons.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No coupons created yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '380px', overflowY: 'auto' }}>
                      {coupons.map((coupon, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-secondary)' }}>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '15px', fontFamily: 'monospace', color: 'var(--saffron)' }}>{coupon.code}</div>
                            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                              â‚¹{coupon.discountAmount} off â€¢ Min fare â‚¹{coupon.minFare || 0}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', background: coupon.isActive ? 'rgba(19,136,8,0.15)' : 'rgba(100,100,100,0.1)', color: coupon.isActive ? 'var(--emerald)' : 'var(--text-muted)', padding: '3px 10px', borderRadius: '20px', fontWeight: '700' }}>
                            {coupon.isActive ? 'Active' : 'Expired'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;
