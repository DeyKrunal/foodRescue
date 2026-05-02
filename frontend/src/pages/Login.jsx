import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await loginUser(formData);
            const user = res.data;

            // Use localStorage to maintain session across tabs
            localStorage.setItem('user', JSON.stringify(user));

            // Redirect based on role
            if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else if (user.role === 'DONOR') navigate('/donor/dashboard');
            else if (user.role === 'NGO') navigate('/ngo/dashboard');
            else if (user.role === 'VOLUNTEER') navigate('/volunteer/dashboard');
            else navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                .auth-page {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 40px 20px;
                    background: var(--bg-color, #f8fafc);
                    position: relative;
                    overflow: hidden;
                }

                /* Subtle animated blobs using the primary color */
                .auth-page::before,
                .auth-page::after {
                    content: '';
                    position: absolute;
                    border-radius: 50%;
                    pointer-events: none;
                    opacity: 0.07;
                }
                .auth-page::before {
                    width: 500px; height: 500px;
                    background: var(--primary-color, #4f46e5);
                    top: -160px; right: -160px;
                    animation: blobDrift 12s ease-in-out infinite alternate;
                }
                .auth-page::after {
                    width: 380px; height: 380px;
                    background: var(--primary-color, #4f46e5);
                    bottom: -120px; left: -100px;
                    animation: blobDrift 16s ease-in-out infinite alternate-reverse;
                }

                @keyframes blobDrift {
                    0%   { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(25px, 20px) scale(1.06); }
                }

                /* Card */
                .auth-card {
                    position: relative;
                    z-index: 1;
                    background: var(--card-bg, #ffffff);
                    border: 1px solid var(--border-color, rgba(0,0,0,0.08));
                    border-radius: 20px;
                    padding: 48px 44px;
                    width: 100%;
                    max-width: 420px;
                    box-shadow:
                        0 4px 6px rgba(0,0,0,0.04),
                        0 20px 60px rgba(0,0,0,0.08);
                }

                /* Top colored accent bar */
                .auth-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--primary-color, #4f46e5), transparent);
                    border-radius: 20px 20px 0 0;
                }

                .animate-fade {
                    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
                }

                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Heading */
                .auth-card h2 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: var(--text-color, #111827);
                    margin: 0 0 4px 0;
                    text-align: center;
                }

                .auth-tagline {
                    text-align: center;
                    font-size: 0.85rem;
                    color: var(--text-muted, #6b7280);
                    margin: 0 0 36px 0;
                }

                /* Error */
                .auth-error {
                    background: #fef2f2;
                    border: 1px solid #fecaca;
                    border-left: 3px solid #ef4444;
                    border-radius: 8px;
                    padding: 10px 14px;
                    margin-bottom: 22px;
                    font-size: 0.84rem;
                    color: #dc2626;
                    animation: shake 0.35s ease;
                }

                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    20%     { transform: translateX(-5px); }
                    60%     { transform: translateX(5px); }
                }

                /* Form fields */
                .form-group {
                    margin-bottom: 18px;
                }

                .form-group label {
                    display: block;
                    font-size: 0.82rem;
                    font-weight: 600;
                    color: var(--text-color, #374151);
                    margin-bottom: 7px;
                }

                .form-group input {
                    width: 100%;
                    padding: 11px 14px;
                    border: 1.5px solid var(--border-color, #e5e7eb);
                    border-radius: 10px;
                    font-size: 0.9rem;
                    color: var(--text-color, #111827);
                    background: var(--input-bg, #f9fafb);
                    outline: none;
                    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
                    box-sizing: border-box;
                    font-family: inherit;
                }

                .form-group input:focus {
                    border-color: var(--primary-color, #4f46e5);
                    background: #fff;
                    box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color, #4f46e5) 12%, transparent);
                }

                .form-group input::placeholder {
                    color: var(--text-muted, #9ca3af);
                    font-size: 0.85rem;
                }

                /* Button */
                .btn.btn-primary {
                    width: 100%;
                    padding: 12px;
                    margin-top: 6px;
                    background: var(--primary-color, #4f46e5);
                    color: #fff;
                    border: none;
                    border-radius: 10px;
                    font-size: 0.9rem;
                    font-weight: 600;
                    font-family: inherit;
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.18s, box-shadow 0.18s, filter 0.18s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                }

                /* Ripple shine sweep on hover */
                .btn.btn-primary::after {
                    content: '';
                    position: absolute;
                    top: 0; left: -100%;
                    width: 60%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: left 0.4s ease;
                }

                .btn.btn-primary:hover::after { left: 150%; }

                .btn.btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px color-mix(in srgb, var(--primary-color, #4f46e5) 35%, transparent);
                    filter: brightness(1.05);
                }

                .btn.btn-primary:active:not(:disabled) {
                    transform: translateY(0);
                }

                .btn.btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }

                .btn-spinner {
                    width: 15px; height: 15px;
                    border: 2px solid rgba(255,255,255,0.35);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.65s linear infinite;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                /* Footer */
                .auth-footer-text {
                    text-align: center;
                    margin-top: 24px;
                    font-size: 0.87rem;
                    color: var(--text-muted, #6b7280);
                }

                .auth-footer-text a {
                    color: var(--primary-color, #4f46e5);
                    font-weight: 600;
                    text-decoration: none;
                }

                .auth-footer-text a:hover {
                    text-decoration: underline;
                }

                @media (max-width: 480px) {
                    .auth-card { padding: 36px 24px; }
                }
            `}</style>

            <Navbar />
            <div className="auth-page">
                <div className="auth-card animate-fade">
                    <h2>Welcome Back</h2>
                    <p className="auth-tagline">Sign in to continue</p>

                    {error && <div className="auth-error">⚠ {error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                required
                                maxLength="100"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                minLength="8"
                                maxLength="100"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading && <span className="btn-spinner" />}
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer-text">
                        Don't have an account? <Link to="/register">Join now</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
