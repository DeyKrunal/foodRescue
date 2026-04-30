import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';
import Swal from 'sweetalert2';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
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
            await api.post(`/admin/users/${id}/verify`);
            Swal.fire({
                icon: 'success',
                title: 'Verified!',
                text: 'Organization verified successfully!',
                confirmButtonColor: 'var(--primary-color)'
            });
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
                                        {!u.verified && u.role !== 'ADMIN' && (
                                            <button
                                                onClick={() => handleVerify(u.id)}
                                                className="btn btn-primary"
                                                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                            >
                                                Verify
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

export default AdminUserManagement;
