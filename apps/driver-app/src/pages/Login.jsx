import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Navigation, Shield, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/driver/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('driver', JSON.stringify(res.data));
            window.location.href = '/dashboard';
        } catch (err) {
            alert(err.response?.data?.message || 'Pilot authentication failed');
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(500px, 1fr) 1.2fr',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            {/* Left Side - Tactical Visual */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.05), rgba(217, 119, 6, 0.05))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-primary), #d97706)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Navigation color="white" size={22} fill="white" />
                    </div>
                    <span className="gradient-text-gold" style={{ fontSize: '1.5rem', fontWeight: '900' }}>PilotPortal</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
                >
                    <div style={{ width: '300px', height: '300px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px' }}>
                        <Zap size={120} color="var(--accent-primary)" strokeWidth={1} />
                    </div>

                    <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1.5px' }}>Ready for Takeoff?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto', fontWeight: '600' }}>Enter valid pilot credentials to initialize your tactical mission hub.</p>
                </motion.div>

                {/* Decorative Hub Elements */}
                <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '2px dashed rgba(245, 158, 11, 0.1)', top: '-200px', right: '-200px' }}></div>
                <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.03)', bottom: '-50px', left: '-50px' }}></div>
            </div>

            {/* Right Side - Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ width: '100%', maxWidth: '480px', padding: '56px', background: 'white', border: 'none', boxShadow: '0 40px 100px rgba(245, 158, 11, 0.05)' }}
                >
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>Pilot Login</h3>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Authorize your session to begin missions.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px' }}>PILOT ID (EMAIL)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                                <input
                                    type="email"
                                    placeholder="pilot@cabhub.com"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ paddingLeft: '48px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1px' }}>SECURITY CLEARANCE (PASSWORD)</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{ paddingLeft: '48px' }}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ height: '64px', marginTop: '12px', borderRadius: '20px' }}>
                            INITIALIZE SYSTEM <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>
                            New pilot? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '900' }}>Apply for Commission</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
