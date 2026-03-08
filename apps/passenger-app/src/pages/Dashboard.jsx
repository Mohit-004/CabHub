import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Car, Menu, History, User, LogOut, Search, X, ChevronRight, Clock, ShieldCheck, CreditCard, Star, Zap, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import MapComponent from '../components/MapComponent';

const Dashboard = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [rideStatus, setRideStatus] = useState('idle');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // UI States
    const [showBookingSheet, setShowBookingSheet] = useState(false);

    // Booking States
    const [pickup, setPickup] = useState(null);
    const [drop, setDrop] = useState(null);
    const [mode, setMode] = useState('pickup'); // 'pickup' or 'drop'
    const [pickupAddress, setPickupAddress] = useState('');
    const [dropAddress, setDropAddress] = useState('');
    const [estimates, setEstimates] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [loading, setLoading] = useState(false);
    const [nearbyDrivers, setNearbyDrivers] = useState([]);

    useEffect(() => {
        socket.connect();

        // Simulate real-time movement of nearby pilots around Bangalore
        const interval = setInterval(() => {
            const drivers = [];
            for (let i = 0; i < 6; i++) {
                drivers.push({
                    id: i,
                    lat: 12.9716 + (Math.random() - 0.5) * 0.04,
                    lng: 77.5946 + (Math.random() - 0.5) * 0.04
                });
            }
            setNearbyDrivers(drivers);
        }, 5000);

        socket.on('rideStatusUpdate', (data) => {
            setRideStatus(data.status);
            if (data.status === 'accepted') setShowBookingSheet(false);
        });

        return () => {
            clearInterval(interval);
            socket.off('rideStatusUpdate');
            socket.disconnect();
        };
    }, []);

    const handlePickupSelect = (latlng) => {
        setPickup(latlng);
        setPickupAddress(`Point at (${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)})`);
        setMode('drop');
    };

    const handleDropSelect = (latlng) => {
        setDrop(latlng);
        setDropAddress(`Destination at (${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)})`);
        fetchEstimates(latlng);
    };

    const fetchEstimates = async (dropLatLng) => {
        if (!pickup) return;
        setLoading(true);
        setShowBookingSheet(true);
        try {
            const dist = Math.sqrt(Math.pow(dropLatLng.lat - pickup.lat, 2) + Math.pow(dropLatLng.lng - pickup.lng, 2)) * 111;
            const res = await axios.post('/api/rides/estimate', { distance: dist }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            // Enriching estimates with vibrant Indian colors
            const enrichedEstimates = res.data.map((est, idx) => ({
                ...est,
                color: idx === 0 ? 'var(--accent-saffron)' : idx === 1 ? 'var(--accent-green)' : 'var(--accent-blue)',
                icon: idx === 0 ? <Zap size={22} color="white" /> : idx === 1 ? <ShieldCheck size={22} color="white" /> : <Star size={22} color="white" />
            }));
            setEstimates(enrichedEstimates);
            setSelectedType(enrichedEstimates[0]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBooking = async () => {
        if (!selectedType) return;
        setLoading(true);
        alert(`Requesting ${selectedType.type} - Connecting to BharatPay Gateway...`);
        setRideStatus('searching');
        setLoading(false);
    };

    const resetSelection = () => {
        setPickup(null);
        setDrop(null);
        setPickupAddress('');
        setDropAddress('');
        setMode('pickup');
        setShowBookingSheet(false);
        setRideStatus('idle');
    };

    return (
        <div style={{ height: '100vh', width: '100vw', background: 'var(--bg-secondary)', overflow: 'hidden', position: 'relative' }}>

            {/* Background Map */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                <MapComponent
                    pickup={pickup}
                    drop={drop}
                    onPickupSelect={handlePickupSelect}
                    onDropSelect={handleDropSelect}
                    mode={mode}
                    nearbyDrivers={nearbyDrivers}
                />
            </div>

            {/* Top Command Bar */}
            <div style={{ position: 'absolute', top: '32px', left: '32px', right: '32px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsMenuOpen(true)}
                    className="glass-card"
                    style={{
                        width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        border: 'none', cursor: 'pointer', background: 'white'
                    }}
                >
                    <Menu color="var(--text-main)" size={28} />
                </motion.button>

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card"
                    style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '16px', background: 'white', border: '1px solid var(--accent-saffron)' }}
                >
                    <div className="pulse-saffron" style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--accent-saffron)' }}></div>
                    <span style={{ fontSize: '1rem', fontWeight: '900', letterSpacing: '0.5px', color: 'var(--accent-saffron)' }}>BHARAT HUB ACTIVE</span>
                </motion.div>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="glass-card"
                    style={{ width: '64px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0', background: 'white', overflow: 'hidden' }}
                >
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=India${user.name}`} style={{ width: '50px' }} alt="profile" />
                </motion.button>
            </div>

            {/* Vibrant Search Hub (Floating) */}
            <AnimatePresence>
                {!showBookingSheet && rideStatus === 'idle' && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        style={{ position: 'absolute', bottom: '48px', left: '32px', right: '32px', zIndex: 10 }}
                    >
                        <div className="glass-card" style={{ padding: '40px', maxWidth: '850px', margin: '0 auto', background: 'white', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '1.85rem', fontWeight: '900', letterSpacing: '-1.2px' }}>Namaste {user.name}, where to?</h2>
                                {(pickup || drop) && <Trash2 size={20} color="var(--accent-danger)" style={{ cursor: 'pointer' }} onClick={resetSelection} />}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)', alignItems: 'center', gap: '24px' }}>
                                <div
                                    onClick={() => setMode('pickup')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '20px', padding: '24px',
                                        background: mode === 'pickup' ? 'rgba(255, 153, 51, 0.08)' : '#f8fafc',
                                        borderRadius: '20px', border: mode === 'pickup' ? '2px solid var(--accent-saffron)' : '1px solid transparent',
                                        cursor: 'pointer', transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ background: 'var(--accent-saffron)', padding: '12px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(255, 153, 51, 0.25)' }}>
                                        <MapPin size={22} color="white" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '4px', letterSpacing: '1px' }}>PICKUP POINT</div>
                                        <div style={{ fontSize: '1rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {pickupAddress || 'Detecting street...'}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                                    {[1, 2, 3].map(i => <div key={i} style={{ width: '4px', height: '4px', background: 'var(--border-light)', borderRadius: '50%' }}></div>)}
                                </div>

                                <div
                                    onClick={() => setMode('drop')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '20px', padding: '24px',
                                        background: mode === 'drop' ? 'rgba(0, 0, 128, 0.08)' : '#f8fafc',
                                        borderRadius: '20px', border: mode === 'drop' ? '2px solid var(--accent-blue)' : '1px solid transparent',
                                        cursor: 'pointer', transition: 'all 0.3s ease'
                                    }}
                                >
                                    <div style={{ background: 'var(--accent-blue)', padding: '12px', borderRadius: '12px', boxShadow: '0 8px 16px rgba(0, 0, 128, 0.25)' }}>
                                        <Navigation size={22} color="white" />
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '4px', letterSpacing: '1px' }}>WHERE TO?</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '800', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: dropAddress ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                            {dropAddress || 'Search Bangalore hubs...'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Live Signal Banner */}
            {rideStatus !== 'idle' && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 32 }}
                    style={{ position: 'absolute', top: '90px', left: '50%', transform: 'translateX(-50%)', zIndex: 10 }}
                >
                    <div className="glass-card" style={{ padding: '16px 40px', background: 'white', border: '2px solid var(--accent-saffron)', display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div className="pulse-saffron" style={{ width: '14px', height: '14px', background: 'var(--accent-saffron)', borderRadius: '50%' }}></div>
                        <span style={{ fontWeight: '900', fontSize: '1.1rem', letterSpacing: '1px' }}>
                            {rideStatus === 'searching' ? 'BROADCASTING TO NEARBY PILOTS...' : 'PILOT ASSIGNED. ARRIVING AT HUB.'}
                        </span>
                        <X size={20} style={{ cursor: 'pointer', marginLeft: '20px' }} onClick={resetSelection} />
                    </div>
                </motion.div>
            )}

            {/* Multi-Color Booking Panel (Slide Up) */}
            <AnimatePresence>
                {showBookingSheet && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowBookingSheet(false)}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', zIndex: 15, backdropFilter: 'blur(2px)' }}
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, maxHeight: '90vh' }}
                        >
                            <div className="glass-card" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, border: 'none', padding: '40px', display: 'flex', flexDirection: 'column', gap: '32px', background: 'white' }}>
                                <div style={{ width: '60px', height: '6px', background: '#e2e8f0', borderRadius: '3px', margin: '0 auto', marginBottom: '8px' }}></div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1.5px' }}>Incredible Rides</h3>
                                    <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '50%', cursor: 'pointer' }} onClick={() => setShowBookingSheet(false)}>
                                        <X size={24} color="var(--text-muted)" />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                                    {estimates.map((est) => (
                                        <motion.div
                                            key={est.type}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setSelectedType(est)}
                                            style={{
                                                padding: '32px 24px', borderRadius: '28px', border: selectedType?.type === est.type ? `3.5px solid ${est.color}` : '2px solid #f1f5f9',
                                                background: selectedType?.type === est.type ? `${est.color}08` : 'white',
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', cursor: 'pointer', textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ width: '64px', height: '64px', background: est.color, borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 12px 24px ${est.color}33` }}>
                                                {est.icon}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: '900', fontSize: '1.25rem' }}>{est.type}</div>
                                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '900', marginTop: '4px' }}>{est.eta} MINS ETA</div>
                                            </div>
                                            <div style={{ fontWeight: '900', fontSize: '1.6rem', marginTop: '8px', color: est.color }}>₹{est.fare * 80}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '20px' }}>
                                    <div className="glass-card" style={{ flex: 1, padding: '20px 24px', background: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                            <CreditCard size={22} color="var(--accent-saffron)" />
                                            <div>
                                                <div style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)' }}>BHARATPAY METHOD</div>
                                                <div style={{ fontWeight: '800', fontSize: '0.95rem' }}>Personal Wallet • ₹4,920</div>
                                            </div>
                                        </div>
                                        <ChevronRight size={18} color="var(--text-muted)" />
                                    </div>
                                    <button
                                        className="btn-primary"
                                        style={{ height: '72px', flex: 1.5, fontSize: '1.25rem', borderRadius: '24px' }}
                                        onClick={handleBooking}
                                        disabled={loading || !selectedType}
                                    >
                                        {loading ? 'Processing...' : `Confirm ${selectedType?.type || 'Booking'}`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Multi-Color Sidebar Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.1)', zIndex: 100, backdropFilter: 'blur(10px)' }}
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
                            style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '360px', background: 'white', zIndex: 101, padding: '60px 40px', display: 'flex', flexDirection: 'column' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '64px' }}>
                                <div style={{ position: 'relative' }}>
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=India${user.name}`} style={{ width: '80px', height: '80px', borderRadius: '28px', border: '4px solid #f1f5f9' }} alt="profile" />
                                    <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--accent-green)', width: '24px', height: '24px', borderRadius: '50%', border: '4px solid white' }}></div>
                                </div>
                                <div>
                                    <div style={{ fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>{user.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-saffron)', fontWeight: '900' }}>PLATINUM MEMBER</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <MenuLink icon={<Navigation size={22} />} label="Vibrant Booking" active color="var(--accent-saffron)" onClick={() => { setIsMenuOpen(false); setRideStatus('idle'); }} />
                                <MenuLink icon={<History size={22} />} label="Journey Log" color="var(--accent-blue)" onClick={() => window.location.href = '/history'} />
                                <MenuLink icon={<User size={22} />} label="Identity Hub" color="var(--accent-green)" onClick={() => window.location.href = '/profile'} />
                                <MenuLink icon={<ShieldCheck size={22} />} label="Security Protocol" color="var(--accent-danger)" />
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <button
                                    onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#fef2f2', border: 'none', borderRadius: '20px', color: '#ef4444', fontWeight: '900', cursor: 'pointer', transition: 'all 0.3s ease' }}
                                    onMouseEnter={e => e.target.style.background = '#fee2e2'}
                                    onMouseLeave={e => e.target.style.background = '#fef2f2'}
                                >
                                    <LogOut size={22} /> TERMINATE SESSION
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* UI Effects */}
            <style>{`
                .pulse-saffron {
                    animation: pulse-sa 2s infinite;
                }
                @keyframes pulse-sa {
                    0% { box-shadow: 0 0 0 0px rgba(255, 153, 51, 0.4); }
                    100% { box-shadow: 0 0 0 20px rgba(255, 153, 51, 0); }
                }
            `}</style>
        </div>
    );
};

const MenuLink = ({ icon, label, onClick, color, active }) => (
    <div
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '20px', cursor: 'pointer',
            transition: 'all 0.3s ease',
            background: active ? `${color}08` : 'transparent',
            color: active ? color : 'var(--text-main)'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = `${color}08`; e.currentTarget.style.color = color; }}
        onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-main)'; } }}
    >
        <div style={{ color: active ? color : 'var(--text-muted)', transition: 'color 0.3s' }}>{icon}</div>
        <span style={{ fontWeight: '900', fontSize: '1.05rem', letterSpacing: '-0.2px' }}>{label}</span>
    </div>
);

export default Dashboard;
