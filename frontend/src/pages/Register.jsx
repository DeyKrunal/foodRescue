import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { registerUser } from '../services/api';
import Swal from 'sweetalert2';

const Register = () => {

    const [searchParams] = useSearchParams();
    const initialRole = searchParams.get('role') || 'DONOR';

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: initialRole,
        mobileNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        // NGO Specific
        ngoName: '',
        authorizedPersonName: '',
        serviceRadius: '',
        ngoRegistrationNumber: '',
        vehicleAvailable: true,
        numberOfVolunteers: '',
        vehicleType: '',
        storageCapacity: '',
        availabilityTiming: '',
        // Restaurant Specific
        restaurantName: '',
        ownerManagerName: '',
        geoLocation: '',
        foodType: 'Both',
        pickupTimeWindow: '',
        averageDonationCapacity: '',
        fssaiLicenseNumber: '',
        refrigerationAvailable: true,
        emergencyContact: '',
        location: null, // [longitude, latitude] for GeoSpatial
        affiliatedNgoId: '' // NEW: Link volunteer to NGO
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getLocation = () => {
        if (!navigator.geolocation) {
            Swal.fire({
                icon: 'error',
                title: 'Not Supported',
                text: 'Geolocation is not supported by your browser',
                confirmButtonColor: 'var(--primary-color)'
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Store in our [long, lat] double array format for MongoDB
                setFormData(prev => ({
                    ...prev,
                    location: [longitude, latitude],
                    // Also update a human-readable display if we need one
                    geoLocation: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
                }));

                Swal.fire({
                    icon: 'success',
                    title: 'Location Captured',
                    text: 'Your precision location has been stored.',
                    timer: 2000,
                    showConfirmButton: false
                });
            },
            () => {
                Swal.fire({
                    icon: 'warning',
                    title: 'Location Required',
                    text: 'Please enable location access to help NGOs find your donations.',
                    confirmButtonColor: 'var(--primary-color)'
                });
            }
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError('');
        try {
            await registerUser(formData);
            navigate('/verify-email', { state: { email: formData.email } });
        } catch (err) {
            setError('Registration failed. Email might already exist.');
        } finally {
            setLoading(false);
        }
    };

    const renderSidebarContent = () => {
        if (formData.role === 'NGO') {
            return (
                <div className="registration-sidebar-content animate-fade">
                    <div className="sidebar-illustration">
                        <img src="/ngo.jpg" alt="NGO Mission" />
                    </div>
                    <div className="sidebar-text">
                        <h1>NGO Partner</h1>
                        <p>Join our network of verified NGOs and help rescue food to serve those in need. Your efforts make a direct impact on hunger relief.</p>
                    </div>
                </div>
            );
        } else if (formData.role === 'DONOR') {
            return (
                <div className="registration-sidebar-content animate-fade">
                    <div className="sidebar-illustration">
                        <img src="/hotel.png" alt="Restaurant Donation" />
                    </div>
                    <div className="sidebar-text">
                        <h1>Food Donor</h1>
                        <p>Restaurants, hotels, and businesses — stop food waste today. Share your excess food with people who need it most.</p>
                    </div>
                </div>
            );
        } else if (formData.role === 'VOLUNTEER') {
            return (
                <div className="registration-sidebar-content animate-fade">
                    <div className="sidebar-illustration">
                        <img src="/volunter.png" alt="Volunteer Delivery" />
                    </div>
                    <div className="sidebar-text">
                        <h1>Volunteer</h1>
                        <p>Be the bridge. Help transport surplus food from donors to NGOs and make a difference in your community.</p>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="registration-sidebar-content animate-fade">
                    <div className="sidebar-text">
                        <div className="role-icon">🌱</div>
                        <h1>Food Rescue</h1>
                        <p>Join our platform to bridge the gap between food waste and hunger. Choose your role to get started.</p>
                    </div>
                </div>
            );
        }
    };

    return (

        <div className="registration-container">
            <div className="registration-sidebar" style={{
                backgroundColor: formData.role === 'NGO' ? '#274B59' : '#2D5A27'
            }}>
                {renderSidebarContent()}
            </div>

            <div className="registration-form-section">
                <div className="auth-nav">
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '600', textDecoration: 'none' }}>Login</Link>
                </div>

                <div className="registration-form-container">
                    <h2>Join the Mission</h2>
                    <p>Fill in the details below to create your account.</p>

                    {error && <div style={{ color: '#D32F2F', padding: '12px', background: '#FFEBEE', borderRadius: '6px', marginBottom: '24px', fontSize: '0.9rem' }}>{error}</div>}

                    <div className="role-cards">
                        <div
                            className={`role-card ${formData.role === 'DONOR' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'DONOR' })}
                        >
                            <i>🏢</i>
                            <h3>Restaurant</h3>
                            <p>Hotels, Cafes, Plots</p>
                        </div>
                        <div
                            className={`role-card ${formData.role === 'NGO' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'NGO' })}
                        >
                            <i>🏠</i>
                            <h3>NGO</h3>
                            <p>Charity Organizations</p>
                        </div>
                        <div
                            className={`role-card ${formData.role === 'VOLUNTEER' ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, role: 'VOLUNTEER' })}
                        >
                            <i>🛵</i>
                            <h3>Volunteer</h3>
                            <p>Individual Delivery Partner</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="form-grid">
                        <div className="form-section-title">Common Profile Info</div>

                        <div className="form-group">
                            <label>Contact Person/Full Name *</label>
                            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="e.g. John Doe" />
                        </div>
                        <div className="form-group">
                            <label>Official Email Address *</label>
                            <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                        </div>
                        <div className="form-group">
                            <label>Mobile Number *</label>
                            <input type="tel" name="mobileNumber" required value={formData.mobileNumber} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
                        </div>
                        <div className="form-group">
                            <label>Password *</label>
                            <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                            <label>Confirm Password *</label>
                            <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                        </div>

                        <div className="form-section-title">Location Details</div>
                        <div className="form-group full-width">
                            <label>Full Address *</label>
                            <input type="text" name="address" required value={formData.address} onChange={handleChange} placeholder="Street, Landmark" />
                        </div>
                        <div className="form-group">
                            <label>City *</label>
                            <input type="text" name="city" required value={formData.city} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>State *</label>
                            <input type="text" name="state" required value={formData.state} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Pincode *</label>
                            <input type="text" name="pincode" required value={formData.pincode} onChange={handleChange} />
                        </div>

                        {formData.role === 'NGO' ? (
                            <>
                                <div className="form-section-title">NGO Operational Info</div>
                                <div className="form-group">
                                    <label>NGO Name *</label>
                                    <input type="text" name="ngoName" required value={formData.ngoName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Authorized Person Name *</label>
                                    <input type="text" name="authorizedPersonName" required value={formData.authorizedPersonName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>NGO Registration Number *</label>
                                    <input type="text" name="ngoRegistrationNumber" required value={formData.ngoRegistrationNumber} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Service Radius (in km) *</label>
                                    <input type="number" name="serviceRadius" required min="0" value={formData.serviceRadius} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Vehicle Available? *</label>
                                    <select name="vehicleAvailable" value={formData.vehicleAvailable} onChange={(e) => setFormData({ ...formData, vehicleAvailable: e.target.value === 'true' })}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Number of Volunteers</label>
                                    <input type="number" name="numberOfVolunteers" min="0" value={formData.numberOfVolunteers} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Vehicle Type (if any)</label>
                                    <input type="text" name="vehicleType" value={formData.vehicleType} onChange={handleChange} placeholder="e.g. Van, Bike" />
                                </div>
                                <div className="form-group">
                                    <label>Storage Capacity</label>
                                    <input type="text" name="storageCapacity" value={formData.storageCapacity} onChange={handleChange} placeholder="e.g. 100kg" />
                                </div>
                                <div className="form-group full-width">
                                    <label>Availability Timing</label>
                                    <input type="text" name="availabilityTiming" value={formData.availabilityTiming} onChange={handleChange} placeholder="e.g. 9 AM - 9 PM" />
                                </div>
                            </>
                        ) : formData.role === 'DONOR' ? (
                            <>
                                <div className="form-section-title">Restaurant Operational Info</div>
                                <div className="form-group">
                                    <label>Restaurant/Hotel Name *</label>
                                    <input type="text" name="restaurantName" required value={formData.restaurantName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Owner/Manager Name *</label>
                                    <input type="text" name="ownerManagerName" required value={formData.ownerManagerName} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>FSSAI License Number *</label>
                                    <input type="text" name="fssaiLicenseNumber" required value={formData.fssaiLicenseNumber} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Food Type *</label>
                                    <select name="foodType" value={formData.foodType} onChange={handleChange}>
                                        <option value="Veg">Pure Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                        <option value="Both">Both</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Average Donation Capacity (kg/day)</label>
                                    <input type="text" name="averageDonationCapacity" value={formData.averageDonationCapacity} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label>Refrigeration Available? *</label>
                                    <select name="refrigerationAvailable" value={formData.refrigerationAvailable} onChange={(e) => setFormData({ ...formData, refrigerationAvailable: e.target.value === 'true' })}>
                                        <option value="true">Yes</option>
                                        <option value="false">No</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Pickup Time Window</label>
                                    <input type="text" name="pickupTimeWindow" value={formData.pickupTimeWindow} onChange={handleChange} placeholder="e.g. 10 PM - 11 PM" />
                                </div>
                                <div className="form-group">
                                    <label>Emergency Contact Number</label>
                                    <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} />
                                </div>
                                <div className="form-group full-width" style={{ marginTop: '16px' }}>
                                    <label>Precision Location (GPS) *</label>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <input
                                            type="text"
                                            name="geoLocation"
                                            disabled
                                            value={formData.geoLocation || ''}
                                            placeholder="Click button to auto-fill"
                                            style={{ flex: 1, backgroundColor: '#f9f9f9' }}
                                        />
                                        <button
                                            type="button"
                                            onClick={getLocation}
                                            className="btn btn-outline"
                                            style={{ padding: '0 20px', whiteSpace: 'nowrap' }}
                                        >
                                            📍 Get My Location
                                        </button>
                                    </div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                                        This enables NGOs near you to see your donations first.
                                    </p>
                                </div>
                            </>
                        ) : formData.role === 'VOLUNTEER' ? (
                            <>
                                <div className="form-section-title">Volunteer Info</div>
                                <p style={{ gridColumn: '1/-1', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                    As a volunteer, you must link your account to an existing NGO using their unique NGO ID.
                                    Your account will be pending until they approve your application.
                                </p>
                                <div className="form-group full-width">
                                    <label>Affiliated NGO ID</label>
                                    <input
                                        type="text"
                                        placeholder="Enter the NGO ID provided by your organization"
                                        value={formData.affiliatedNgoId}
                                        onChange={(e) => setFormData({ ...formData, affiliatedNgoId: e.target.value })}
                                        required
                                    />
                                </div>
                            </>
                        ) : null}

                        <div className="form-group full-width" style={{ marginTop: '32px' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '54px' }} disabled={loading}>
                                {loading ? 'Registering...' : 'Create My Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
