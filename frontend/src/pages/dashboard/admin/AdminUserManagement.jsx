import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';

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
            alert("Organization verified successfully!");
            fetchUsers();
        } catch (err) {
            alert("Verification failed.");
        }
    };

    return (
        <DashboardLayout role="ADMIN">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Organization Management</h1>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id}>
                                    <td style={{ fontWeight: '500' }}>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td><span className="badge" style={{ background: '#f0f0f0' }}>{u.role}</span></td>
                                    <td>
                                        {u.verified ? (
                                            <span className="badge badge-available">Verified</span>
                                        ) : (
                                            <span className="badge" style={{ background: '#FFF3E0', color: '#E65100' }}>Pending</span>
                                        )}
                                    </td>
                                    <td>
                                        {!u.verified && (
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
