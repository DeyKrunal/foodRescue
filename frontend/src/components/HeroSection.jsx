import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    return (
        <section className="hero animate-fade">
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '60px', textAlign: 'left' }}>
                    <div style={{ flex: 1.2 }}>
                        <h1 style={{ lineHeight: '1.1' }}>Bridging the gap between surplus and hunger.</h1>
                        <p style={{ marginTop: '24px' }}>We connect local businesses with excess food to NGOs in need, ensuring that no meal goes to waste. Simple, direct, and human-focused.</p>
                        <div className="hero-btns" style={{ marginTop: '40px', display: 'flex', gap: '16px' }}>
                            <Link to="/donate-food" className="btn btn-primary">Donate Food</Link>
                            <Link to="/rescue-food" className="btn btn-outline">Rescue Food</Link>
                        </div>
                    </div>
                    <div style={{ flex: 0.8 }}>
                        <img src="/mission.png" alt="Community sharing a meal" style={{ width: '100%', borderRadius: '16px', boxShadow: '0 30px 60px rgba(0,0,0,0.12)' }} />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
