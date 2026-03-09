                                                                                                                            import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDonation } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const DonateFood = () => {
    const [formData, setFormData] = useState({
        foodItem: '',
        quantity: '',
        description: '',
        donor: null // Will be set from localStorage
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user || user.role !== 'DONOR') {
            navigate('/login');
        } else {
            setFormData(prev => ({ ...prev, donor: { id: user.id } }));
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createDonation(formData);
            alert('Donation listed successfully!');
            navigate('/');
        } catch (err) {
            alert('Failed to list donation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: '80px 0' }}>
                <div className="auth-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <h2 style={{ textAlign: 'left', marginBottom: '12px' }}>Donate Surplus Food</h2>
                    <p style={{ marginBottom: '32px' }}>Please provide accurate details about the food you wish to share.</p>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Food Item(s)</label>
                            <input
                                placeholder="e.g. 50 Meals of Cooked Rice and Daal"
                                type="text"
                                required
                                value={formData.foodItem}
                                onChange={(e) => setFormData({ ...formData, foodItem: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estimated Quantity</label>
                            <input
                                placeholder="e.g. 15kg or 50 portions"
                                type="text"
                                required
                                value={formData.quantity}
                                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Specific Details / Allergens</label>
                            <textarea
                                placeholder="List any allergens or pickup instructions..."
                                rows="4"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                style={{ width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%' }}
                            disabled={loading}
                        >
                            {loading ? 'Listing...' : 'List Donation Now'}
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DonateFood;
