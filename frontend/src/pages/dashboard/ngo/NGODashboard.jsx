import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const NGODashboard = () => {
    const [requests, setRequests] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        // Fetch specific NGO requests here
        setRequests([
            { id: 1, item: '50 Meals - Veg', status: 'PENDING', donor: 'Biryani Palace' },
            { id: 2, item: '10kg Rice', status: 'APPROVED', donor: 'Taj Hotel' }
        ]);
    }, []);

    return (
        <DashboardLayout role="NGO">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>NGO Dashboard</h1>

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
            </div>
        </DashboardLayout>
    );
};

export default NGODashboard;
