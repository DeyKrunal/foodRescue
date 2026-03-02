import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalNgos: 0,
        activeListings: 0,
        pendingVerifications: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/stats');
                setStats(res.data);
            } catch (err) {
                console.error("Error fetching stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    return (
        <DashboardLayout role="ADMIN">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Platform Overview</h1>

                <div className="stats-row">
                    <div className="stat-mini-card">
                        <h4>Total Donors</h4>
                        <p>{loading ? '...' : stats.totalDonors}</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Total NGOs</h4>
                        <p>{loading ? '...' : stats.totalNgos}</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Active Donations</h4>
                        <p>{loading ? '...' : stats.activeListings}</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>Pending Verifications</h4>
                        <p style={{ color: stats.pendingVerifications > 0 ? '#e67e22' : 'inherit' }}>
                            {loading ? '...' : stats.pendingVerifications}
                        </p>
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
