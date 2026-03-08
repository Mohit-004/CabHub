import { motion, AnimatePresence } from 'framer-motion';
import {
    Power, Navigation, DollarSign, Clock, Star, Map as MapIcon,
    Bell, User, LogOut, ChevronRight, MapPin, Check, X, Shield, Activity, TrendingUp, Zap
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../socket';
import { useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';

const DriverDashboard = () => {
    const driver = JSON.parse(localStorage.getItem('driver') || '{}');
    const navigate = useNavigate();
    const [isOnDuty, setIsOnDuty] = useState(false);
    const [incomingRide, setIncomingRide] = useState(null);
    const [activeRide, setActiveRide] = useState(null);
    const [missionStatus, setMissionStatus] = useState('idle'); // 'idle', 'accepted', 'pickup', 'arrived', 'dropping', 'completed'

    // Mock Stats in INR
    const [stats, setStats] = useState({
        earnings: 12450.00,
        trips: 156,
        rating: 4.98,
        onlineHours: 42.5
    });

    useEffect(() => {
        socket.connect();

        // Update location periodically when on duty (Centered on Bangalore)
        const locationInterval = setInterval(() => {
            if (isOnDuty) {
                socket.emit('updateLocation', { driverId: driver._id, lat: 12.9716, lng: 77.5946 });
            }
        }, 5000);

        socket.on('newRideRequest', (data) => {
            if (isOnDuty && !activeRide) {
                setIncomingRide(data);
            }
        });

        return () => {
            clearInterval(locationInterval);
            socket.disconnect();
        };
    }, [isOnDuty, activeRide]);

    const handleAccept = () => {
        setActiveRide(incomingRide);
        setMissionStatus('accepted');
        setIncomingRide(null);
        socket.emit('rideAccepted', { rideId: incomingRide.id, driverId: driver._id });
    };

    const handleStatusUpdate = (nextStatus) => {
        setMissionStatus(nextStatus);
        if (nextStatus === 'completed') {
            setStats(prev => ({
                ...prev,
                trips: prev.trips + 1,
                earnings: prev.earnings + (activeRide?.fare || 250)
            }));
            setTimeout(() => {
                setActiveRide(null);
                setMissionStatus('idle');
            }, 3000);
        }
    };

    return (
        <div style={{ height: '100vh', width: '100vw', background: 'var(--bg-secondary)', overflow: 'hidden', display: 'flex' }}>

            {/* Vibrant Sidebar (Indian Theme) */}
            <motion.aside
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                style={{ width: '320px', margin: '24px', background: 'white', borderRadius: '32px', padding: '48px 32px', display: 'flex', flexDirection: 'column', gap: '48px', zIndex: 100, boxShadow: '0 20px 60px rgba(255, 153, 51, 0.05)' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '50px', height: '50px', background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-blue))', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 20px rgba(0, 0, 128, 0.2)' }}>
                        <Navigation color="white" size={26} fill="white" />
                    </div>
                    <span className="gradient-text-saffron" style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-1px' }}>BHARAT NAV</span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <SidebarLink icon={<Activity size={22} />} label="Command Center" active color="var(--accent-saffron)" onClick={() => navigate('/dashboard')} />
                    <SidebarLink icon={<TrendingUp size={22} />} label="Performance Hub" color="var(--accent-blue)" />
                    <SidebarLink icon={<DollarSign size={22} />} label="Treasury (Earnings)" color="var(--accent-green)" onClick={() => navigate('/history')} />
                    <SidebarLink icon={<Star size={22} />} label="Pilot Reputation" color="var(--accent-saffron)" onClick={() => navigate('/profile')} />
                </div>

                <div style={{ borderTop: '2px solid var(--bg-secondary)', paddingTop: '40px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '32px', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                        <div style={{ position: 'relative' }}>
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=India${driver.name}`} style={{ width: '60px', borderRadius: '20px', border: '3px solid #f8fafc' }} alt="pilot" />
                            <div style={{ position: 'absolute', bottom: '-4px', right: '-4px', width: '18px', height: '18px', background: isOnDuty ? 'var(--accent-green)' : 'var(--accent-danger)', borderRadius: '50%', border: '4px solid white' }}></div>
                        </div>
                        <div>
                            <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{driver.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--accent-green)', fontWeight: '900' }}>RANK: ELITE PILOT</div>
                        </div>
                    </div>
                    <button
                        onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
                        style={{ width: '100%', padding: '18px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '20px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', transition: 'all 0.3s ease' }}
                    >
                        <LogOut size={20} /> TERMINATE MISSION
                    </button>
                </div>
            </motion.aside>

            {/* Main Operational Surface */}
            <main style={{ flex: 1, padding: '24px 24px 24px 0', display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>

                {/* Tactical Stats (INR) */}
                <header style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                    <StatBox icon={<DollarSign color="var(--accent-green)" />} label="CREDITS EARNED" value={`₹${stats.earnings.toLocaleString('en-IN')}`} trend="+12% today" />
                    <StatBox icon={<Zap color="var(--accent-saffron)" />} label="TOTAL MISSIONS" value={stats.trips} trend="Rank 4 in Bengaluru" />
                    <StatBox icon={<Star color="var(--accent-saffron)" />} label="PILOT REPUTATION" value={stats.rating} trend="98.5% Success Rate" />
                    <StatBox icon={<Clock color="var(--accent-blue)" />} label="ACTIVE HORIZON" value={`${stats.onlineHours}h`} trend="+5h this week" />
                </header>

                {/* Map Interface & Tactical Panel */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 420px', gap: '24px' }}>
                    <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', border: 'none', boxShadow: '0 30px 60px rgba(0,0,0,0.05)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }}>
                            <MapComponent
                                driverCoords={[12.9716, 77.5946]}
                                pickupCoords={activeRide?.pickupCoords}
                                dropCoords={activeRide?.dropCoords}
                                activeMission={!!activeRide}
                            />
                        </div>

                        {/* Top HUD Controls */}
                        <div style={{ position: 'absolute', top: '32px', left: '32px', right: '32px', zIndex: 10, display: 'flex', justifyContent: 'space-between' }}>
                            <motion.div
                                className="glass-card"
                                style={{ padding: '12px 24px', background: 'white', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid var(--accent-saffron)' }}
                            >
                                <div className={isOnDuty ? "pulse-saffron" : ""} style={{ width: '12px', height: '12px', borderRadius: '50%', background: isOnDuty ? 'var(--accent-green)' : 'var(--accent-danger)' }}></div>
                                <span style={{ fontWeight: '900', fontSize: '0.9rem', letterSpacing: '1px', color: 'var(--text-main)' }}>{isOnDuty ? 'BHARAT HUB ONLINE' : 'SYSTEMS STANDBY'}</span>
                            </motion.div>

                            <button
                                onClick={() => setIsOnDuty(!isOnDuty)}
                                className="glass-card"
                                style={{
                                    padding: '16px 40px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                                    background: isOnDuty ? '#fef2f2' : '#f0fdf4',
                                    color: isOnDuty ? '#ef4444' : '#10b981',
                                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                                    fontWeight: '900'
                                }}
                            >
                                <Power size={22} />
                                <span style={{ letterSpacing: '1px' }}>
                                    {isOnDuty ? 'GO OFFLINE' : 'GO ONLINE'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Mission Intelligence Panel */}
                    <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none', display: 'flex', flexDirection: 'column', gap: '40px', boxShadow: '0 32px 64px rgba(255, 153, 51, 0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '1.85rem', fontWeight: '900', letterSpacing: '-1.2px' }}>Mission Intelligence</h3>
                            <Bell size={24} color="var(--accent-saffron)" style={{ cursor: 'pointer' }} />
                        </div>

                        {activeRide ? (
                            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ padding: '32px', background: '#f8fafc', borderRadius: '28px', borderLeft: '8px solid var(--accent-saffron)', marginBottom: '32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                        <div>
                                            <div style={{ color: 'var(--accent-saffron)', fontWeight: '900', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{missionStatus.toUpperCase()}</div>
                                            <h4 style={{ fontSize: '1.4rem', fontWeight: '900', marginTop: '4px' }}>Active Mission #{activeRide.id?.slice(-4) || '1947'}</h4>
                                        </div>
                                        <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-saffron)' }}>₹{activeRide.fare * 80 || '450'}</div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                                        <div style={{ position: 'absolute', left: '11px', top: '24px', bottom: '24px', width: '2px', borderLeft: '2px dashed #ddd' }}></div>
                                        <RideDetail icon={<div style={{ width: '24px', height: '24px', background: 'var(--accent-blue)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '900' }}>P</div>} label="PICKUP NODE" value={activeRide.pickup || "MG Road, Bengaluru Hub"} />
                                        <RideDetail icon={<MapPin size={24} color="#ef4444" />} label="DROP-OFF NODE" value={activeRide.drop || "Kempegowda Int'l Airport"} />
                                    </div>
                                </div>

                                <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {missionStatus === 'accepted' && (
                                        <button className="btn-primary" style={{ height: '72px', borderRadius: '24px', background: 'var(--accent-blue)', boxShadow: '0 12px 24px rgba(0, 0, 128, 0.2)' }} onClick={() => handleStatusUpdate('arrived')}>
                                            ARRIVED AT HUB
                                        </button>
                                    )}
                                    {missionStatus === 'arrived' && (
                                        <button className="btn-primary" style={{ height: '72px', borderRadius: '24px' }} onClick={() => handleStatusUpdate('dropping')}>
                                            START MISSION
                                        </button>
                                    )}
                                    {missionStatus === 'dropping' && (
                                        <button className="btn-primary" style={{ height: '72px', borderRadius: '24px', background: 'var(--accent-green)', boxShadow: '0 12px 24px rgba(19, 136, 8, 0.2)' }} onClick={() => handleStatusUpdate('completed')}>
                                            COMPLETE MISSION
                                        </button>
                                    )}
                                    {missionStatus === 'completed' && (
                                        <div style={{ textAlign: 'center', padding: '24px', background: '#f0fdf4', borderRadius: '24px', color: '#10b981', fontWeight: '900' }}>
                                            <Check size={32} style={{ marginBottom: '8px' }} /> <br />
                                            MISSION SUCCESSFUL
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', gap: '32px' }}>
                                <div className="pulse-saffron" style={{ padding: '48px', background: '#f8fafc', borderRadius: '50%' }}>
                                    <Zap size={64} style={{ color: isOnDuty ? 'var(--accent-saffron)' : '#ddd', opacity: 0.8 }} />
                                </div>
                                <div style={{ padding: '0 20px' }}>
                                    <p style={{ fontWeight: '900', fontSize: '1.3rem', color: 'var(--text-main)' }}>Pilot on Standby</p>
                                    <p style={{ color: 'var(--text-muted)', marginTop: '8px', lineHeight: '1.6', fontWeight: '600' }}>
                                        {isOnDuty ? "Broadcasting signal across Bengaluru. Ready for the next mission." : "Currently offline. Please enable systems to join the elite Indian fleet."}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Tactical Mission Alert (Modal) */}
            <AnimatePresence>
                {incomingRide && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }}
                            className="glass-card"
                            style={{ width: '540px', padding: '56px', textAlign: 'center', background: 'white', border: 'none', boxShadow: '0 50px 100px rgba(255, 153, 51, 0.25)' }}
                        >
                            <div className="pulse-saffron" style={{ width: '110px', height: '110px', background: 'var(--accent-saffron)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', transform: 'rotate(10deg)' }}>
                                <Bell size={48} color="white" />
                            </div>
                            <h2 style={{ fontSize: '2.6rem', fontWeight: '900', marginBottom: '12px', letterSpacing: '-1.5px' }}>Mission Alert!</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.15rem', marginBottom: '48px', fontWeight: '700' }}>A passenger signal has been intercepted at 1.4km.</p>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div style={{ padding: '24px', background: '#fff9f5', borderRadius: '24px', textAlign: 'left', border: '1px solid rgba(255, 153, 51, 0.1)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1.5px' }}>POTENTIAL PAYOUT</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--accent-green)', marginTop: '4px' }}>₹650</div>
                                </div>
                                <div style={{ padding: '24px', background: '#fff9f5', borderRadius: '24px', textAlign: 'left', border: '1px solid rgba(255, 153, 51, 0.1)' }}>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1.5px' }}>TRAVEL DISTANCE</div>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', marginTop: '4px' }}>12.4km</div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '20px', marginTop: '48px' }}>
                                <button
                                    onClick={() => setIncomingRide(null)}
                                    style={{ flex: 1, height: '64px', borderRadius: '20px', background: '#f8fafc', border: '2px solid #eee', color: 'var(--text-muted)', fontWeight: '900', cursor: 'pointer' }}>
                                    REJECT
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="btn-primary"
                                    style={{ flex: 2, height: '64px' }}>
                                    ACCEPT MISSION
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .pulse-saffron {
                    animation: pulse-sd 2.5s infinite;
                }
                @keyframes pulse-sd {
                    0% { box-shadow: 0 0 0 0px rgba(255, 153, 51, 0.5); }
                    100% { box-shadow: 0 0 0 30px rgba(255, 153, 51, 0); }
                }
                .gradient-text-saffron {
                    background: linear-gradient(135deg, #FF9933, #d97706);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </div>
    );
};

const SidebarLink = ({ icon, label, active, color = 'var(--accent-saffron)', onClick }) => (
    <div style={{
        display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '20px', cursor: 'pointer',
        background: active ? `${color}08` : 'transparent',
        color: active ? color : 'var(--text-muted)',
        transition: 'all 0.3s ease'
    }}
        onClick={onClick}
        onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f8fafc' }}
        onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
        <div style={{ color: active ? color : 'var(--text-muted)' }}>{icon}</div>
        <span style={{ fontWeight: '900', fontSize: '1rem' }}>{label}</span>
    </div>
);

const StatBox = ({ icon, label, value, trend }) => (
    <div className="glass-card" style={{ padding: '32px', display: 'flex', alignItems: 'center', gap: '24px', background: 'white', border: 'none' }}>
        <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '20px' }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '4px', letterSpacing: '1.5px' }}>{label}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: '900' }}>{value}</div>
            <div style={{ fontSize: '0.75rem', color: trend.includes('+') ? 'var(--accent-green)' : 'var(--accent-saffron)', fontWeight: '900', marginTop: '4px' }}>{trend}</div>
        </div>
    </div>
);

const RideDetail = ({ icon, label, value }) => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        <div style={{ zIndex: 2 }}>{icon}</div>
        <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', marginBottom: '4px', letterSpacing: '1px' }}>{label}</div>
            <div style={{ fontWeight: '900', fontSize: '1rem' }}>{value}</div>
        </div>
    </div>
);

export default DriverDashboard;
