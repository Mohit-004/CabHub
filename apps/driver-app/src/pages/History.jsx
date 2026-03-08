import { motion } from 'framer-motion';
import { Clock, MapPin, ChevronRight, Navigation, ArrowLeft, Calendar, DollarSign, Star, CheckCircle, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/rides/history/driver', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setMissions(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchHistory();
    }, []);

    return (
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', color: 'var(--text-main)', padding: '60px 80px' }}>
            {/* Mission Log Header */}
            <header style={{ display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '80px' }}>
                <motion.button
                    whileHover={{ scale: 1.1, background: 'white' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => navigate('/dashboard')}
                    className="glass-card"
                    style={{ width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px solid var(--border-light)', background: 'white' }}
                >
                    <ArrowLeft size={24} color="var(--text-main)" />
                </motion.button>
                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1.5px' }}>Mission Archive</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '800' }}>Chronicle of your elite urban tactical deployments.</p>
                </div>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                    <div className="pulse-saffron" style={{ width: '50px', height: '50px', background: 'var(--accent-saffron)', borderRadius: '50%' }}></div>
                </div>
            ) : missions.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <div className="glass-card" style={{ display: 'inline-block', padding: '80px', background: 'white', border: 'none', boxShadow: '0 32px 64px rgba(255, 153, 51, 0.05)' }}>
                        <div style={{ width: '120px', height: '120px', background: '#f8fafc', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px' }}>
                            <Navigation size={64} color="#ddd" />
                        </div>
                        <h3 style={{ fontSize: '1.7rem', fontWeight: '900', letterSpacing: '-0.5px' }}>No Missions Deployed</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px', fontWeight: '700' }}>Initialize your systems and complete your first Bharat mission.</p>
                        <button className="btn-primary" style={{ marginTop: '40px', padding: '16px 40px' }} onClick={() => navigate('/dashboard')}>GO TO COMMAND CENTER</button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))', gap: '32px' }}>
                    {missions.map((mission, index) => (
                        <motion.div
                            key={mission._id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card"
                            style={{ padding: '40px', position: 'relative', overflow: 'hidden', background: 'white', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.02)' }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, var(--accent-saffron), var(--accent-blue))' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ padding: '16px', background: '#fff9f5', borderRadius: '16px' }}>
                                        <Calendar size={24} color="var(--accent-saffron)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '900', fontSize: '1.25rem' }}>{new Date(mission.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '800' }}>DEPLOYED @ {new Date(mission.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.9rem', fontWeight: '900', color: 'var(--accent-green)' }}>₹{mission.fare * 80 || 350}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '6px' }}>
                                        <Zap size={12} fill="var(--accent-blue)" style={{ marginRight: '6px' }} /> COMPLETED
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '13px', top: '28px', bottom: '28px', width: '2px', borderLeft: '2px dashed var(--border-light)' }}></div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 8px 16px rgba(0, 0, 128, 0.15)' }}>
                                        <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '700' }}>{mission.pickupLocation.address}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 8px 16px rgba(239, 68, 68, 0.15)' }}>
                                        <MapPin size={16} color="white" />
                                    </div>
                                    <p style={{ fontSize: '1.15rem', fontWeight: '900' }}>{mission.dropLocation.address}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '2px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Star size={18} color="#fbbf24" fill="#fbbf24" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)' }}>Rated 4.9 • Mission Accomplished</span>
                                </div>
                                <button
                                    style={{ background: '#f8fafc', border: 'none', color: 'var(--text-main)', padding: '10px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.85rem' }}
                                >
                                    LOG DETAILS <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style>{`
                .pulse-saffron {
                    animation: pulse-s 2s infinite;
                }
                @keyframes pulse-s {
                    0% { box-shadow: 0 0 0 0px rgba(255, 153, 51, 0.4); }
                    100% { box-shadow: 0 0 0 20px rgba(255, 153, 51, 0); }
                }
            `}</style>
        </div>
    );
};

export default History;
