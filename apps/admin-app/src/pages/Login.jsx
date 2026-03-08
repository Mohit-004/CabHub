import { motion } from 'framer-motion';
import { ShieldAlert, Lock, User, ArrowRight, Settings, Navigation, Zap } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Real admin login endpoint
            const res = await axios.post('/api/auth/admin/login', { email, password });
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('admin', JSON.stringify(res.data));
            window.location.href = '/';
        } catch (err) {
            alert(err.response?.data?.message || 'Unauthorized: Master Key Required');
        }
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px',
            background: 'var(--bg-primary)'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{
                    width: '100%',
                    maxWidth: '480px',
                    padding: '60px 48px',
                    position: 'relative',
                    overflow: 'hidden',
                    background: 'white',
                    border: 'none',
                    boxShadow: '0 40px 100px rgba(0, 0, 128, 0.08)'
                }}
            >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(to right, var(--accent-saffron), var(--accent-blue), var(--accent-green))' }}></div>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
                    <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '28px', border: '1px solid rgba(0, 0, 128, 0.05)', boxShadow: 'inset 0 4px 20px rgba(0,0,0,0.02)' }}>
                        <ShieldAlert color="var(--accent-blue)" size={56} strokeWidth={1.5} />
                    </div>
                </div>

                <h2 className="gradient-text-blue" style={{ fontSize: '2.4rem', marginBottom: '12px', fontWeight: '900', textAlign: 'center', letterSpacing: '-1px' }}>Global Command</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '48px', textAlign: 'center', fontSize: '1.05rem', fontWeight: '600' }}>Authenticate to access the Bharat Mobility Control Center.</p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1.5px' }}>DIRECTOR ID</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
                            <input
                                type="email"
                                placeholder="director@cabhub.in"
                                className="input-field"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ paddingLeft: '48px', fontSize: '1rem', fontWeight: '700' }}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '900', letterSpacing: '1.5px' }}>SECURITY COMPLIANCE KEY</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="input-field"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ paddingLeft: '48px', fontSize: '1rem', fontWeight: '700' }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ height: '64px', marginTop: '16px', background: 'var(--accent-blue)', boxShadow: '0 10px 25px rgba(0, 0, 128, 0.2)' }}>
                        INITIALIZE OVERRIDE <ArrowRight size={20} />
                    </button>
                </form>

                <div style={{ marginTop: '48px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                    <Zap size={18} color="var(--accent-green)" />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800', letterSpacing: '0.5px' }}>BHARAT SYSTEMS v1.0 ONLINE</span>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
