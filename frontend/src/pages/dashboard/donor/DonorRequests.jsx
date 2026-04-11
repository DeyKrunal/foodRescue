import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const DonorRequests = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const userString = localStorage.getItem('user');
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
        let qs = `?status=${status}`;
        if (status === 'REJECTED') {
            const { value: reason } = await Swal.fire({
                title: 'Rejection Reason',
                input: 'textarea',
                inputLabel: 'Enter a reason for rejection (optional)',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                confirmButtonText: 'Confirm Rejection'
            });
            
            if (reason === undefined) return; // Cancelled
            if (reason && reason.trim() !== '') qs += `&donorMessage=${encodeURIComponent(reason)}`;
        }
        try {
            await api.post(`/donor/requests/${id}/respond${qs}`);
            Swal.fire({
                icon: 'success',
                title: status === 'APPROVED' ? 'Approved' : 'Rejected',
                text: `Request updated successfully!`,
                confirmButtonColor: 'var(--primary-color)'
            });
            fetchRequests();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Action Failed',
                text: err.response?.data || "Could not complete the action.",
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleCollect = async (id) => {
        try {
            await api.post(`/donor/requests/${id}/collect`);
            Swal.fire({
                icon: 'success',
                title: 'Collected!',
                text: "Donation marked as collected.",
                timer: 2000,
                showConfirmButton: false
            });
            fetchRequests();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: "Failed to update status.",
                confirmButtonColor: '#d33'
            });
        }
    };

    const groupedRequests = requests.reduce((acc, req) => {
        const dId = req.donation?.id;
        if (!acc[dId]) acc[dId] = { donation: req.donation, requests: [] };
        acc[dId].requests.push(req);
        return acc;
    }, {});

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>NGO Requests</h1>

                {Object.values(groupedRequests).length > 0 ? Object.values(groupedRequests).map(group => (
                    <div key={group.donation?.id} style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '24px', border: '1px solid var(--border-color)' }}>
                        <h3 style={{ marginBottom: '16px', color: 'var(--primary-color)' }}>
                            {group.donation?.foodItem}
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginLeft: '12px', fontWeight: 'normal' }}>
                                ({group.requests.length} NGO{group.requests.length > 1 ? 's' : ''} requested)
                            </span>
                        </h3>

                        <div className="data-table-container">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>NGO Name</th>
                                        <th>Date</th>
                                        <th>Message from NGO</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {group.requests.map(req => (
                                        <tr key={req.id}>
                                            <td style={{ fontWeight: '500' }}>{req.ngo?.name}</td>
                                            <td>{new Date(req.requestedAt).toLocaleDateString()}</td>
                                            <td style={{ maxWidth: '200px', whiteSpace: 'normal', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                                {req.message || 'No message'}
                                            </td>
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
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                        {req.status} {req.status === 'REJECTED' && req.donorMessage && <span style={{ display: 'block', fontSize: '0.8rem', color: '#ff9800' }}>Reason: {req.donorMessage}</span>}
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )) : (
                    <div style={{ padding: '48px', textAlign: 'center', background: '#fff', borderRadius: '12px' }}>
                        No requests from NGOs yet.
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default DonorRequests;
