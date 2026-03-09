import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
    const floatRef = useRef(null);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
         const emojis = ['🍱', '🥗', '🍛', '🥙', '🍜', '🌮', '🥘', '🍲', '🥗', '🍱'];
        const generated = Array.from({ length: 12 }, (_, i) => ({
            id: i,
            emoji: emojis[i % emojis.length],
            left: `${8 + (i * 8.2) % 84}%`,
            delay: `${(i * 0.7) % 6}s`,
            duration: `${7 + (i * 1.1) % 5}s`,
            size: `${16 + (i * 3) % 16}px`,
            opacity: 0.12 + (i % 4) * 0.06,
        }));
        setParticles(generated);
        console.log(generated);
        const el = floatRef.current;
        if (!el) return;
        let frame;
        let start = null;
        const animate = (ts) => {
            if (!start) start = ts;
            const t = (ts - start) / 1000;
            el.style.transform = `translateY(${Math.sin(t * 0.8) * 10}px)`;
            frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap');

                :root {
                    --ink:        #0b1f2e;
                    --ocean-dk:   #0d2d45;
                    --ocean:      #1a4d6e;
                    --ocean-md:   #256089;
                    --ocean-lt:   #3a7fa8;
                    --sky:        #c8e8f5;
                    --foam:       #e8f4fb;
                    --cream:      #fdf9f4;
                    --sand:       #f5efe4;
                    --warm-gold:  #d4944a;
                    --warm-lt:    #fce8ce;
                    --muted:      #4a6a80;
                    --border:     #ccdde8;
                }

                .hero-section {
                    min-height: 92vh;
                    display: flex;
                    align-items: center;
                    background: var(--cream);
                    position: relative;
                    overflow: hidden;
                    padding: 80px 0 60px;
                }

                /* Organic warm-meets-ocean blobs */
                .hero-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(100px);
                    pointer-events: none;
                }
                .hero-blob-1 {
                    width: 560px; height: 560px;
                    background: #b8d8ee;
                    opacity: 0.38;
                    top: -160px; left: -160px;
                }
                .hero-blob-2 {
                    width: 360px; height: 360px;
                    background: #f2d8b0;
                    opacity: 0.50;
                    bottom: -80px; right: 6%;
                }
                .hero-blob-3 {
                    width: 250px; height: 250px;
                    background: #a0cce0;
                    opacity: 0.30;
                    top: 38%; left: 40%;
                }

                /* Organic dot texture */
                .hero-section::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background-image: radial-gradient(circle, #9ab8cc 1px, transparent 1px);
                    background-size: 32px 32px;
                    opacity: 0.14;
                    pointer-events: none;
                }

                /* Warm wash bottom-right */
                .hero-section::after {
                    content: '';
                    position: absolute;
                    bottom: 0; right: 0;
                    width: 420px; height: 380px;
                    background: radial-gradient(ellipse at bottom right, #f5dfc0 0%, transparent 70%);
                    pointer-events: none;
                    opacity: 0.7;
                }

                 .food-particle {
                    position: absolute;
                    pointer-events: none;
                    z-index: 6;
                    animation: floatUp linear infinite;
                    user-select: none;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                }
                    @keyframes floatUp {
                        0% {
                            transform: translateY(-20vh) rotate(0deg) scale(0.9);
                            opacity: 0;
                            }

                        15% {
                            opacity: 0.9;
                             }

                        50% {
                            transform: translateY(50vh) rotate(180deg) scale(1);
                            opacity: 1;
                             }

                        85% {
                            opacity: 0.9;
                             }

                        100% {
                            transform: translateY(120vh) rotate(360deg) scale(1.2);
                            opacity: 0;
                            }
                        }
                

                .hero-container {
                    max-width: 1180px;
                    margin: 0 auto;
                    padding: 0 44px;
                    display: flex;
                    align-items: center;
                    gap: 72px;
                    position: relative;
                    z-index: 1;
                }

                .hero-text { flex: 1.2; }

                /* Eyebrow pill */
                .hero-label {
                    display: inline-flex;
                    align-items: center;
                    gap: 9px;
                    background: var(--foam);
                    border: 1.5px solid var(--border);
                    color: var(--ocean-md);
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    letter-spacing: 0.07em;
                    text-transform: uppercase;
                    padding: 6px 16px;
                    border-radius: 100px;
                    margin-bottom: 28px;
                }
                .hero-label-dot {
                    width: 7px; height: 7px;
                    background: var(--ocean-lt);
                    border-radius: 50%;
                    animation: pulse-dot 2.2s ease-in-out infinite;
                }
                @keyframes pulse-dot {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50%       { opacity: 0.35; transform: scale(0.6); }
                }

                .hero-title {
                    font-family: 'Cormorant Garamond', Georgia, serif;
                    font-size: clamp(44px, 5.4vw, 68px);
                    font-weight: 700;
                    line-height: 1.06;
                    color: var(--ink);
                    margin: 0;
                    letter-spacing: -0.01em;
                }
                .hero-title em {
                    font-style: italic;
                    font-weight: 500;
                    color: var(--ocean-md);
                }
                .hero-title .underline-warm {
                    position: relative;
                    display: inline-block;
                }
                .hero-title .underline-warm::after {
                    content: '';
                    position: absolute;
                    left: 0; bottom: 2px;
                    width: 100%; height: 3px;
                    background: var(--warm-gold);
                    border-radius: 2px;
                    opacity: 0.75;
                }

                .hero-desc {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 16.5px;
                    line-height: 1.74;
                    color: var(--muted);
                    margin-top: 24px;
                    max-width: 475px;
                }

                .hero-btns {
                    display: flex;
                    gap: 14px;
                    margin-top: 42px;
                    flex-wrap: wrap;
                }

                .btn-primary-hero {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 14px 32px;
                    background: var(--ocean);
                    color: #fff;
                    border-radius: 100px;
                    text-decoration: none;
                    border: 2px solid var(--ocean);
                    transition: background 0.2s, transform 0.18s, box-shadow 0.2s;
                    box-shadow: 0 6px 26px rgba(26, 77, 110, 0.30);
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn-primary-hero:hover {
                    background: var(--ocean-dk);
                    border-color: var(--ocean-dk);
                    transform: translateY(-2px);
                    box-shadow: 0 10px 34px rgba(13, 45, 69, 0.38);
                }

                .btn-outline-hero {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 14px 32px;
                    background: transparent;
                    color: var(--ocean);
                    border-radius: 100px;
                    text-decoration: none;
                    border: 2px solid var(--ocean);
                    transition: background 0.2s, transform 0.18s;
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                }
                .btn-outline-hero:hover {
                    background: var(--foam);
                    transform: translateY(-2px);
                }

                /* Stats row */
                .hero-stats {
                    display: flex;
                    gap: 40px;
                    margin-top: 52px;
                    padding-top: 36px;
                    border-top: 1.5px solid var(--border);
                }
                .stat-item { display: flex; flex-direction: column; }
                .stat-number {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--ink);
                    line-height: 1;
                }
                .stat-number span { color: var(--warm-gold); }
                .stat-label {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 11.5px;
                    color: var(--muted);
                    margin-top: 6px;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                    font-weight: 500;
                }

                /* Image side */
                .hero-image-wrap {
                    flex: 0.85;
                    position: relative;
                }

                .hero-image-wrap::before {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--sky);
                    border-radius: 28px;
                    transform: rotate(4deg) scale(1.03);
                    z-index: 0;
                    opacity: 0.8;
                }
                .hero-image-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: var(--warm-lt);
                    border-radius: 28px;
                    transform: rotate(-3deg) scale(1.015);
                    z-index: 0;
                    opacity: 0.9;
                }

                .hero-img {
                    width: 100%;
                    border-radius: 22px;
                    box-shadow: 0 28px 70px rgba(11, 31, 46, 0.20);
                    display: block;
                    position: relative;
                    z-index: 1;
                    object-fit: cover;
                    aspect-ratio: 4 / 3.4;
                }

                /* Floating badge */
                .hero-badge {
                    position: absolute;
                    bottom: -18px;
                    left: -24px;
                    background: #fff;
                    border-radius: 16px;
                    padding: 14px 18px;
                    box-shadow: 0 10px 38px rgba(11, 31, 46, 0.13);
                    z-index: 2;
                    display: flex;
                    align-items: center;
                    gap: 13px;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    border: 1px solid #e0eaf2;
                }
                .badge-icon {
                    width: 40px; height: 40px;
                    background: var(--foam);
                    border-radius: 11px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                }
                .badge-text-main {
                    font-size: 14.5px;
                    font-weight: 600;
                    color: var(--ink);
                    line-height: 1.2;
                }
                .badge-text-sub {
                    font-size: 11.5px;
                    color: var(--muted);
                    margin-top: 2px;
                }

                /* Warm gold chip */
                .hero-chip {
                    position: absolute;
                    top: -14px;
                    right: -18px;
                    background: var(--warm-gold);
                    color: #fff;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    font-size: 12px;
                    font-weight: 600;
                    padding: 7px 15px;
                    border-radius: 100px;
                    z-index: 2;
                    letter-spacing: 0.03em;
                    box-shadow: 0 4px 18px rgba(212, 148, 74, 0.40);
                }

                /* Animate in */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(26px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .hero-label      { animation: fadeUp 0.55s ease both 0.05s; }
                .hero-title      { animation: fadeUp 0.55s ease both 0.15s; }
                .hero-desc       { animation: fadeUp 0.55s ease both 0.28s; }
                .hero-btns       { animation: fadeUp 0.55s ease both 0.38s; }
                .hero-stats      { animation: fadeUp 0.55s ease both 0.50s; }
                .hero-image-wrap { animation: fadeUp 0.65s ease both 0.20s; }
            `}</style>

            <section className="hero-section">
                <div className="hero-blob hero-blob-1" />
                <div className="hero-blob hero-blob-2" />
                <div className="hero-blob hero-blob-3" />
                 {particles.map(p => (
                    <span
                        key={p.id}
                        className="food-particle"
                        style={{
                            left: p.left,
                            bottom: '-40px',
                            fontSize: p.size,
                            animationDelay: p.delay,
                            animationDuration: p.duration,
                            '--p-opacity': p.opacity,
                        }}
                    >
                        {p.emoji}
                    </span>
                ))}

                <div className="hero-container">
                    {/* Left: Text */}
                    <div className="hero-text">
                        <div className="hero-label">
                            <span className="hero-label-dot" />
                            Zero Waste. Real Impact.
                        </div>

                        <h1 className="hero-title">
                            Bridging the gap between<br />
                            <em>surplus</em> and <span className="underline-warm">hunger</span>.
                        </h1>

                        <p className="hero-desc">
                            We connect local businesses with excess food to NGOs in need —
                            ensuring no meal goes to waste. Simple, direct, and human-focused.
                        </p>

                        <div className="hero-btns">
                            <Link to="/donate-food" className="btn-primary-hero">
                                🍱 Donate Food
                            </Link>
                            <Link to="/rescue-food" className="btn-outline-hero">
                                🤝 Rescue Food
                            </Link>
                        </div>

                        <div className="hero-stats">
                            <div className="stat-item">
                                <span className="stat-number">12K<span>+</span></span>
                                <span className="stat-label">Meals Rescued</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">340<span>+</span></span>
                                <span className="stat-label">Partner NGOs</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">80<span>+</span></span>
                                <span className="stat-label">Cities Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Image */}
                    <div className="hero-image-wrap" ref={floatRef}>
                        <img
                            src="/mission.png"
                            alt="Community sharing a meal"
                            className="hero-img"
                        />
                        <div className="hero-badge">
                            <div className="badge-icon">✅</div>
                            <div>
                                <div className="badge-text-main">47 meals rescued</div>
                                <div className="badge-text-sub">in the last hour</div>
                            </div>
                        </div>
                        <div className="hero-chip">🌊 100% Free</div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HeroSection;