import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getImpactStats } from '../../../services/api';

const DonorDashboard = () => {
    const [stats, setStats] = useState({ active: 0, pending: 0, collected: 0 });
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        // Fetch specific donor stats here in a real app
        setStats({ active: 5, pending: 2, collected: 45 });
    }, []);

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1>Welcome, {user.name}</h1>
                    {!user.verified && (
                        <span className="badge" style={{ background: '#FFF3E0', color: '#E65100', padding: '8px 16px' }}>
                            ⚠️ Account Pending Admin Approval
                        </span>
                    )}
                </div>

                {!user.verified && (
                    <div style={{ background: '#FFF9C4', padding: '16px', borderRadius: '8px', marginBottom: '32px', fontSize: '0.9rem', border: '1px solid #FBC02D' }}>
                        <strong>Action Required:</strong> Your email is verified, but your restaurant account is pending administrator review. You will be able to list food once approved.
                    </div>
                )}

                <div className="stats-row">
                    <div className="stat-mini-card">
                        <h4>Active Listings</h4>
                        <p>{stats.active}</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Pending Requests</h4>
                        <p>{stats.pending}</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Meals Donated</h4>
                        <p>{stats.collected * 10}</p>
                    </div>
                </div>

                <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-subtle)' }}>
                    <h3 style={{ marginBottom: '24px' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', gap: '16px' }}>
                        <button
                            onClick={() => navigate('/donate-food')}
                            className="btn btn-primary"
                            disabled={!user.verified}
                            title={!user.verified ? "Approval Pending" : ""}
                        >
                            Add New Donation
                        </button>
                        <button onClick={() => navigate('/donor/requests')} className="btn btn-outline">View Requests</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DonorDashboard;
