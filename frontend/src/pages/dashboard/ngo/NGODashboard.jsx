import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ngoVerifyDelivery, getNgoDeliveries } from '../../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const NGODashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [activeDeliveries, setActiveDeliveries] = useState([]);
    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const fetchData = async () => {
        if (!user?.id) return;
        try {
            const delRes = await getNgoDeliveries(user.id);
            setActiveDeliveries(delRes.data);
            
            const reqRes = await getNgoRequests(user.id);
            setRequests(reqRes.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleNgoVerify = async (deliveryId) => {
        try {
            await ngoVerifyDelivery(deliveryId);
            Swal.fire({
                icon: 'success',
                title: 'Pickup Confirmed!',
                text: 'Food items verified. The volunteer is now in transit.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchData();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: 'Could not verify pickup. Please try again.'
            });
        }
    };


    return (
        <DashboardLayout role="NGO">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>NGO Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Share your NGO ID with volunteers: <strong style={{ color: 'var(--primary-color)' }}>{user?.ngoId || user?.id || '...'}</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {!user?.verified && (
                        <span className="badge" style={{ background: '#FFF3E0', color: '#E65100', padding: '8px 16px' }}>
                            ⚠️ Account Pending Admin Approval
                        </span>
                    )}
                    <button onClick={() => navigate('/dashboard/ngo/volunteers')} className="btn btn-primary">Manage Volunteers</button>
                </div>
            </div>

            {!user.verified && (
                <div style={{ background: '#FFF9C4', padding: '16px', borderRadius: '8px', marginBottom: '32px', fontSize: '0.9rem', border: '1px solid #FBC02D' }}>
                    <strong>Notice:</strong> Your email is verified, but your NGO account is pending administrator review. You will be able to rescue food once approved.
                </div>
            )}

            {/* Active Deliveries Needing NGO Confirmation */}
            {activeDeliveries.some(d => d.status === 'OTP_VERIFIED') && (
                <div style={{ marginBottom: '40px' }}>
                    <h3 style={{ color: 'var(--accent-color)', marginBottom: '16px' }}>🚀 Action Required: Confirm Pickups</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                        {activeDeliveries.filter(d => d.status === 'OTP_VERIFIED').map(delivery => (
                            <div key={delivery.id} className="stat-mini-card" style={{ borderLeft: '4px solid var(--accent-color)', background: '#fff' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <h4 style={{ marginBottom: '4px' }}>{delivery.request.donation.foodItem}</h4>
                                        <p style={{ fontSize: '0.8rem', color: '#666' }}>Volunteer <strong>{delivery.volunteer.name}</strong> is at the Donor location.</p>
                                    </div>
                                    <Link to={`/delivery/${delivery.id}`} style={{ fontSize: '0.75rem', color: 'var(--primary-color)' }}>Track →</Link>
                                </div>
                                <div style={{ marginTop: '20px', padding: '12px', background: '#fcf8f3', borderRadius: '8px', border: '1px solid #faebcc', fontSize: '0.85rem' }}>
                                    <strong>Items to Verify:</strong> {delivery.request.donation.quantity} of {delivery.request.donation.foodItem}
                                </div>
                                <button
                                    className="btn btn-primary"
                                    style={{ marginTop: '16px', width: '100%', background: 'var(--accent-color)' }}
                                    onClick={() => handleNgoVerify(delivery.id)}
                                >
                                    Confirm Items & Start Delivery
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="stats-row">
                <div className="stat-mini-card">
                    <h4>Volunteers</h4>
                    <p>{user?.numberOfVolunteers || 0}</p>
                </div>
                <div className="stat-mini-card">
                    <h4>Food Collected</h4>
                    <p>120 kg</p>
                </div>
                <div className="stat-mini-card">
                    <h4>Lives Impacted</h4>
                    <p>450</p>
                </div>
            </div>

            <div className="data-table-container">
                <h3 style={{ marginBottom: '24px' }}>Active Requests</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Food Item</th>
                            <th>Donor</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.map(req => (
                            <tr key={req.id}>
                                <td>{req.donation?.foodItem}</td>
                                <td>{req.donation?.donor?.name || 'Unknown Donor'}</td>
                                <td>
                                    <span className={`badge ${
                                        req.status === 'ACCEPTED' ? 'badge-available' : 
                                        req.status === 'REJECTED' ? 'badge-rejected' : ''
                                    }`}>
                                        {req.status}
                                    </span>
                                </td>
                                <td>
                                    <Link to="/ngo/history" className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}>
                                        Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </DashboardLayout>
    );
};

export default NGODashboard;
