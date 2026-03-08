import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Zap, Globe, Navigation, Search, MapPin, CheckCircle, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Landing = () => {
    return (
        <div style={{ background: 'var(--bg-primary)', color: 'var(--text-main)', minHeight: '100vh', overflowX: 'hidden' }}>
            {/* Navbar */}
            <nav style={{
                padding: '20px 80px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 1000,
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--border-light)'
            }}>
                <div style={{ fontSize: '1.8rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '45px', height: '45px', background: 'linear-gradient(135deg, var(--accent-saffron), var(--accent-blue))', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 20px rgba(0, 0, 128, 0.2)' }}>
                        <Navigation color="white" size={26} fill="white" />
                    </div>
                    <span className="gradient-text" style={{ letterSpacing: '-1px' }}>CabHub</span>
                </div>
                <div style={{ display: 'flex', gap: '48px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        <NavLink label="Local Rides" />
                        <NavLink label="Our Fleet" />
                        <NavLink label="Safety Protocol" />
                    </div>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <Link to="/login" style={{ color: 'var(--text-main)', textDecoration: 'none', fontWeight: '700', fontSize: '0.95rem' }}>Log In</Link>
                        <Link to="/register" className="btn-primary" style={{ padding: '12px 28px', fontSize: '0.95rem', borderRadius: '14px' }}>Sign Up</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section style={{ paddingTop: '180px', paddingBottom: '120px', paddingLeft: '80px', paddingRight: '80px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', alignItems: 'center', gap: '60px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 20px',
                        background: 'rgba(255, 153, 51, 0.1)',
                        borderRadius: '30px',
                        color: 'var(--accent-saffron)',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        marginBottom: '32px',
                        border: '1px solid rgba(255, 153, 51, 0.2)'
                    }}>
                        <Zap size={16} fill="var(--accent-saffron)" /> INCREDIBLE BHARAT MOBILITY
                    </div>
                    <h1 style={{ fontSize: '5.2rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '28px', letterSpacing: '-3px' }}>
                        Experience <br />
                        <span className="gradient-text">Incredible Rides</span> <br />
                        Across India.
                    </h1>
                    <p style={{ fontSize: '1.35rem', color: 'var(--text-muted)', marginBottom: '48px', maxWidth: '580px', lineHeight: '1.6', fontWeight: '500' }}>
                        The most vibrant and reliable way to navigate Indian cities. From Bangalore's tech hubs to Mumbai's coast, we've got you covered.
                    </p>
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <Link to="/register" className="btn-primary" style={{ padding: '20px 48px', fontSize: '1.1rem', borderRadius: '18px' }}>
                            Book A Ride Now <ArrowRight size={22} />
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', marginLeft: '10px' }}>
                                {[1, 2, 3, 4].map(i => (
                                    <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=India${i}`} style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid white', marginLeft: '-15px' }} alt="user" />
                                ))}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>
                                <div style={{ color: 'var(--accent-green)' }}>★ 4.9/5 Rating</div>
                                <div style={{ color: 'var(--text-muted)' }}>10Lakh+ Indian Users</div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}
                >
                    <div style={{ position: 'relative', width: '100%', maxWidth: '550px' }}>
                        {/* Circle Background */}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '120%', height: '120%', background: 'radial-gradient(circle, rgba(255, 153, 51, 0.15) 0%, transparent 70%)', zIndex: -1 }}></div>

                        <img
                            src={`/vibrant_cab_hero.png`}
                            className="floating"
                            style={{ width: '100%', height: 'auto', borderRadius: '40px', boxShadow: '0 30px 60px rgba(0,0,0,0.1)' }}
                            alt="hero"
                        />

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            className="glass-card"
                            style={{ position: 'absolute', top: '20%', left: '-40px', padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', borderLeft: '5px solid var(--accent-saffron)' }}
                        >
                            <div style={{ padding: '10px', background: 'rgba(255, 153, 51, 0.1)', borderRadius: '12px' }}>
                                <MapPin size={24} color="var(--accent-saffron)" />
                            </div>
                            <div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '800' }}>DESTINATION</div>
                                <div style={{ fontWeight: '900' }}>Indiranagar, Bengaluru</div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                            className="glass-card"
                            style={{ position: 'absolute', bottom: '10%', right: '-40px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '8px', background: 'white' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-green)', fontWeight: '900' }}>
                                <CheckCircle size={18} /> RIDE CONFIRMED
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
                                <img src="https://cdn-icons-png.flaticon.com/512/3202/3202926.png" style={{ width: '50px' }} alt="car" />
                                <div>
                                    <div style={{ fontWeight: '900' }}>Premium Sedan</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>KA 05 MN 1234</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* Vibrant Search Teaser */}
            <section style={{ padding: '40px 80px' }}>
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    className="glass-card"
                    style={{ padding: '40px', background: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1000px', margin: '0 auto', border: '1px solid var(--border-light)' }}
                >
                    <div style={{ display: 'flex', gap: '32px', flex: 1 }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1.5px' }}>PICKUP POINT</div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #eee' }}>
                                <Navigation size={18} color="var(--accent-saffron)" />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600' }}>Your current location in Delhi...</span>
                            </div>
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: '900', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1.5px' }}>CHOOSE DESTINATION</div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #eee' }}>
                                <Search size={18} color="var(--accent-blue)" />
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: '600' }}>Place, city, or airport...</span>
                            </div>
                        </div>
                    </div>
                    <button className="btn-primary" style={{ padding: '24px 44px', marginLeft: '40px', borderRadius: '18px' }}>SEARCH CABS</button>
                </motion.div>
            </section>

            {/* Multi-Color Services Section */}
            <section style={{ padding: '120px 80px', textAlign: 'center' }}>
                <h2 style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '16px', letterSpacing: '-1px' }}>Vibrant Rides for Every Indian</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', marginBottom: '80px', fontWeight: '500' }}>Select the service that fits your journey across Bharat.</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '32px' }}>
                    <ServiceCard
                        color="var(--accent-saffron)"
                        icon={<Zap size={32} color="white" />}
                        title="Express Mini"
                        desc="Quickest hatchbacks for city traffic. Rapid dispatch."
                        bg="rgba(255, 153, 51, 0.05)"
                    />
                    <ServiceCard
                        color="var(--accent-green)"
                        icon={<ShieldCheck size={32} color="white" />}
                        title="Secure Plus"
                        desc="Verified pilots and extra safety for night travel."
                        bg="rgba(19, 136, 8, 0.05)"
                    />
                    <ServiceCard
                        color="var(--accent-blue)"
                        icon={<Globe size={32} color="white" />}
                        title="Executive"
                        desc="Luxury sedans with premium comfort for dignitaries."
                        bg="rgba(0, 0, 128, 0.05)"
                    />
                    <ServiceCard
                        color="#8b5cf6"
                        icon={<Users size={32} color="white" />}
                        title="Group SUV"
                        desc="Large vehicles for families and group outings."
                        bg="rgba(139, 92, 246, 0.05)"
                    />
                </div>
            </section>
        </div>
    );
};

const NavLink = ({ label }) => (
    <span style={{ cursor: 'pointer', fontWeight: '800', fontSize: '0.95rem', color: 'var(--text-muted)', transition: 'color 0.3s' }} onMouseOver={e => e.target.style.color = 'var(--accent-saffron)'} onMouseOut={e => e.target.style.color = 'var(--text-muted)'}>
        {label}
    </span>
);

const ServiceCard = ({ color, icon, title, desc, bg }) => (
    <motion.div
        whileHover={{ y: -15, boxShadow: '0 30px 60px rgba(255, 153, 51, 0.1)' }}
        className="glass-card"
        style={{ padding: '48px 32px', textAlign: 'center', borderBottom: `6px solid ${color}`, background: 'white' }}
    >
        <div style={{ width: '80px', height: '80px', background: color, borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: `0 15px 30px ${color}44` }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.6rem', fontWeight: '900', marginBottom: '16px' }}>{title}</h3>
        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '1rem', fontWeight: '600' }}>{desc}</p>
        <motion.div
            style={{ marginTop: '24px', color: color, fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            whileHover={{ x: 5 }}
        >
            LEARN MORE <ArrowRight size={16} />
        </motion.div>
    </motion.div>
);

export default Landing;
