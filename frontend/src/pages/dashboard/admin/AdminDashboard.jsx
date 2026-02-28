import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const AdminDashboard = () => {
    const navigate = useNavigate();
    return (
        <DashboardLayout role="ADMIN">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Platform Overview</h1>

                <div className="stats-row">
                    <div className="stat-mini-card">
                        <h4>Total Donors</h4>
                        <p>42</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Total NGOs</h4>
                        <p>18</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Active Donations</h4>
                        <p>24</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Pending Verifications</h4>
                        <p style={{ color: '#e67e22' }}>5</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-subtle)' }}>
                        <h3>Recent Users</h3>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Monitor and verify new organization registrations.</p>
                        <button className="btn btn-primary" style={{ marginTop: '24px' }} onClick={() => navigate('/admin/users')}>Verify Users</button>
                    </div>
                    <div style={{ background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: 'var(--shadow-subtle)' }}>
                        <h3>System Health</h3>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>All systems operational. No flagged donations.</p>
                        <button className="btn btn-outline" style={{ marginTop: '24px' }}>View Logs</button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
