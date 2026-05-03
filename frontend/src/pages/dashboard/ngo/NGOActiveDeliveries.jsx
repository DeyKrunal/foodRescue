import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { ngoVerifyDelivery, getNgoDeliveries } from '../../../services/api';
import { Truck, MapPin, CheckCircle, Clock, Navigation, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const NGOActiveDeliveries = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchDeliveries = async () => {
        try {
            const res = await getNgoDeliveries(user.id);
            setDeliveries(res.data);
        } catch (err) {
            console.error("Failed to fetch NGO deliveries", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchDeliveries();
    }, [user?.id]);

    const handleNgoVerify = async (deliveryId) => {
        try {
            await ngoVerifyDelivery(deliveryId);
            Swal.fire({
                icon: 'success',
                title: 'Pickup Confirmed!',
                text: 'The volunteer is now officially in transit.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchDeliveries();
        } catch (err) {
            Swal.fire('Error', 'Failed to confirm pickup', 'error');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return '#64748b';
            case 'ASSIGNED': return '#007bff';
            case 'OTP_VERIFIED': return '#8b5cf6';
            case 'IN_TRANSIT': return '#f59e0b';
            case 'DELIVERED': return '#10b981';
            default: return '#64748b';
        }
    };

    return (
        <DashboardLayout role="NGO">
            <div className="animate-fade">
                <div style={{ marginBottom: '32px' }}>
                    <h1>Active Rescues</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Track the real-time status of food rescues assigned to your volunteers.</p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading deliveries...</div>
                ) : (
                    <div className="listing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                        {deliveries.length > 0 ? deliveries.map(delivery => (
                            <div key={delivery.id} className="food-card" style={{ background: 'white', padding: '24px', borderRadius: '20px', border: '1px solid #f1f5f9', position: 'relative' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <span className="badge" style={{ 
                                        backgroundColor: `${getStatusColor(delivery.status)}20`, 
                                        color: getStatusColor(delivery.status),
                                        padding: '6px 12px',
                                        fontSize: '0.75rem'
                                    }}>
                                        {delivery.status.replace('_', ' ')}
                                    </span>
                                    <Truck size={20} color={getStatusColor(delivery.status)} />
                                </div>

                                <h3 style={{ marginBottom: '16px' }}>{delivery.request?.donation?.foodItem}</h3>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <MapPin size={16} color="#64748b" />
                                        <span style={{ fontSize: '0.85rem' }}>From: <strong>{delivery.pickupPoint?.split(',')[0]}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <Navigation size={16} color="#64748b" />
                                        <span style={{ fontSize: '0.85rem' }}>To: <strong>{delivery.deliveryPoint?.split(',')[0]}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', marginTop: '8px', padding: '12px', background: '#f8fafc', borderRadius: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {delivery.volunteer?.name?.charAt(0) || '?'}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>VOLUNTEER</p>
                                            <p style={{ fontSize: '0.85rem', margin: 0, fontWeight: '600' }}>{delivery.volunteer?.name || 'Pending Assignment'}</p>
                                        </div>
                                    </div>
                                </div>

                                {delivery.status === 'OTP_VERIFIED' && (
                                    <button 
                                        className="btn btn-primary" 
                                        style={{ width: '100%', marginBottom: '12px', background: '#8b5cf6', borderColor: '#8b5cf6', borderRadius: '12px' }}
                                        onClick={() => handleNgoVerify(delivery.id)}
                                    >
                                        <ShieldCheck size={16} style={{ marginRight: '8px' }} /> Confirm Pickup
                                    </button>
                                )}

                                <Link 
                                    to={`/delivery/${delivery.id}`} 
                                    className="btn btn-outline" 
                                    style={{ width: '100%', textAlign: 'center', textDecoration: 'none', display: 'block', borderRadius: '12px' }}
                                >
                                    Track Live Location
                                </Link>
                            </div>
                        )) : (
                            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '24px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🚛</div>
                                <h3>No Active Deliveries</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Missions will appear here once they are approved by donors.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default NGOActiveDeliveries;
