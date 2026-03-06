import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HowItWorks from '../components/HowItWorks';

const HowItWorksPage = () => {
    const requirements = [
        { icon: '⏱', text: 'Prepared food must be within safety window' },
        { icon: '📦', text: 'Original packaging or clean containers' },
        { icon: '⚠️', text: 'Accurate description of allergens' },
        { icon: '📍', text: 'Clear pickup instructions' },
    ];

    return (
        <>
            <style>{`
                .hiw-page {
                    font-family: inherit;
                }

                /* ── Hero ── */
                .hiw-hero {
                    padding: 90px 20px 70px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .hiw-hero::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse 70% 60% at 50% 0%, color-mix(in srgb, var(--primary-color, #4f46e5) 8%, transparent), transparent 70%);
                    pointer-events: none;
                }

                .hiw-hero-eyebrow {
                    display: inline-block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--primary-color, #4f46e5);
                    background: color-mix(in srgb, var(--primary-color, #4f46e5) 10%, transparent);
                    border: 1px solid color-mix(in srgb, var(--primary-color, #4f46e5) 20%, transparent);
                    padding: 5px 14px;
                    border-radius: 100px;
                    margin-bottom: 22px;
                }

                .hiw-hero h1 {
                    font-size: clamp(2rem, 5vw, 3.2rem);
                    font-weight: 700;
                    color: var(--text-color, #111827);
                    margin: 0 0 20px 0;
                    line-height: 1.15;
                }

                .hiw-hero p {
                    max-width: 620px;
                    margin: 0 auto;
                    font-size: 1rem;
                    color: var(--text-muted, #6b7280);
                    line-height: 1.7;
                }

                /* Decorative divider below hero */
                .hiw-divider {
                    width: 48px;
                    height: 3px;
                    background: linear-gradient(90deg, var(--primary-color, #4f46e5), transparent);
                    border-radius: 4px;
                    margin: 32px auto 0;
                }

                /* ── HowItWorks component wrapper ── */
                .hiw-steps-wrapper {
                    background: var(--bg-light, #f9fafb);
                    border-top: 1px solid var(--border-color, #e5e7eb);
                    border-bottom: 1px solid var(--border-color, #e5e7eb);
                }

                /* ── Safety section ── */
                .hiw-safety {
                    padding: 90px 20px;
                }

                .hiw-safety-inner {
                    max-width: 1100px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 64px;
                    align-items: center;
                }

                .hiw-safety-text h2 {
                    font-size: clamp(1.5rem, 3vw, 2.1rem);
                    font-weight: 700;
                    color: var(--text-color, #111827);
                    margin: 0 0 16px 0;
                    line-height: 1.2;
                }

                /* Underline accent on heading */
                .hiw-safety-text h2 span {
                    position: relative;
                    display: inline-block;
                }
                .hiw-safety-text h2 span::after {
                    content: '';
                    position: absolute;
                    left: 0; bottom: -3px;
                    width: 100%; height: 3px;
                    background: linear-gradient(90deg, var(--primary-color, #4f46e5), transparent);
                    border-radius: 4px;
                }

                .hiw-safety-text p {
                    font-size: 0.95rem;
                    color: var(--text-muted, #6b7280);
                    line-height: 1.75;
                    margin: 0;
                }

                /* Requirements card */
                .hiw-req-card {
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 16px;
                    padding: 36px;
                    box-shadow: 0 4px 6px rgba(0,0,0,0.03), 0 12px 40px rgba(0,0,0,0.06);
                    position: relative;
                    overflow: hidden;
                }

                /* Top accent */
                .hiw-req-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--primary-color, #4f46e5), transparent);
                    border-radius: 16px 16px 0 0;
                }

                .hiw-req-card h3 {
                    font-size: 1rem;
                    font-weight: 700;
                    color: var(--text-color, #111827);
                    margin: 0 0 24px 0;
                    letter-spacing: 0.01em;
                }

                .hiw-req-list {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                }

                .hiw-req-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    padding: 12px 14px;
                    background: var(--bg-light, #f9fafb);
                    border: 1px solid var(--border-color, #e5e7eb);
                    border-radius: 10px;
                    transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
                }

                .hiw-req-item:hover {
                    border-color: color-mix(in srgb, var(--primary-color, #4f46e5) 40%, transparent);
                    transform: translateX(4px);
                    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
                }

                .hiw-req-icon {
                    font-size: 1rem;
                    line-height: 1;
                    margin-top: 1px;
                    flex-shrink: 0;
                }

                .hiw-req-text {
                    font-size: 0.86rem;
                    color: var(--text-muted, #6b7280);
                    line-height: 1.5;
                }

                @media (max-width: 768px) {
                    .hiw-safety-inner {
                        grid-template-columns: 1fr;
                        gap: 36px;
                    }
                    .hiw-safety { padding: 60px 20px; }
                }
            `}</style>

            <Navbar />
            <div className="hiw-page">

                {/* Hero */}
                <div className="hiw-hero">
                    <div className="hiw-hero-eyebrow">How It Works</div>
                    <h1>Efficiency in Every Step</h1>
                    <p>We've streamlined the food redistribution process to ensure safety, speed, and maximum impact for both donors and NGOs.</p>
                    <div className="hiw-divider" />
                </div>

                {/* Steps component */}
                <div className="hiw-steps-wrapper">
                    <HowItWorks />
                </div>

                {/* Safety & Verification */}
                <div className="hiw-safety">
                    <div className="hiw-safety-inner">
                        <div className="hiw-safety-text">
                            <h2><span>Safety</span> & Verification</h2>
                            <p>All organizations on our platform undergo a verification process to ensure food handling standards are met. We provide clear guidelines for donors on what can be shared and for NGOs on how to transport it safely.</p>
                        </div>

                        <div className="hiw-req-card">
                            <h3>Donor Requirements</h3>
                            <ul className="hiw-req-list">
                                {requirements.map((r, i) => (
                                    <li key={i} className="hiw-req-item">
                                        <span className="hiw-req-icon">{r.icon}</span>
                                        <span className="hiw-req-text">{r.text}</span>
                                    </li>
                                ))}
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
