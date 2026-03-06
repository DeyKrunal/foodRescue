import React, { useEffect, useRef, useState } from 'react';

const steps = [
    {
        number: "01",
        icon: "🍱",
        title: "List Surplus Food",
        description: "Donors list excess food via our platform in seconds.",
        tag: "For Donors",
        tagColor: "#3d7a32",
        tagBg: "#edf6e8",
        detail: [
            { icon: "⏱", text: "Takes under 2 minutes" },
            { icon: "📦", text: "Any food type accepted" },
            { icon: "📍", text: "Set your pickup location" },
        ],
        accent: "#3d7a32",
        lightBg: "#f2faf0",
    },
    {
        number: "02",
        icon: "🔔",
        title: "Instant Connection",
        description: "Nearby NGOs receive real-time notifications and can accept the donation with one tap.",
        tag: "Automated",
        tagColor: "#c47a1e",
        tagBg: "#fdf3e3",
        detail: [
            { icon: "📡", text: "Real-time alerts to NGOs" },
            { icon: "✅", text: "One-tap acceptance" },
            { icon: "🗺", text: "Matched by proximity" },
        ],
        accent: "#d4860f",
        lightBg: "#fdf8f0",
    },
    {
        number: "03",
        icon: "🤝",
        title: "Direct Pickup",
        description: "NGOs collect directly from the donor — no middlemen, no cold chain breaks, no waste.",
        tag: "For NGOs",
        tagColor: "#2068a8",
        tagBg: "#e8f3fc",
        detail: [
            { icon: "🚗", text: "NGO handles pickup" },
            { icon: "🔒", text: "Verified partners only" },
            { icon: "📋", text: "Auto receipt generated" },
        ],
        accent: "#2068a8",
        lightBg: "#f0f7fd",
    },
];

const StepCard = ({ step, index, visible }) => {
    return (
        <div
            className="hiw-card"
            style={{
                animationDelay: `${index * 140}ms`,
                opacity: visible ? undefined : 0,
            }}
        >
            <div className="hiw-card-inner">
                {/* Top bar */}
                <div className="hiw-card-bar" style={{ background: step.accent }} />

                {/* Header row */}
                <div className="hiw-card-head">
                    <div className="hiw-icon-wrap" style={{ background: step.lightBg, borderColor: `${step.accent}22` }}>
                        <span className="hiw-icon">{step.icon}</span>
                    </div>
                    <span
                        className="hiw-tag"
                        style={{ color: step.tagColor, background: step.tagBg, borderColor: `${step.tagColor}30` }}
                    >
                        {step.tag}
                    </span>
                </div>

                {/* Step number + title */}
                <div className="hiw-num" style={{ color: `${step.accent}30` }}>{step.number}</div>
                <h3 className="hiw-title">{step.title}</h3>
                <p className="hiw-desc">{step.description}</p>

                {/* Divider */}
                <div className="hiw-divider" />

                {/* Detail bullets */}
                <ul className="hiw-details">
                    {step.detail.map((d, i) => (
                        <li key={i} className="hiw-detail-item">
                            <span className="hiw-detail-icon">{d.icon}</span>
                            <span className="hiw-detail-text">{d.text}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const HowItWorks = () => {
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.15 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,500;0,600;1,400&family=DM+Sans:wght@400;500&display=swap');

                .hiw-section {
                    background: #faf8f3;
                    padding: 88px 40px;
                    position: relative;
                    overflow: hidden;
                }

                /* Faint dotted texture */
                .hiw-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, #b5c9a8 1px, transparent 1px);
                    background-size: 30px 30px;
                    opacity: 0.13;
                    pointer-events: none;
                }

                .hiw-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                }

                /* Header */
                .hiw-header {
                    text-align: center;
                    margin-bottom: 56px;
                }
                .hiw-eyebrow {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    color: #5a9e48;
                    margin-bottom: 12px;
                }
                .hiw-heading {
                    font-family: 'Lora', Georgia, serif;
                    font-size: clamp(30px, 4vw, 44px);
                    font-weight: 600;
                    color: #1c2b1a;
                    line-height: 1.15;
                    margin: 0 0 14px;
                }
                .hiw-heading em {
                    font-style: italic;
                    font-weight: 400;
                    color: #3d7a32;
                }
                .hiw-subheading {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 16px;
                    color: #6b7f65;
                    line-height: 1.6;
                    max-width: 480px;
                    margin: 0 auto;
                }

                /* Grid + connector */
                .hiw-grid-wrap {
                    position: relative;
                }
                /* Dashed connector line between cards */
                .hiw-connector {
                    position: absolute;
                    top: 72px;
                    left: calc(33.33% - 20px);
                    right: calc(33.33% - 20px);
                    height: 2px;
                    border-top: 2px dashed #c4ddb8;
                    z-index: 0;
                    pointer-events: none;
                }
                /* Arrow heads */
                .hiw-connector::before,
                .hiw-connector::after {
                    content: '›';
                    position: absolute;
                    top: -13px;
                    font-size: 20px;
                    color: #8aba7a;
                    font-family: serif;
                }
                .hiw-connector::before { left: 46%; }
                .hiw-connector::after  { right: 3%; }

                .hiw-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 22px;
                    position: relative;
                    z-index: 1;
                }

                /* Card animation */
                @keyframes cardUp {
                    from { opacity: 0; transform: translateY(26px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .hiw-card {
                    animation: cardUp 0.55s ease both;
                }
                .hiw-card-inner {
                    background: #fff;
                    border-radius: 20px;
                    border: 1px solid #e4eedd;
                    padding: 28px 26px 24px;
                    box-shadow: 0 3px 18px rgba(61,122,50,0.06);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.22s, box-shadow 0.22s;
                    height: 100%;
                    box-sizing: border-box;
                }
                .hiw-card-inner:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 14px 36px rgba(61,122,50,0.11);
                }

                .hiw-card-bar {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    border-radius: 20px 20px 0 0;
                }

                /* Card head */
                .hiw-card-head {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 18px;
                }
                .hiw-icon-wrap {
                    width: 46px; height: 46px;
                    border-radius: 13px;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .hiw-icon { font-size: 21px; line-height: 1; }
                .hiw-tag {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 11.5px;
                    font-weight: 500;
                    padding: 4px 10px;
                    border-radius: 100px;
                    border: 1px solid;
                    letter-spacing: 0.01em;
                }

                /* Step number watermark */
                .hiw-num {
                    font-family: 'Lora', serif;
                    font-size: 52px;
                    font-weight: 600;
                    line-height: 1;
                    margin-bottom: 2px;
                    user-select: none;
                }
                .hiw-title {
                    font-family: 'Lora', Georgia, serif;
                    font-size: 19px;
                    font-weight: 600;
                    color: #1c2b1a;
                    margin: 0 0 8px;
                    line-height: 1.2;
                }
                .hiw-desc {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    color: #6b7f65;
                    line-height: 1.65;
                    margin: 0;
                }

                .hiw-divider {
                    height: 1px;
                    background: #eaf3e4;
                    margin: 18px 0 16px;
                }

                /* Detail list */
                .hiw-details {
                    list-style: none;
                    margin: 0; padding: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 9px;
                }
                .hiw-detail-item {
                    display: flex;
                    align-items: center;
                    gap: 9px;
                }
                .hiw-detail-icon {
                    font-size: 14px;
                    width: 22px;
                    text-align: center;
                    flex-shrink: 0;
                }
                .hiw-detail-text {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #4e6349;
                }

                /* Bottom trust strip */
                .hiw-trust {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 32px;
                    margin-top: 52px;
                    padding-top: 36px;
                    border-top: 1px solid #ddecd5;
                    flex-wrap: wrap;
                }
                .hiw-trust-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #6b7f65;
                }
                .hiw-trust-icon {
                    width: 30px; height: 30px;
                    background: #edf6e8;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 15px;
                }

                @media (max-width: 768px) {
                    .hiw-grid { grid-template-columns: 1fr; }
                    .hiw-connector { display: none; }
                    .hiw-section { padding: 60px 20px; }
                }
            `}</style>

            <section className="hiw-section" ref={sectionRef}>
                <div className="hiw-container">

                    <div className="hiw-header">
                        <div className="hiw-eyebrow">Simple by design</div>
                        <h2 className="hiw-heading">Three steps to <em>zero waste</em></h2>
                        <p className="hiw-subheading">
                            A straightforward process built so donors and NGOs can focus on what matters — the food, not the paperwork.
                        </p>
                    </div>

                    <div className="hiw-grid-wrap">
                        <div className="hiw-connector" />
                        <div className="hiw-grid">
                            {steps.map((step, i) => (
                                <StepCard key={i} step={step} index={i} visible={visible} />
                            ))}
                        </div>
                    </div>

                    {/* Trust strip */}
                    <div className="hiw-trust">
                        {[
                            { icon: '🔒', text: 'Verified partners only' },
                            { icon: '⚡', text: 'Avg. response under 10 min' },
                            { icon: '📊', text: 'Full donation transparency' },
                            { icon: '🌍', text: 'Active in 50+ cities' },
                        ].map((t, i) => (
                            <div className="hiw-trust-item" key={i}>
                                <div className="hiw-trust-icon">{t.icon}</div>
                                {t.text}
                            </div>
                        ))}
                    </div>

                </div>
            </section>
        </>
    );
};

export default HowItWorks;
