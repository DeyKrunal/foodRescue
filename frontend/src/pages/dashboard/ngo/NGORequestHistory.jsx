import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';

const NGORequestHistory = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

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

    const handleReRequest = async (donationId) => {
        const message = window.prompt("Enter your new message to the donor:");
        if (message === null) return;
        try {
            await api.post(`/requests/create`, {
                donation: { id: donationId },
                ngo: { id: user.id },
                message: message
            });
            alert("New request sent!");
            // Refresh
            const res = await api.get(`/requests/ngo/${user.id}`);
            setRequests(res.data);
        } catch (err) {
            alert(err.response?.data || "Failed to send another request.");
        }
    };

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
                                <th>Date</th>
                                <th>Status</th>
                                <th>Donor Note & Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req.id}>
                                    <td style={{ fontWeight: '500' }}>{req.donation?.foodItem}</td>
                                    <td>{req.donation?.donor?.name}</td>
                                    <td style={{ color: 'var(--text-muted)' }}>{new Date(req.requestedAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'APPROVED' ? 'badge-available' : ''}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '0.85rem' }}>
                                        {req.donorMessage && (
                                            <div style={{ marginBottom: '8px', color: req.status === 'REJECTED' ? '#d32f2f' : 'var(--text-muted)' }}>
                                                <strong>Note:</strong> {req.donorMessage}
                                            </div>
                                        )}
                                        {req.status === 'REJECTED' && (
                                            <button
                                                className="btn-text"
                                                onClick={() => handleReRequest(req.donation?.id)}
                                                style={{ padding: 0, color: 'var(--primary-color)', textDecoration: 'underline' }}
                                            >
                                                Send new message / Re-request
                                            </button>
                                        )}
                                    </td>
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
