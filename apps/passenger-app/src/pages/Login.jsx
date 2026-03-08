import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, Navigation, ShieldCheck, Zap } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('/api/auth/user/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            window.location.href = '/dashboard';
        } catch (err) {
            alert(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(500px, 1fr) 1.2fr',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            {/* Left Side - Illustration */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-luxury))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Navigation color="white" size={22} fill="white" />
                    </div>
                    <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '900' }}>CabHub</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1 }}
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <img src="/auth_illustration.png" style={{ width: '100%', maxWidth: '450px', height: 'auto' }} alt="auth" />

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' }}>Welcome Back!</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto' }}>Log in to access your premium mobility services and vibrant rides.</p>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.03)', top: '-100px', right: '-100px' }}></div>
                <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.03)', bottom: '-50px', left: '-50px' }}></div>
            </div>

            {/* Right Side - Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ width: '100%', maxWidth: '480px', padding: '56px', background: 'white', border: 'none', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}
                >
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '8px' }}>Login</h3>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Enter your credentials to continue.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '700' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                                <input
                                    type="email"
                                    placeholder="yourname@email.com"
                                    className="input-field"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{ paddingLeft: '48px' }}
                                    required
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '12px', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: '700' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-luxury)' }} />
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

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <span style={{ color: 'var(--accent-primary)', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer' }}>Forgot Password?</span>
                        </div>

                        <button type="submit" className="btn-primary" style={{ height: '60px', marginTop: '12px', borderRadius: '18px' }}>
                            Sign In Now <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                            Don't have an account? <Link to="/register" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '800' }}>Join CabHub</Link>
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login;
