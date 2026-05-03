import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDonation } from '../services/api';
import DashboardLayout from '../components/layout/DashboardLayout';
import Swal from 'sweetalert2';

const DonateFood = () => {
    const [formData, setFormData] = useState({
        foodItem: '',
        quantity: '',
        foodType: 'VEG',
        description: '',
        cookingTime: '',
        expiryTime: '',
        pickupLocation: '',
        pickupWindow: '',
        donor: null // Will be set from sessionStorage
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userString = sessionStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : null;
        if (!user || user.role !== 'DONOR') {
            navigate('/login');
        } else if (!user.verified) {
            Swal.fire({
                icon: 'warning',
                title: 'Approval Pending',
                text: 'Your account is pending admin approval. You cannot list donations yet.',
                confirmButtonColor: 'var(--primary-color)'
            }).then(() => navigate('/donor/dashboard'));
        } else {
            setFormData(prev => ({ ...prev, donor: { id: user.id } }));
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Ensure donor is nested correctly for backend
            const submissionData = {
                ...formData,
                donor: formData.donor
            };
            await createDonation(submissionData);
            Swal.fire({
                icon: 'success',
                title: 'Listed!',
                text: 'Donation listed successfully!',
                confirmButtonColor: 'var(--primary-color)'
            });
            navigate('/');
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to list donation. Please try again.',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade" style={{ maxWidth: '600px' }}>
                <h1 style={{ textAlign: 'left', marginBottom: '12px' }}>Donate Surplus Food</h1>
                <p style={{ marginBottom: '32px' }}>Please provide accurate details about the food you wish to share.</p>

                <div className="auth-card" style={{ padding: '32px', border: '1px solid var(--border-color)', borderRadius: '12px', background: '#fff' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Food Item(s) *</label>
                            <input
                                name="foodItem"
                                placeholder="e.g. 50 Meals of Cooked Rice and Daal"
                                type="text"
                                required
                                maxLength="100"
                                value={formData.foodItem}
                                onChange={handleChange}
                                className={formData.foodItem ? 'input-valid' : ''}
                            />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div className="form-group">
                                <label>Estimated Quantity *</label>
                                <input
                                    name="quantity"
                                    placeholder="e.g. 15kg or 50 pcs"
                                    type="text"
                                    required
                                    value={formData.quantity}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Food Type *</label>
                                <select name="foodType" value={formData.foodType} onChange={handleChange}>
                                    <option value="VEG">Veg</option>
                                    <option value="NON-VEG">Non-Veg</option>
                                    <option value="BOTH">Both</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Cooking Time *</label>
                            <input
                                name="cookingTime"
                                type="datetime-local"
                                required
                                value={formData.cookingTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Expiry Time *</label>
                            <input
                                name="expiryTime"
                                type="datetime-local"
                                required
                                value={formData.expiryTime}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Pickup Location *</label>
                            <input
                                name="pickupLocation"
                                placeholder="e.g. Back Gate, Kitchen Area"
                                type="text"
                                required
                                value={formData.pickupLocation}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>Pickup Window *</label>
                            <select name="pickupWindow" required value={formData.pickupWindow} onChange={handleChange}>
                                <option value="">Select Pickup Window</option>
                                <option value="IMMEDIATE">Immediate (Within 1 Hour)</option>
                                <option value="9PM-10PM">Tonight (9 PM - 10 PM)</option>
                                <option value="10PM-11PM">Tonight (10 PM - 11 PM)</option>
                                <option value="11PM-12AM">Tonight (11 PM - 12 AM)</option>
                                <option value="MORNING_AFTER">Tomorrow Morning (8 AM - 10 AM)</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Specific Details / Allergens</label>
                            <textarea
                                name="description"
                                placeholder="List any allergens or specific storage instructions..."
                                rows="3"
                                maxLength="500"
                                value={formData.description}
                                onChange={handleChange}
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
        </DashboardLayout>
    );
};

export default DonateFood;
