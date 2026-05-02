import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { updateUserProfile } from '../../services/api';
import Swal from 'sweetalert2';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [formData, setFormData] = useState({ ...user });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await updateUserProfile(user.id, formData);
            const updatedUser = res.data;

            localStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser);

            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
                text: 'Your profile information has been saved.',
                timer: 2000,
                showConfirmButton: false
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Update Failed',
                text: 'Failed to update profile info.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role={user.role}>
            <div className="animate-fade" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '32px' }}>
                    <h1>Account Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your personal and organizational profile information.</p>
                </div>

                <div className="auth-card" style={{ padding: '32px', borderRadius: '16px' }}>
                    <form onSubmit={handleUpdate} className="form-grid">
                        <div className="form-section-title">Personal Information</div>

                        <div className="form-group">
                            <label><User size={14} style={{ marginRight: '8px' }} /> Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="form-group">
                            <label><Mail size={14} style={{ marginRight: '8px' }} /> Email Address</label>
                            <input type="email" value={formData.email} disabled style={{ backgroundColor: '#f1f5f9', cursor: 'not-allowed' }} />
                        </div>

                        <div className="form-group">
                            <label><Phone size={14} style={{ marginRight: '8px' }} /> Mobile Number</label>
                            <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required pattern="[0-9]{10}" />
                        </div>

                        <div className="form-section-title">Organization Details</div>

                        {user.role === 'DONOR' && (
                            <div className="form-group">
                                <label><Building size={14} style={{ marginRight: '8px' }} /> Restaurant Name</label>
                                <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} />
                            </div>
                        )}

                        {user.role === 'NGO' && (
                            <div className="form-group">
                                <label><Building size={14} style={{ marginRight: '8px' }} /> NGO Name</label>
                                <input type="text" name="ngoName" value={formData.ngoName} onChange={handleChange} />
                            </div>
                        )}

                        <div className="form-group full-width">
                            <label><MapPin size={14} style={{ marginRight: '8px' }} /> Street Address</label>
                            <input type="text" name="address" value={formData.address} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>City</label>
                            <input type="text" name="city" value={formData.city} onChange={handleChange} />
                        </div>

                        <div className="form-group">
                            <label>Pincode</label>
                            <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} pattern="[0-9]{6}" />
                        </div>

                        <div className="form-group full-width" style={{ marginTop: '24px' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '200px' }} disabled={loading}>
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
