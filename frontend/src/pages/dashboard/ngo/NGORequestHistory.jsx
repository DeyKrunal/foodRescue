import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';

const NGORequestHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await api.get(`/requests/ngo/${user.id}`);
                setRequests(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (user?.id) fetchRequests();
    }, [user?.id]);

    return (
        <DashboardLayout role="NGO">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Request History</h1>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Food Item</th>
                                <th>Donor</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td style={{ fontWeight: '500' }}>{req.donation?.foodItem}</td>
                                    <td>{req.donation?.donor?.name}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'APPROVED' ? 'badge-available' : ''}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{new Date(req.requestedAt).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default NGORequestHistory;
