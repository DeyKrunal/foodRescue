import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import ImpactStats from '../components/ImpactStats';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div className="home-page">
            <Navbar />
            <main>
                <HeroSection />
                <div style={{ background: '#fff' }}>
                    <ImpactStats />
                </div>
                <HowItWorks />
                <Testimonials />
                <section className="cta-final" style={{ padding: '100px 0', textAlign: 'center', background: 'var(--primary-color)', color: '#fff' }}>
                    <div className="container">
                        <h2 style={{ color: '#fff', marginBottom: '24px' }}>Ready to make a difference?</h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>Join hundreds of organizations working together to reduce waste and fight hunger.</p>
                        <a href="/register" className="btn" style={{ background: '#fff', color: 'var(--primary-color)' }}>Get Started Today</a>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Home;
