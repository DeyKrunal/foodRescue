import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import api from '../../../services/api';

const DonorMyDonations = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const userString = sessionStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const res = await api.get(`/donor/${user.id}/donations`);
                setDonations(res.data);
            } catch (err) {
                console.error("Error fetching donations", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, [user.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'AVAILABLE': return '#2e7d32';
            case 'RESERVED': return '#1976d2';
            case 'COLLECTED': return '#757575';
            default: return 'var(--text-muted)';
        }
    };

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                    <h1>My Donations</h1>
                    <a href="/donate-food" className="btn btn-primary">Add New Food</a>
                </div>

                <div className="data-table-container">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Food Item</th>
                                <th>Quantity</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Listed Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.length > 0 ? donations.map(d => (
                                <tr key={d.id}>
                                    <td style={{ fontWeight: '500' }}>{d.foodItem}</td>
                                    <td>{d.quantity}</td>
                                    <td>{d.foodType}</td>
                                    <td>
                                        <span className="badge" style={{ background: `${getStatusColor(d.status)}15`, color: getStatusColor(d.status) }}>
                                            {d.status}
                                        </span>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{new Date(d.createdAt).toLocaleDateString()}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', padding: '48px' }}>No donations found. List your first surplus food item today!</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DonorMyDonations;
