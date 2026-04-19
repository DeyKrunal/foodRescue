import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    
    // Extract email from location state
    const email = location.state?.email;

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await axios.post('http://localhost:8080/api/auth/verify', {
                email: email,
                code: code
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data || 'Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page animate-fade">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Verify Your Email</h1>
                    <p>We've sent a 6-digit code to <strong>{email}</strong></p>
                </div>

                {success ? (
                    <div className="alert alert-success">
                        Email verified successfully! Redirecting to login...
                    </div>
                ) : (
                    <form onSubmit={handleVerify}>
                        <div className="form-group">
                            <label>Verification Code</label>
                            <input
                                type="text"
                                placeholder="Enter 6-digit code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength="6"
                                minLength="6"
                                pattern="[0-9]{6}"
                                title="Please enter exactly 6 digits"
                                required
                                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '8px' }}
                            />
                        </div>

                        {error && <div className="alert alert-error">{error}</div>}

                        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
                            {loading ? 'Verifying...' : 'Verify Email'}
                        </button>
                    </form>
                )}
                
                <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.9rem' }}>
                    Didn't receive code? <button className="btn-text" style={{ textDecoration: 'underline' }}>Resend</button>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;
