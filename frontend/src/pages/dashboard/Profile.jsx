import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { updateUserProfile } from '../../services/api';
import Swal from 'sweetalert2';
import { User, Mail, Phone, MapPin, Building } from 'lucide-react';

const Profile = () => {
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')));
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

            sessionStorage.setItem('user', JSON.stringify(updatedUser));
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
            <style>{`
                .profile-container {
                    max-width: 1000px;
                    margin: 0 auto;
                }
                .profile-header {
                    margin-bottom: 40px;
                }
                .impact-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .impact-card {
                    background: rgba(255, 255, 255, 0.7);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    border-radius: 20px;
                    padding: 24px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.07);
                    transition: transform 0.3s ease;
                }
                .impact-card:hover {
                    transform: translateY(-5px);
                }
                .impact-card h3 {
                    font-size: 2rem;
                    color: var(--primary-color);
                    margin-bottom: 8px;
                }
                .impact-card p {
                    font-size: 0.85rem;
                    color: var(--text-muted);
                    font-weight: 600;
                    text-transform: uppercase;
                }
                .glass-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    padding: 40px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.04);
                }
                .profile-form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 24px;
                }
                @media (max-width: 768px) {
                    .profile-form-grid { grid-template-columns: 1fr; }
                }
            `}</style>

            <div className="profile-container animate-fade">
                <div className="profile-header">
                    <h1 style={{ fontSize: '2.2rem', fontWeight: '800' }}>My Profile</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Your contribution to a zero-hunger world.</p>
                </div>

                <div className="impact-grid">
                    <div className="impact-card">
                        <h3>{user.role === 'DONOR' ? '128' : user.role === 'NGO' ? '2.4k' : '42'}</h3>
                        <p>{user.role === 'DONOR' ? 'Meals Donated' : user.role === 'NGO' ? 'People Served' : 'Deliveries'}</p>
                    </div>
                    <div className="impact-card">
                        <h3>{user.role === 'DONOR' ? '12' : user.role === 'NGO' ? '15' : '450'}</h3>
                        <p>{user.role === 'DONOR' ? 'Active Listings' : user.role === 'NGO' ? 'Partners' : 'Rescue Points'}</p>
                    </div>
                    <div className="impact-card">
                        <h3>{user.role === 'DONOR' ? '4.8' : user.role === 'NGO' ? '4.9' : '5.0'}</h3>
                        <p>Impact Rating</p>
                    </div>
                </div>

                <div className="glass-card">
                    <form onSubmit={handleUpdate}>
                        <div className="profile-form-grid">
                            <div className="form-section-title" style={{ gridColumn: '1/-1' }}>Personal & Organization Info</div>
                            
                            <div className="form-group">
                                <label><User size={14} style={{ marginRight: '8px' }} /> Full Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                            </div>

                            <div className="form-group">
                                <label><Mail size={14} style={{ marginRight: '8px' }} /> Email Address</label>
                                <input type="email" value={formData.email} disabled style={{ backgroundColor: '#f8f9fa', cursor: 'not-allowed', color: '#999' }} />
                            </div>

                            <div className="form-group">
                                <label><Phone size={14} style={{ marginRight: '8px' }} /> Mobile Number</label>
                                <input type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} required pattern="[0-9]{10}" />
                            </div>

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

                            <div className="form-group full-width" style={{ gridColumn: '1/-1' }}>
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
                        </div>

                        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '14px 40px', borderRadius: '14px' }} disabled={loading}>
                                {loading ? 'Saving...' : 'Update Profile'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
