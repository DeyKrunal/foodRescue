import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

import { useNavigate } from 'react-router-dom';

const NGODashboard = () => {
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        // Fetch specific NGO requests here
        setRequests([
            { id: 1, item: '50 Meals - Veg', status: 'PENDING', donor: 'Biryani Palace' },
            { id: 2, item: '10kg Rice', status: 'APPROVED', donor: 'Taj Hotel' }
        ]);
    }, []);

    return (
        <DashboardLayout role="NGO">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div>
                    <h1>NGO Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        Share your NGO ID with volunteers: <strong style={{ color: 'var(--primary-color)' }}>{user.ngoId || user.id}</strong>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {!user.verified && (
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

            <div className="stats-row">
                <div className="stat-mini-card">
                    <h4>My Requests</h4>
                    <p>{requests.length}</p>
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
                                <td>{req.item}</td>
                                <td>{req.donor}</td>
                                <td><span className={`badge ${req.status === 'APPROVED' ? 'badge-available' : ''}`}>{req.status}</span></td>
                                <td><button className="btn btn-outline" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Details</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </DashboardLayout>
    );
};

export default NGODashboard;
