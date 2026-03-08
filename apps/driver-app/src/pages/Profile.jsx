import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, ArrowLeft, Save, ShieldCheck, Award, Zap, Star, Car, CreditCard } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const driver = JSON.parse(localStorage.getItem('driver') || '{}');
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);

    return (
        <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', color: 'var(--text-main)', padding: '60px 80px' }}>
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
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1.5px' }}>Pilot Identity Hub</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '800' }}>Manage your Incredible India pilot credentials.</p>
                </div>
            </header>

            <div style={{ maxWidth: '1100px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '48px', alignItems: 'start' }}>
                {/* Tactical Profile Card */}
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white', border: 'none', boxShadow: '0 32px 64px rgba(255, 153, 51, 0.05)' }}>
                    <div style={{ position: 'relative', marginBottom: '32px' }}>
                        <div style={{ width: '180px', height: '180px', borderRadius: '32px', background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-blue))', padding: '6px', boxShadow: '0 20px 40px rgba(0, 0, 128, 0.15)', transform: 'rotate(-3deg)' }}>
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=India${driver.name}`}
                                style={{ width: '100%', height: '100%', borderRadius: '28px', background: 'white' }}
                                alt="profile"
                            />
                        </div>
                        <button style={{ position: 'absolute', bottom: '-10px', right: '10px', background: 'white', border: '2px solid var(--accent-saffron)', borderRadius: '14px', padding: '12px', boxShadow: '0 8px 24px rgba(255, 153, 51, 0.2)' }}>
                            <Camera size={20} color="var(--accent-saffron)" />
                        </button>
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-1px' }}>{driver.name}</h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '24px', marginBottom: '40px' }}>
                        <Award size={16} fill="var(--accent-saffron)" color="var(--accent-saffron)" />
                        <span style={{ color: 'var(--accent-saffron)', fontWeight: '900', fontSize: '0.85rem', letterSpacing: '1px' }}>ELITE PILOT • BHARAT</span>
                    </div>

                    <div style={{ width: '100%', borderTop: '2px solid #f8fafc', paddingTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: '#fff9f5', padding: '24px', borderRadius: '24px', border: '1px solid rgba(255, 153, 51, 0.1)' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-saffron)' }}>₹12.4k</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>EARNINGS</div>
                        </div>
                        <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '24px', border: '1px solid rgba(19, 136, 8, 0.1)' }}>
                            <div style={{ fontSize: '1.6rem', fontWeight: '900', color: 'var(--accent-green)' }}>4.98 ★</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '900', letterSpacing: '1px' }}>RATING</div>
                        </div>
                    </div>
                </div>

                {/* Tactical Settings Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <div className="glass-card" style={{ padding: '56px', background: 'white', border: 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                            <h3 style={{ fontSize: '1.7rem', fontWeight: '900', letterSpacing: '-0.8px' }}>Pilot Credentials</h3>
                            <button
                                className="btn-primary"
                                style={{ padding: '14px 28px', fontSize: '0.9rem', borderRadius: '16px' }}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                {isEditing ? <Save size={18} /> : <User size={18} />} {isEditing ? 'UPDATE BIOS' : 'MODIFY CREDENTIALS'}
                            </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <ProfileInput label="PILOT FULL NAME" value={driver.name} icon={<User size={20} />} disabled={!isEditing} color="var(--accent-saffron)" />
                            </div>
                            <ProfileInput label="UPLINK (EMAIL)" value={driver.email} icon={<Mail size={20} />} disabled={!isEditing} color="var(--accent-blue)" />
                            <ProfileInput label="MOBILE UPLINK (PHONE)" value={driver.phone || "+91 98765 43210"} icon={<Phone size={20} />} disabled={!isEditing} color="var(--accent-green)" />
                        </div>
                    </div>

                    <div className="glass-card" style={{ padding: '56px', background: 'white', border: 'none' }}>
                        <h3 style={{ fontSize: '1.7rem', fontWeight: '900', letterSpacing: '-0.8px', marginBottom: '48px' }}>Vehicle Registry</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                            <ProfileInput label="VEHICLE MODEL" value={driver.vehicle?.model || "Maruti Suzuki Dzire"} icon={<Car size={20} />} disabled={!isEditing} color="var(--accent-blue)" />
                            <ProfileInput label="REGISTRATION NO." value={driver.vehicle?.number || "KA-05-MN-1234"} icon={<CreditCard size={20} />} disabled={!isEditing} color="var(--accent-saffron)" />
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '48px', padding: '32px', background: 'rgba(19, 136, 8, 0.04)',
                                borderRadius: '28px', border: '2px solid rgba(19, 136, 8, 0.08)',
                                display: 'flex', gap: '24px', alignItems: 'center'
                            }}
                        >
                            <div style={{ width: '64px', height: '64px', background: 'var(--accent-green)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(19, 136, 8, 0.2)' }}>
                                <ShieldCheck size={32} color="white" />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '900', fontSize: '1.15rem', marginBottom: '4px' }}>Bharat Fleet Verified</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '700' }}>Your pilot credentials and vehicle registry are verified by the National Transport Hub.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileInput = ({ label, value, icon, disabled, color }) => (
    <div className="input-group">
        <label style={{ display: 'block', marginBottom: '14px', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1.5px' }}>{label}</label>
        <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: color }}>{icon}</div>
            <input
                type="text"
                defaultValue={value}
                disabled={disabled}
                className="input-field"
                style={{
                    paddingLeft: '60px',
                    background: disabled ? '#f8fafc' : '#fff',
                    border: disabled ? '1px solid transparent' : `2px solid ${color}22`,
                    fontWeight: '800',
                    fontSize: '1rem',
                    color: 'var(--text-main)'
                }}
            />
        </div>
    </div>
);

export default Profile;
