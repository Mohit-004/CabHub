import { motion } from 'framer-motion';
import {
    Activity, Users, Car, Shield, BarChart3, Bell, Search, Settings, Grid,
    Globe, AlertTriangle, CheckCircle2, TrendingUp, DollarSign, Zap, Crown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminMapComponent from '../components/MapComponent';

const AdminDashboard = () => {
    const admin = JSON.parse(localStorage.getItem('admin') || '{}');
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        totalUsers: 1254,
        totalDrivers: 482,
        activeRides: 86,
        revenue: '12,480.50'
    });

    return (
        <div style={{ height: '100vh', width: '100vw', background: 'var(--bg-secondary)', display: 'flex', overflow: 'hidden' }}>

            {/* Saffron/Blue Vibrant Sidebar */}
            <motion.aside
                initial={{ x: -100 }}
                animate={{ x: 0 }}
                style={{ width: '110px', background: 'white', borderRight: '1px solid rgba(0, 0, 128, 0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0', gap: '48px', zIndex: 100, boxShadow: '20px 0 60px rgba(0, 0, 128, 0.02)' }}
            >
                <div style={{ width: '56px', height: '56px', background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-blue))', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyItems: 'center', boxShadow: '0 12px 24px rgba(0, 0, 128, 0.15)' }}>
                    <Crown color="white" size={28} style={{ margin: 'auto' }} />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    <ControlIcon icon={<Grid size={24} />} active color="var(--accent-blue)" />
                    <ControlIcon icon={<Globe size={24} />} color="var(--accent-saffron)" />
                    <ControlIcon icon={<Users size={24} />} color="var(--accent-green)" />
                    <ControlIcon icon={<Car size={24} />} color="var(--accent-blue)" />
                    <ControlIcon icon={<BarChart3 size={24} />} color="var(--accent-saffron)" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', alignItems: 'center' }}>
                    <ControlIcon icon={<Settings size={24} />} color="var(--text-muted)" />
                    <div style={{ width: '48px', height: '48px', borderRadius: '16px', border: '3px solid var(--accent-saffron)', overflow: 'hidden', cursor: 'pointer' }} onClick={() => { localStorage.clear(); navigate('/login'); }}>
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=Director`} style={{ width: '100%', height: '100%', background: '#fff9f5' }} alt="admin" />
                    </div>
                </div>
            </motion.aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* Global Command Bar */}
                <header style={{ height: '100px', padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,128,0.05)', background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', zIndex: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', letterSpacing: '-0.5px', color: 'var(--text-main)' }}>Bharat Mobility Command</h2>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '1px' }}>DIRECTOR ACCESS LEVEL</p>
                        </div>
                        <div style={{ display: 'flex', gap: '20px' }}>
                            <div style={{ background: 'rgba(19, 136, 8, 0.1)', padding: '10px 20px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '900', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(19, 136, 8, 0.2)' }}>
                                <div className="pulse-green" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-green)' }}></div> ALL SYSTEMS NOMINAL
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: 'var(--accent-blue)' }} />
                            <input type="text" placeholder="Search Pilots, Users, Nodes..." style={{ background: '#f8fafc', border: '2px solid transparent', borderRadius: '16px', padding: '14px 20px 14px 56px', color: 'var(--text-main)', width: '320px', fontSize: '0.95rem', fontWeight: '700', outline: 'none', transition: 'all 0.3s ease' }} onFocus={(e) => e.target.style.borderColor = 'var(--accent-blue)'} onBlur={(e) => e.target.style.borderColor = 'transparent'} />
                        </div>
                        <div style={{ width: '48px', height: '48px', background: 'white', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.05)', cursor: 'pointer' }}>
                            <Bell size={24} color="var(--accent-saffron)" />
                            <div style={{ position: 'absolute', top: '24px', right: '54px', width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-danger)', border: '2px solid white' }}></div>
                        </div>
                    </div>
                </header>

                <div style={{ flex: 1, padding: '48px', display: 'grid', gridTemplateColumns: 'minmax(600px, 1.2fr) 420px', gap: '48px', overflowY: 'auto' }}>

                    {/* Primary Dashboard */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

                        {/* Summary Nodes */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                            <NodeStat label="Active Task Forces" value={stats.totalDrivers} sub="Pilots" delta="+12%" icon={<Car color="white" />} bg="var(--accent-blue)" />
                            <NodeStat label="Total Network Nodes" value={stats.totalUsers} sub="Passengers" delta="+4%" icon={<Users color="var(--accent-blue)" />} bg="#f8fafc" />
                            <NodeStat label="Live Operations" value={stats.activeRides} sub="Current Rides" delta="+28%" icon={<Activity color="var(--accent-saffron)" />} bg="#fff9f5" />
                            <NodeStat label="Network Treasury" value={`₹${stats.revenue}`} sub="Revenue" delta="+18%" icon={<DollarSign color="var(--accent-green)" />} bg="#f0fdf4" />
                        </div>

                        {/* Fleet Monitoring Hub */}
                        <div className="glass-card" style={{ flex: 1, minHeight: '500px', padding: '0', overflow: 'hidden', position: 'relative', background: 'white' }}>
                            <div style={{ position: 'absolute', top: '24px', left: '24px', zIndex: 10, padding: '16px 24px', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,128,0.1)', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                                    <Globe size={20} color="var(--accent-blue)" /> Live Fleet Intel (Bengaluru)
                                </h3>
                            </div>

                            {/* Map Component Integrated */}
                            <div style={{ width: '100%', height: '100%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <AdminMapComponent />
                            </div>
                        </div>
                    </div>

                    {/* Security & Intelligence Feed */}
                    <aside style={{ display: 'flex', flexDirection: 'column', gap: '48px' }}>

                        {/* Alert Feed */}
                        <div className="glass-card" style={{ padding: '40px', background: 'white', border: 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h3 style={{ fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.5px' }}>Intelligence Feed</h3>
                                <div style={{ background: '#fef2f2', padding: '8px', borderRadius: '12px' }}>
                                    <AlertTriangle size={20} color="var(--accent-danger)" />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                                <AlertItem level="critical" msg="High Demand: Indiranagar Hub" time="2m ago" />
                                <AlertItem level="warning" msg="Pilot P-829: Signal Interference" time="15m ago" />
                                <AlertItem level="info" msg="System Maintenance: 02:00 IST" time="1h ago" />
                            </div>
                        </div>

                        {/* System Health */}
                        <div className="glass-card" style={{ padding: '40px', flex: 1, background: 'white', border: 'none' }}>
                            <h3 style={{ fontWeight: '900', fontSize: '1.4rem', letterSpacing: '-0.5px', marginBottom: '40px' }}>Network Integrity</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                                <HealthProcess label="Gateway API Load" value={42} color="var(--accent-blue)" />
                                <HealthProcess label="Pilot Availability" value={86} color="var(--accent-green)" />
                                <HealthProcess label="Database Replication" value={98} color="var(--accent-saffron)" />
                            </div>
                        </div>
                    </aside>
                </div>
            </main>

            <style>{`
                .pulse-green {
                    animation: pulse-g 2s infinite;
                }
                @keyframes pulse-g {
                    0% { box-shadow: 0 0 0 0px rgba(19, 136, 8, 0.4); }
                    100% { box-shadow: 0 0 0 15px rgba(19, 136, 8, 0); }
                }
            `}</style>
        </div>
    );
};

const ControlIcon = ({ icon, active, color }) => (
    <motion.div
        whileHover={{ scale: 1.15, y: -2 }}
        style={{ cursor: 'pointer', color: active ? color : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '20px', background: active ? `${color}15` : 'transparent', transition: 'all 0.3s ease' }}
    >
        {icon}
    </motion.div>
);

const NodeStat = ({ label, value, sub, delta, icon, bg }) => (
    <div className="glass-card" style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '20px', background: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ width: '48px', height: '48px', background: bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 16px rgba(0,0,0,0.05)' }}>
                {icon}
            </div>
            <div style={{ padding: '6px 12px', background: delta.startsWith('+') ? 'rgba(19, 136, 8, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '900', color: delta.startsWith('+') ? 'var(--accent-green)' : 'var(--accent-danger)' }}>{delta}</div>
        </div>
        <div>
            <div style={{ fontSize: '2rem', fontWeight: '900', letterSpacing: '-1px' }}>{value}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>{label}</div>
        </div>
    </div>
);

const AlertItem = ({ level, msg, time }) => (
    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
        <div style={{ marginTop: '2px', padding: '6px', background: level === 'critical' ? '#fef2f2' : level === 'warning' ? '#fffbeb' : '#f0fdf4', borderRadius: '50%' }}>
            {level === 'critical' ? <Zap size={16} color="var(--accent-danger)" /> : level === 'warning' ? <AlertTriangle size={16} color="var(--accent-saffron)" /> : <CheckCircle2 size={16} color="var(--accent-green)" />}
        </div>
        <div>
            <div style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '4px' }}>{msg}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>{time}</div>
        </div>
    </div>
);

const HealthProcess = ({ label, value, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-muted)' }}>{label}</span>
            <span style={{ fontSize: '1rem', fontWeight: '900', color: 'var(--text-main)' }}>{value}%</span>
        </div>
        <div style={{ height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1.5, ease: 'easeOut' }} style={{ height: '100%', background: color, borderRadius: '4px' }}></motion.div>
        </div>
    </div>
);

export default AdminDashboard;
