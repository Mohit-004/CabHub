import { motion } from 'framer-motion';
import { Clock, MapPin, ChevronRight, Navigation, ArrowLeft, Calendar, CreditCard, Star, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const History = () => {
    const [rides, setRides] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axios.get('/api/rides/history/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setRides(res.data);
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
            {/* Header */}
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
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1.5px' }}>Journey Log</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>Your chronology of vibrant urban travels.</p>
                </div>
            </header>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                    <div className="pulse-primary" style={{ width: '50px', height: '50px', background: 'var(--accent-primary)', borderRadius: '50%' }}></div>
                </div>
            ) : rides.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                    <div className="glass-card" style={{ display: 'inline-block', padding: '60px', background: 'white' }}>
                        <Navigation size={64} color="var(--border-light)" style={{ marginBottom: '24px' }} />
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800' }}>No signals detected.</h3>
                        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Your first vibrant journey is just a tap away.</p>
                        <button className="btn-primary" style={{ marginTop: '32px' }} onClick={() => navigate('/dashboard')}>Book Now</button>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '32px' }}>
                    {rides.map((ride, index) => (
                        <motion.div
                            key={ride._id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="glass-card"
                            style={{ padding: '40px', position: 'relative', overflow: 'hidden', background: 'white', border: 'none' }}
                        >
                            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: index % 3 === 0 ? 'var(--accent-primary)' : index % 3 === 1 ? 'var(--accent-success)' : 'var(--accent-luxury)' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                        <Calendar size={24} color="var(--accent-primary)" />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: '900', fontSize: '1.2rem' }}>{new Date(ride.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>{new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--text-main)' }}>${ride.fare}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-success)', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                                        <CheckCircle size={12} style={{ marginRight: '4px' }} /> {ride.paymentStatus}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '13px', top: '28px', bottom: '28px', width: '2px', borderLeft: '2px dashed var(--border-light)' }}></div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 4px 8px rgba(59, 130, 246, 0.2)' }}>
                                        <div style={{ width: '8px', height: '8px', background: 'white', borderRadius: '50%' }}></div>
                                    </div>
                                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>{ride.pickupLocation.address}</p>
                                </div>

                                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent-danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 4px 8px rgba(239, 68, 68, 0.2)' }}>
                                        <MapPin size={16} color="white" />
                                    </div>
                                    <p style={{ fontSize: '1.1rem', fontWeight: '800' }}>{ride.dropLocation.address}</p>
                                </div>
                            </div>

                            <div style={{ marginTop: '40px', paddingTop: '32px', borderTop: '2px solid #f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Star size={18} color="#fbbf24" fill="#fbbf24" />
                                    <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-muted)' }}>Rated 5.0 • Tesla Model S</span>
                                </div>
                                <motion.button
                                    whileHover={{ x: 8 }}
                                    style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: '900', fontSize: '0.95rem' }}
                                >
                                    RECEIPT <ChevronRight size={18} />
                                </motion.button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <style>{`
                .pulse-primary {
                    animation: pulse-p 2s infinite;
                }
                @keyframes pulse-p {
                    0% { box-shadow: 0 0 0 0px rgba(59, 130, 246, 0.4); }
                    100% { box-shadow: 0 0 0 20px rgba(59, 130, 246, 0); }
                }
            `}</style>
        </div>
    );
};

export default History;
