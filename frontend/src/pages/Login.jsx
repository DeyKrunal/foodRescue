import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser(formData);
            const user = res.data;

            // Use sessionStorage to destroy data when tab is closed
            sessionStorage.setItem('user', JSON.stringify(user));

            // Set session cookie without expiry (destroyed on browser close)
            document.cookie = `user_session=${user.id}; path=/`;

            // Redirect based on role
            if (user.role === 'ADMIN') navigate('/admin/dashboard');
            else if (user.role === 'DONOR') navigate('/donor/dashboard');
            else if (user.role === 'NGO') navigate('/ngo/dashboard');
            else navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        }
    };

    return (
        <>
            <Navbar />
            <div className="auth-page">
                <div className="auth-card animate-fade">
                    <h2>Welcome Back</h2>
                    {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>{error}</p>}
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Sign In</button>
                    </form>
                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)', fontWeight: '600' }}>Join now</Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
