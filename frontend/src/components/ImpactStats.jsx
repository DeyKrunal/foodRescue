import React, { useEffect, useState, useRef } from 'react';
import { getImpactStats } from '../services/api';

// Animates a number from 0 → target when visible
const useCountUp = (target, duration = 1800, active = false) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!active || target === 0) return;
        let start = null;
        const from = 0;
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(from + (target - from) * eased));
            if (progress < 1) requestAnimationFrame(step);
            else setValue(target);
        };
        requestAnimationFrame(step);
    }, [target, active, duration]);
    return value;
};

const StatCard = ({ icon, label, value, suffix = '', prefix = '', sublabel, color, delay, active }) => {
    const animated = useCountUp(value, 1800, active);

    return (
        <div className="impact-card" style={{ animationDelay: `${delay}ms` }}>
            <div className="impact-card-inner">
                {/* Top accent line */}
                <div className="impact-card-line" style={{ background: color }} />

                <div className="impact-icon-wrap" style={{ background: `${color}18`, borderColor: `${color}30` }}>
                    <span className="impact-icon">{icon}</span>
                </div>

                <div className="impact-number">
                    {prefix}
                    <span className="impact-num-val">
                        {animated.toLocaleString()}
                    </span>
                    {suffix}
                </div>

                <div className="impact-label">{label}</div>

                {sublabel && (
                    <div className="impact-sublabel">
                        <span className="impact-trend">↑</span> {sublabel}
                    </div>
                )}
            </div>
        </div>
    );
};

const ImpactStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]   = useState(false);
    const [visible, setVisible] = useState(false);
    const [lastUpdated, setLastUpdated] = useState(null);
    const sectionRef = useRef(null);

    const fetchStats = () => {
        setLoading(true);
        setError(false);
        getImpactStats()
            .then(res => {
                setStats(res.data);
                setLastUpdated(new Date());
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch stats, using fallback.', err);
                setStats({ mealsServed: 12500, foodSavedKg: 5200, partnersCount: 150 });
                setError(true);
                setLastUpdated(new Date());
                setLoading(false);
            });
    };

    useEffect(() => { fetchStats(); }, []);

    // Trigger count-up animation when section scrolls into view
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.25 }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    const timeAgo = lastUpdated
        ? `Updated ${Math.floor((Date.now() - lastUpdated) / 60000) || 'just'} ${Math.floor((Date.now() - lastUpdated) / 60000) ? 'min ago' : 'now'}`
        : '';

    const cardData = stats ? [
        {
            icon: '🍱',
            label: 'Meals Rescued',
            value: stats.mealsServed,
            suffix: '+',
            sublabel: '340 meals this week',
            color: '#3d7a32',
            delay: 0,
        },
        {
            icon: '⚖️',
            label: 'Food Saved',
            value: stats.foodSavedKg,
            suffix: ' kg',
            sublabel: 'Equivalent to 10,400 servings',
            color: '#e07b2e',
            delay: 120,
        },
        {
            icon: '🤝',
            label: 'Active Partners',
            value: stats.partnersCount,
            suffix: '+',
            sublabel: '12 new partners this month',
            color: '#2e7da8',
            delay: 240,
        },
    ] : [];

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=DM+Sans:wght@400;500;600&display=swap');

                .impact-section {
                    background: #f4f9f0;
                    padding: 80px 40px;
                    position: relative;
                    overflow: hidden;
                }

                /* Subtle radial glow behind cards */
                .impact-section::before {
                    content: '';
                    position: absolute;
                    top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    width: 700px; height: 300px;
                    background: radial-gradient(ellipse, rgba(61,122,50,0.08) 0%, transparent 70%);
                    pointer-events: none;
                }

                .impact-header {
                    text-align: center;
                    margin-bottom: 48px;
                }
                .impact-eyebrow {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12.5px;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #5a9e48;
                    margin-bottom: 10px;
                }
                .impact-title {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(28px, 4vw, 40px);
                    font-weight: 700;
                    color: #1c2b1a;
                    line-height: 1.1;
                    margin: 0;
                }
                .impact-title em {
                    font-style: italic;
                    color: #3d7a32;
                }

                /* Grid */
                .impact-grid {
                    max-width: 1060px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }

                /* Card */
                @keyframes cardFadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                .impact-card {
                    animation: cardFadeUp 0.6s ease both;
                }
                .impact-card-inner {
                    background: #fff;
                    border-radius: 20px;
                    padding: 32px 28px 26px;
                    border: 1px solid #e4f0dc;
                    box-shadow: 0 4px 24px rgba(61,122,50,0.06), 0 1px 4px rgba(0,0,0,0.04);
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.22s, box-shadow 0.22s;
                }
                .impact-card-inner:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(61,122,50,0.12), 0 2px 8px rgba(0,0,0,0.06);
                }

                /* Top color accent bar */
                .impact-card-line {
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    border-radius: 20px 20px 0 0;
                }

                /* Icon */
                .impact-icon-wrap {
                    width: 48px; height: 48px;
                    border-radius: 13px;
                    border: 1px solid;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 20px;
                }
                .impact-icon { font-size: 22px; line-height: 1; }

                /* Number */
                .impact-number {
                    font-family: 'Fraunces', serif;
                    font-size: clamp(36px, 4.5vw, 50px);
                    font-weight: 700;
                    color: #1c2b1a;
                    line-height: 1;
                    letter-spacing: -0.02em;
                }

                .impact-label {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    color: #3d5438;
                    margin-top: 8px;
                }

                .impact-sublabel {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12.5px;
                    color: #7a9070;
                    margin-top: 6px;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }
                .impact-trend {
                    color: #5a9e48;
                    font-weight: 700;
                    font-size: 13px;
                }

                /* Footer row */
                .impact-footer {
                    max-width: 1060px;
                    margin: 24px auto 0;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 12px;
                }
                .impact-status {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12.5px;
                    color: #7a9070;
                }
                .impact-status-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .dot-live { background: #5a9e48; animation: pulse-dot 2s ease-in-out infinite; }
                .dot-fallback { background: #e07b2e; }
                @keyframes pulse-dot {
                    0%,100% { opacity:1; transform:scale(1); }
                    50%      { opacity:0.4; transform:scale(0.65); }
                }

                .btn-refresh {
                    font-family: 'DM Sans', sans-serif;
                    font-size: 12.5px;
                    font-weight: 500;
                    color: #3d7a32;
                    background: #edf6e8;
                    border: 1px solid #c4ddb8;
                    border-radius: 100px;
                    padding: 5px 14px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: background 0.18s, transform 0.18s;
                }
                .btn-refresh:hover {
                    background: #dff0d5;
                    transform: translateY(-1px);
                }
                .btn-refresh:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                .spin { animation: spin 0.8s linear infinite; display: inline-block; }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Loading skeleton */
                .impact-skeleton {
                    max-width: 1060px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                }
                .skeleton-card {
                    background: #fff;
                    border-radius: 20px;
                    padding: 32px 28px 26px;
                    border: 1px solid #e4f0dc;
                }
                .skeleton-line {
                    border-radius: 6px;
                    background: linear-gradient(90deg, #eef5e9 25%, #dff0d5 50%, #eef5e9 75%);
                    background-size: 200% 100%;
                    animation: shimmer 1.4s ease-in-out infinite;
                }
                @keyframes shimmer {
                    0%   { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                @media (max-width: 768px) {
                    .impact-grid, .impact-skeleton { grid-template-columns: 1fr; }
                    .impact-section { padding: 60px 20px; }
                }
            `}</style>

            <section className="impact-section" ref={sectionRef}>
                <div className="impact-header">
                    <div className="impact-eyebrow">Real Numbers. Real Impact.</div>
                    <h2 className="impact-title">Every meal counts — <em>here's the proof</em></h2>
                </div>

                {loading ? (
                    <div className="impact-skeleton">
                        {[0,1,2].map(i => (
                            <div className="skeleton-card" key={i}>
                                <div className="skeleton-line" style={{ width: 48, height: 48, borderRadius: 13, marginBottom: 20 }} />
                                <div className="skeleton-line" style={{ width: '60%', height: 44, marginBottom: 10 }} />
                                <div className="skeleton-line" style={{ width: '45%', height: 16, marginBottom: 8 }} />
                                <div className="skeleton-line" style={{ width: '70%', height: 12 }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="impact-grid">
                        {cardData.map((card) => (
                            <StatCard key={card.label} {...card} active={visible} />
                        ))}
                    </div>
                )}

                <div className="impact-footer">
                    <div className="impact-status">
                        <span className={`impact-status-dot ${error ? 'dot-fallback' : 'dot-live'}`} />
                        {error
                            ? 'Showing estimated data · live fetch failed'
                            : `Live data · ${timeAgo}`}
                    </div>
                    <button
                        className="btn-refresh"
                        onClick={fetchStats}
                        disabled={loading}
                    >
                        {loading
                            ? <><span className="spin">↻</span> Refreshing…</>
                            : <>↻ Refresh</>}
                    </button>
                </div>
            </section>
        </>
    );
};

export default ImpactStats;
