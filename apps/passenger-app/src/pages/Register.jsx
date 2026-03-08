import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Zap, Navigation, Phone } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const res = await axios.post('/api/auth/user/register', formData);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data));
            window.location.href = '/dashboard';
        } catch (err) {
            alert(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr minmax(500px, 1fr)',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            {/* Left Side - Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ width: '100%', maxWidth: '520px', padding: '56px', background: 'white', border: 'none', boxShadow: '0 40px 100px rgba(0,0,0,0.05)' }}
                >
                    <div style={{ marginBottom: '40px' }}>
                        <h3 style={{ fontSize: '2.2rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>Create Account</h3>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>Join the most vibrant mobility network.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '800' }}>FULL NAME</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-primary)' }} />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '800' }}>EMAIL ADDRESS</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-luxury)' }} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="yourname@email.com"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '800' }}>PASSWORD</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-warning)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="••••••••"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label style={{ display: 'block', marginBottom: '10px', color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: '800' }}>CONFIRM</label>
                            <div style={{ position: 'relative' }}>
                                <ShieldCheck size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-success)' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="••••••••"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', height: '60px', marginTop: '12px', borderRadius: '18px' }}>
                            Get Started Now <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '600' }}>
                            Already a member? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '800' }}>Sign In</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Illustration */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(59, 130, 246, 0.05))',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '60px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'absolute', top: '40px', right: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-success))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Navigation color="white" size={22} fill="white" />
                    </div>
                    <span className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: '900' }}>CabHub</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    style={{ position: 'relative', zIndex: 1 }}
                >
                    <img src="/auth_illustration.png" style={{ width: '100%', maxWidth: '450px', height: 'auto', transform: 'scaleX(-1)' }} alt="auth" />

                    <div style={{ marginTop: '40px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' }}>Join The Fleet.</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto' }}>Setting up your account takes less than a minute. Ready to roll?</p>
                    </div>
                </motion.div>

                {/* Decorative Elements */}
                <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.03)', top: '-120px', left: '-120px' }}></div>
                <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.03)', bottom: '-80px', right: '-80px' }}></div>
            </div>
        </div>
    );
};

export default Register;
