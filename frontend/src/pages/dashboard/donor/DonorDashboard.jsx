import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getImpactStats } from '../../../services/api';

const DonorDashboard = () => {
    const [stats, setStats] = useState({ active: 0, pending: 0, collected: 0 });
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch specific donor stats here in a real app
        setStats({ active: 5, pending: 2, collected: 45 });
    }, []);

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Welcome, {user.name}</h1>

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
                        <a href="/donate-food" className="btn btn-primary">Add New Donation</a>
                        <a href="/donor/requests" className="btn btn-outline">View Requests</a>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DonorDashboard;
