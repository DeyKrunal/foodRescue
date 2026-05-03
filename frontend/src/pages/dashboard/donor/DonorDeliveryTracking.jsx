import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { getDonorDeliveries, verifyPickupOtp } from '../../../services/api';
import { Truck, MapPin, ShieldCheck, User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const DonorDeliveryTracking = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchData = async () => {
        try {
            const res = await getDonorDeliveries(user.id);
            setDeliveries(res.data);
        } catch (err) {
            console.error("Failed to fetch donor deliveries", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchData();
    }, [user?.id]);

    const handleVerifyOtp = async (deliveryId) => {
        const { value: otp } = await Swal.fire({
            title: 'Verify Pickup OTP',
            input: 'text',
            inputLabel: 'Ask the volunteer for their 6-digit OTP',
            inputPlaceholder: 'Enter OTP here',
            showCancelButton: true,
            confirmButtonColor: 'var(--primary-color)'
        });

        if (otp) {
            try {
                await verifyPickupOtp(deliveryId, otp);
                Swal.fire('Success!', 'OTP Verified. Pickup Authorized.', 'success');
                fetchData();
            } catch (err) {
                Swal.fire('Error', 'Invalid OTP code', 'error');
            }
        }
    };

    return (
        <DashboardLayout role="DONOR">
            <div className="animate-fade">
                <div style={{ marginBottom: '32px' }}>
                    <h1>Pickup Tracking</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Monitor food rescues being picked up from your location.</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
                ) : (
                    <div className="data-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Food Item</th>
                                    <th>NGO</th>
                                    <th>Volunteer</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.length > 0 ? deliveries.map(delivery => (
                                    <tr key={delivery.id}>
                                        <td style={{ fontWeight: '600' }}>{delivery.request?.donation?.foodItem}</td>
                                        <td>{delivery.request?.ngo?.ngoName || delivery.request?.ngo?.name}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <User size={14} color="#64748b" />
                                                {delivery.volunteer?.name || 'Waiting for assignment'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`badge ${delivery.status === 'DELIVERED' ? 'badge-available' : 'badge-requested'}`}>
                                                {delivery.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                {delivery.status === 'ASSIGNED' && (
                                                    <button 
                                                        className="btn btn-primary" 
                                                        style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                                        onClick={() => handleVerifyOtp(delivery.id)}
                                                    >
                                                        Verify OTP
                                                    </button>
                                                )}
                                                <Link 
                                                    to={`/delivery/${delivery.id}`} 
                                                    className="btn btn-outline" 
                                                    style={{ padding: '6px 12px', fontSize: '0.8rem', textDecoration: 'none' }}
                                                >
                                                    Track
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                            No active pickups currently scheduled.
                                        </td>
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

export default DonorDeliveryTracking;
