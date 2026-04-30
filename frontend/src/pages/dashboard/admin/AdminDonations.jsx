import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';

const AdminDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = async () => {
        try {
            // Reusing admin/stats logic or adding a dedicated endpoint if available
            // Base on AdminController, we have @GetMapping("/donations")
            const res = await api.get('/admin/donations');
            setDonations(res.data);
        } catch (err) {
            console.error("Error fetching donations", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    return (
        <DashboardLayout role="ADMIN">
            <div className="animate-fade">
                <h1 style={{ marginBottom: '32px' }}>Donation Management</h1>

                {loading ? (
                    <p>Loading donations...</p>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Food Item</th>
                                    <th>Donor</th>
                                    <th>Quantity</th>
                                    <th>Status</th>
                                    <th>Posted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {donations.length > 0 ? donations.map(d => (
                                    <tr key={d.id}>
                                        <td style={{ fontWeight: '600' }}>{d.foodItem}</td>
                                        <td>{d.donor?.restaurantName || d.donor?.name || 'N/A'}</td>
                                        <td>{d.quantity}</td>
                                        <td>
                                            <span className={`badge ${
                                                d.status === 'AVAILABLE' ? 'badge-available' :
                                                d.status === 'RESCUED' ? 'badge-success' : 'badge-requested'
                                            }`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td>{new Date(d.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>No donations found.</td>
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

export default AdminDonations;
