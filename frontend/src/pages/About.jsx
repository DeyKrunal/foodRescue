import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '100px 0' }}>
                <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: '32px', textAlign: 'center' }}>Our Mission</h1>
                    <p style={{ fontSize: '1.25rem', marginBottom: '48px', textAlign: 'center', color: 'var(--text-dark)' }}>
                        We believe that in a world of abundance, hunger is a solvable problem. Our mission is to bridge the gap between food surplus and social need through technology and human connection.
                    </p>

                    <div style={{ marginBottom: '64px' }}>
                        <h2 style={{ marginBottom: '24px' }}>The Problem</h2>
                        <p>Every year, millions of tons of perfectly good food are wasted by restaurants, hotels, and events, while millions of individuals struggle with food insecurity. This disconnect is not just an environmental issue, but a profound ethical failure.</p>
                    </div>

                    <div style={{ marginBottom: '64px' }}>
                        <h2 style={{ marginBottom: '24px' }}>Our Solution</h2>
                        <p>FoodRescue provides a real-time platform that digitizes the donation process. By enabling donors to list surplus food in seconds and allowing verified NGOs to claim and collect it instantly, we create an efficient, transparent, and direct chain of impact.</p>
                    </div>

                    <div style={{ padding: '40px', background: 'var(--tertiary-color)', borderRadius: '12px', color: 'var(--primary-color)' }}>
                        <h3 style={{ marginBottom: '16px', color: 'inherit' }}>Ethical. Direct. Respectful.</h3>
                        <p style={{ color: 'inherit' }}>We prioritize the dignity of those receiving food and the commitment of those giving it. Our platform is built on trust, verification, and a shared vision of a zero-waste community.</p>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
