import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalNgos: 0,
        activeListings: 0,
        pendingVerifications: 0
    });
    const [loading, setLoading] = useState(true);
    const [testError, setTestError] = useState(0); // Demo variable requested by user

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

    useEffect(() => {
        if (testError === 1) {
            Swal.fire({
                icon: 'error',
                title: 'Fancy System Error',
                text: 'This is a demonstration of the upgraded fancy error system. All systems are being monitored!',
                confirmButtonColor: '#d33',
                backdrop: `rgba(255,0,0,0.1)`,
                allowOutsideClick: false
            });
        }
    }, [testError]);

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
                        <h3>Error System Showcase</h3>
                        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>
                            Currently set to: <strong>{testError}</strong>. 
                            Change this in <code>AdminDashboard.jsx</code> to <code>1</code> to see the fancy error.
                        </p>
                        <button 
                            className="btn btn-outline" 
                            style={{ marginTop: '24px', borderColor: testError === 1 ? '#d33' : '#ccc', color: testError === 1 ? '#d33' : 'inherit' }}
                            onClick={() => setTestError(testError === 1 ? 0 : 1)}
                        >
                            {testError === 1 ? 'Reset Variable to 0' : 'Demo: Set Variable to 1'}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
