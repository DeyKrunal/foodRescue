import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getNgoVolunteers, approveVolunteer, rejectVolunteer } from '../../../services/api';
import { UserCheck, UserX } from 'lucide-react';
import Swal from 'sweetalert2';

const NGOVolunteers = () => {
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchVolunteers = async () => {
        try {
            const res = await getNgoVolunteers(user.id);
            setVolunteers(res.data);
        } catch (err) {
            console.error("Failed to fetch volunteers", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchVolunteers();
    }, [user?.id]);

    const handleAction = async (id, action) => {
        try {
            if (action === 'approve') await approveVolunteer(id);
            else await rejectVolunteer(id);
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Volunteer ${action}ed successfully.`,
                timer: 1500,
                showConfirmButton: false
            });
            fetchVolunteers();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to update volunteer status.'
            });
        }
    };

    return (
        <DashboardLayout role="NGO">
            <div className="animate-fade">
                <div style={{ marginBottom: '32px' }}>
                    <h1>Volunteer Management</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Approve or manage volunteers linked to your organization.</p>
                </div>

                {loading ? (
                    <p>Loading volunteers...</p>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {volunteers.length > 0 ? volunteers.map(vol => (
                                    <tr key={vol.id}>
                                        <td style={{ fontWeight: '600' }}>{vol.name}</td>
                                        <td>{vol.email}</td>
                                        <td>{vol.mobileNumber}</td>
                                        <td>
                                            <span className={`badge ${
                                                vol.volunteerStatus === 'APPROVED' ? 'badge-available' : 
                                                vol.volunteerStatus === 'REJECTED' ? 'badge-rejected' : 'badge-requested'
                                            }`}>
                                                {vol.volunteerStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                {vol.volunteerStatus !== 'APPROVED' && (
                                                    <button 
                                                        className="btn btn-primary" 
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        onClick={() => handleAction(vol.id, 'approve')}
                                                    >
                                                        <UserCheck size={14} style={{ marginRight: '4px' }} /> Approve
                                                    </button>
                                                )}
                                                {vol.volunteerStatus !== 'REJECTED' && (
                                                    <button 
                                                        className="btn btn-outline" 
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#d33', borderColor: '#d33' }}
                                                        onClick={() => handleAction(vol.id, 'reject')}
                                                    >
                                                        <UserX size={14} style={{ marginRight: '4px' }} /> Reject
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No volunteers found for your NGO ID.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default NGOVolunteers;
