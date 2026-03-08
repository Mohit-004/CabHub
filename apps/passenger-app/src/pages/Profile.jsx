import { motion } from 'framer-motion';
import { User, Mail, Phone, Shield, Camera, ArrowLeft, Save, ShieldCheck, Award, Zap, Star } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
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
                    <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-1.5px' }}>Identity Hub</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontWeight: '600' }}>Manage your vibrant passenger credentials.</p>
                </div>
            </header>

            <div style={{ maxWidth: '1000px', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '48px', alignItems: 'start' }}>
                {/* Profile Card */}
                <div className="glass-card" style={{ padding: '48px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'white', border: 'none' }}>
                    <div style={{ position: 'relative', marginBottom: '32px' }}>
                        <div style={{ width: '180px', height: '180px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-luxury))', padding: '6px', boxShadow: '0 20px 40px rgba(59, 130, 246, 0.2)' }}>
                            <img
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                                style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'white' }}
                                alt="profile"
                            />
                        </div>
                        <button style={{ position: 'absolute', bottom: '5px', right: '10px', background: 'white', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '12px', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                            <Camera size={20} color="var(--accent-primary)" />
                        </button>
                    </div>

                    <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.5px' }}>{user.name}</h2>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', background: 'rgba(59, 130, 246, 0.08)', borderRadius: '20px', marginBottom: '40px' }}>
                        <Zap size={14} fill="var(--accent-primary)" color="var(--accent-primary)" />
                        <span style={{ color: 'var(--accent-primary)', fontWeight: '800', fontSize: '0.85rem' }}>GOLD PASSENGER</span>
                    </div>

                    <div style={{ width: '100%', borderTop: '2px solid #f8fafc', paddingTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900' }}>128</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>JOURNEYS</div>
                        </div>
                        <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '20px' }}>
                            <div style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fbbf24' }}>4.9 ★</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>RATING</div>
                        </div>
                    </div>
                </div>

                {/* Settings Area */}
                <div className="glass-card" style={{ padding: '56px', background: 'white', border: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
                        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px' }}>Signal Parameters</h3>
                        <button
                            className="btn-primary"
                            style={{ padding: '12px 24px', fontSize: '0.9rem', borderRadius: '14px' }}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? <Save size={18} /> : <User size={18} />} {isEditing ? 'Save Changes' : 'Edit Identity'}
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                        <ProfileInput label="LEGAL ENTITY NAME" value={user.name} icon={<User size={20} />} disabled={!isEditing} color="var(--accent-primary)" />
                        <ProfileInput label="COMMUNICATION NODE (EMAIL)" value={user.email} icon={<Mail size={20} />} disabled={!isEditing} color="var(--accent-luxury)" />
                        <ProfileInput label="MOBILE UPLINK (PHONE)" value="+91 98765 43210" icon={<Phone size={20} />} disabled={!isEditing} color="var(--accent-success)" />

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            style={{
                                marginTop: '24px', padding: '32px', background: 'rgba(16, 185, 129, 0.04)',
                                borderRadius: '24px', border: '2px solid rgba(16, 185, 129, 0.08)',
                                display: 'flex', gap: '24px', alignItems: 'center'
                            }}
                        >
                            <div style={{ width: '64px', height: '64px', background: 'var(--accent-success)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)' }}>
                                <ShieldCheck size={32} color="white" />
                            </div>
                            <div>
                                <h4 style={{ fontWeight: '900', fontSize: '1.1rem', marginBottom: '4px' }}>Two-Factor Encryption Active</h4>
                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: '600' }}>Your identity signals are protected by biometric urban encryption.</p>
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
                    fontWeight: '700',
                    fontSize: '1.05rem'
                }}
            />
        </div>
    </div>
);

export default Profile;
