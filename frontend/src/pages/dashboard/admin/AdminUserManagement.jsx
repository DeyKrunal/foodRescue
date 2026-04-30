import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getAllUsers, verifyPartner } from '../../../services/api';
import { ShieldCheck, Eye, X } from 'lucide-react';
import Swal from 'sweetalert2';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = async () => {
        try {
            const res = await getAllUsers();
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleVerify = async (id) => {
        try {
            await verifyPartner(id);
            Swal.fire({
                icon: 'success',
                title: 'Verified!',
                text: 'Partner verified successfully!',
                confirmButtonColor: 'var(--primary-color)'
            });
            setSelectedUser(null);
            fetchUsers();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Verification failed. Please try again.',
                confirmButtonColor: '#d33'
            });
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Partner Management</h1>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Partner Name</th>
                                <th>Contact Person</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Location</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: '600' }}>
                                        {u.role === 'NGO' ? u.ngoName : (u.role === 'DONOR' ? u.restaurantName : 'System Admin')}
                                        {(u.role === 'NGO' && u.ngoRegistrationNumber) &&
                                            <div style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>{u.ngoRegistrationNumber}</div>
                                        }
                                    </td>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className="badge" style={{ background: '#f0f0f0' }}>{u.role}</span></td>
                                    <td>{u.city ? `${u.city}, ${u.state}` : 'N/A'}</td>
                                    <td>
                                        {u.verified ? (
                                            <span className="badge badge-available">Verified</span>
                                        ) : (
                                            <span className="badge" style={{ background: '#FFF3E0', color: '#E65100' }}>Pending</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <button
                                                className="btn btn-outline"
                                                style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                                                onClick={() => setSelectedUser(u)}
                                            >
                                                <Eye size={14} style={{ marginRight: '4px' }} /> Details
                                            </button>
                                            {!u.verified && u.role !== 'ADMIN' && (
                                                <button
                                                    onClick={() => handleVerify(u.id)}
                                                    className="btn btn-primary"
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                >
                                                    <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verify
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Verification Detail Modal */}
            {selectedUser && (
                <div className="modal-overlay animate-fade">
                    <div className="modal-content" style={{ maxWidth: '500px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                            <h2>Partner Verification</h2>
                            <button onClick={() => setSelectedUser(null)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}><X /></button>
                        </div>

                        <div style={{ display: 'grid', gap: '16px' }}>
                            <div className="detail-item">
                                <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ORGANIZATION NAME</label>
                                <p style={{ fontSize: '1.1rem', fontWeight: '700' }}>
                                    {selectedUser.role === 'NGO' ? selectedUser.ngoName : (selectedUser.role === 'DONOR' ? selectedUser.restaurantName : 'N/A')}
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className="detail-item">
                                    <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {selectedUser.role === 'NGO' ? 'NGO REG. NO' : 'FSSAI LICENSE'}
                                    </label>
                                    <p style={{ fontWeight: '600', color: 'var(--primary-color)' }}>
                                        {selectedUser.role === 'NGO' ? selectedUser.ngoRegistrationNumber : selectedUser.fssaiLicenseNumber || 'N/A'}
                                    </p>
                                </div>
                                <div className="detail-item">
                                    <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ROLE</label>
                                    <p><span className="badge" style={{ background: '#f0f0f0' }}>{selectedUser.role}</span></p>
                                </div>
                            </div>

                            <div className="detail-item">
                                <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-muted)' }}>CONTACT PERSON</label>
                                <p>{selectedUser.name}</p>
                            </div>

                            <div className="detail-item">
                                <label style={{ fontWeight: '600', fontSize: '0.8rem', color: 'var(--text-muted)' }}>ADDRESS</label>
                                <p>{selectedUser.address}, {selectedUser.city}, {selectedUser.state} - {selectedUser.pincode}</p>
                            </div>

                            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                                <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setSelectedUser(null)}>Close</button>
                                {!selectedUser.verified && selectedUser.role !== 'ADMIN' && (
                                    <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => handleVerify(selectedUser.id)}>
                                        Approve & Verify Partner
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default AdminUserManagement;
