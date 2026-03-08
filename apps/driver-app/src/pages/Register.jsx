import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Shield, Zap, Navigation, Truck, CreditCard, Phone, Car } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        vehicleModel: '',
        vehicleNumber: '',
        vehicleType: 'Mini'
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Security clearance codes do not match");
            return;
        }

        // Structure payload for backend Driver model
        const payload = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            vehicle: {
                model: formData.vehicleModel,
                number: formData.vehicleNumber,
                type: formData.vehicleType
            }
        };

        try {
            const res = await axios.post('/api/auth/driver/register', payload);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('driver', JSON.stringify(res.data));
            window.location.href = '/dashboard';
        } catch (err) {
            alert(err.response?.data?.message || 'Pilot enrollment failed');
        }
    };

    return (
        <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr minmax(500px, 1fr)',
            minHeight: '100vh',
            background: 'var(--bg-primary)'
        }}>
            {/* Left Side - Application Form */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="glass-card"
                    style={{ width: '100%', maxWidth: '650px', padding: '48px', background: 'white', border: 'none', boxShadow: '0 40px 100px rgba(255, 153, 51, 0.08)' }}
                >
                    <div style={{ marginBottom: '32px' }}>
                        <h3 className="gradient-text-saffron" style={{ fontSize: '2.4rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1.5px' }}>Pilot Commission</h3>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>Submit your credentials with Indian pride to join our fleet.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">FULL NAME</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="e.g. Rajesh Kumar"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">UPLINK (EMAIL)</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="rajesh@cabhub.in"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">MOBILE (PHONE)</label>
                            <div style={{ position: 'relative' }}>
                                <Phone size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="phone"
                                    placeholder="+91 98765 43210"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">CLEARANCE CODE</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} className="input-icon" />
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
                            <label className="input-label">CONFIRM CODE</label>
                            <div style={{ position: 'relative' }}>
                                <Shield size={18} className="input-icon" />
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

                        <div style={{ gridColumn: 'span 2', height: '1px', background: 'var(--border-light)', margin: '10px 0' }}></div>

                        <div className="input-group">
                            <label className="input-label">VEHICLE MODEL</label>
                            <div style={{ position: 'relative' }}>
                                <Car size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="vehicleModel"
                                    placeholder="e.g. Maruti Suzuki Dzire"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label className="input-label">VEHICLE NUMBER</label>
                            <div style={{ position: 'relative' }}>
                                <CreditCard size={18} className="input-icon" />
                                <input
                                    type="text"
                                    name="vehicleNumber"
                                    placeholder="KA-01-AB-1234"
                                    className="input-field"
                                    onChange={handleChange}
                                    required
                                    style={{ paddingLeft: '48px' }}
                                />
                            </div>
                        </div>

                        <div className="input-group" style={{ gridColumn: 'span 2' }}>
                            <label className="input-label">VEHICLE CLASS</label>
                            <select
                                name="vehicleType"
                                className="input-field"
                                onChange={handleChange}
                                style={{ appearance: 'none' }}
                            >
                                <option value="Mini">Mini (Hatchback)</option>
                                <option value="Sedan">Sedan (Comfort)</option>
                                <option value="SUV">SUV (Premium/Large)</option>
                            </select>
                        </div>

                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', height: '64px', marginTop: '12px', borderRadius: '20px' }}>
                            ENROLL IN FLEET <ArrowRight size={20} />
                        </button>
                    </form>

                    <div style={{ marginTop: '32px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--text-muted)', fontWeight: '700' }}>
                            Already commissioned? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: '900' }}>System Entry</Link>
                        </p>
                    </div>
                </motion.div>
            </div>

            {/* Right Side - Tactical Branding */}
            <div style={{
                background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.08), rgba(19, 136, 8, 0.08))',
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
                    <span className="gradient-text-saffron" style={{ fontSize: '1.5rem', fontWeight: '900' }}>PilotPortal</span>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2 }}
                    style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}
                >
                    <div className="pulse-saffron" style={{ width: '320px', height: '320px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px', transform: 'rotate(-5deg)' }}>
                        <Truck size={120} color="var(--accent-primary)" strokeWidth={1} />
                    </div>

                    <h2 style={{ fontSize: '2.6rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1.5px' }}>Incredible Fleet.</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '0 auto', fontWeight: '600' }}>We are recruiting high-caliber Indian pilots for our expanding urban network.</p>
                </motion.div>

                {/* Decorative Hub Elements */}
                <div style={{ position: 'absolute', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(19, 136, 8, 0.03)', top: '-120px', left: '-120px' }}></div>
                <div style={{ position: 'absolute', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(0, 0, 128, 0.03)', bottom: '-80px', right: '-80px' }}></div>
            </div>

            <style>{`
                .input-label {
                    display: block; 
                    marginBottom: 10px; 
                    color: var(--text-main); 
                    fontSize: 0.8rem; 
                    fontWeight: 900; 
                    letterSpacing: 1.5px;
                }
                .input-icon {
                    position: absolute; 
                    left: 16px; 
                    top: 50%; 
                    transform: translateY(-50%); 
                    color: var(--accent-primary);
                }
                .gradient-text-saffron {
                    background: linear-gradient(135deg, #FF9933, #d97706);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
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

export default Register;
