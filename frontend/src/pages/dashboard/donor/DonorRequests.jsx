import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';

const DonorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    const fetchRequests = async () => {
        try {
            const res = await api.get(`/donor/${user.id}/requests`);
            setRequests(res.data);
        } catch (err) {
            console.error("Error fetching requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [user.id]);

    const handleRespond = async (id, status) => {
        try {
            await api.post(`/donor/requests/${id}/respond?status=${status}`);
            alert(`Request ${status === 'APPROVED' ? 'Approved' : 'Rejected'}`);
            fetchRequests();
        } catch (err) {
            alert("Action failed.");
        }
    };

    const handleCollect = async (id) => {
        try {
            await api.post(`/donor/requests/${id}/collect`);
            alert("Marked as collected!");
            fetchRequests();
        } catch (err) {
            alert("Failed to update status.");
        }
    };

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>NGO Requests</h1>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>NGO Name</th>
                                <th>Requested Item</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.length > 0 ? requests.map(req => (
                                <tr key={req.id}>
                                    <td style={{ fontWeight: '500' }}>{req.ngo?.name}</td>
                                    <td>{req.donation?.foodItem}</td>
                                    <td>{new Date(req.requestedAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${req.status === 'APPROVED' ? 'badge-available' : ''}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td>
                                        {req.status === 'PENDING' ? (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    onClick={() => handleRespond(req.id, 'APPROVED')}
                                                    className="btn btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleRespond(req.id, 'REJECTED')}
                                                    className="btn btn-outline"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', color: 'red', borderColor: 'red' }}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : req.status === 'APPROVED' ? (
                                            <button
                                                onClick={() => handleCollect(req.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '6px 12px', fontSize: '0.8rem', background: '#2e7d32' }}
                                            >
                                                Mark Collected
                                            </button>
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{req.status}</span>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '48px' }}>No requests from NGOs yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DonorRequests;
