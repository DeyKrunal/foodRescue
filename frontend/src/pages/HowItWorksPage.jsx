import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks';

const HowItWorksPage = () => {
    return (
        <>
            <Navbar />
            <div style={{ paddingTop: '60px' }}>
                <div className="container" style={{ textAlign: 'center', marginBottom: '60px' }}>
                    <h1 style={{ fontSize: '3rem', marginBottom: '24px' }}>Efficiency in Every Step</h1>
                    <p style={{ maxWidth: '700px', margin: '0 auto' }}>We've streamlined the food redistribution process to ensure safety, speed, and maximum impact for both donors and NGOs.</p>
                </div>
                <HowItWorks />

                <div className="container" style={{ padding: '100px 0' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
                        <div>
                            <h2>Safety & Verification</h2>
                            <p style={{ marginTop: '20px' }}>All organizations on our platform undergo a verification process to ensure food handling standards are met. We provide clear guidelines for donors on what can be shared and for NGOs on how to transport it safely.</p>
                        </div>
                        <div style={{ padding: '40px', background: 'var(--bg-light)', borderRadius: '12px' }}>
                            <h3 style={{ marginBottom: '16px' }}>Donor Requirements</h3>
                            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)' }}>
                                <li>Prepared food must be within safety window</li>
                                <li>Original packaging or clean containers</li>
                                <li>Accurate description of allergens</li>
                                <li>Clear pickup instructions</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default HowItWorksPage;
