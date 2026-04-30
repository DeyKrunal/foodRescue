import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getDeliveryDetails } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { Package, MapPin, Navigation, Clock, CheckCircle, ShieldCheck } from 'lucide-react';

const DeliveryDetails = () => {
    const { id } = useParams();
    const [delivery, setDelivery] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = async () => {
        try {
            const res = await getDeliveryDetails(id);
            setDelivery(res.data);
        } catch (err) {
            console.error("Error fetching delivery details", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetails();
        const interval = setInterval(fetchDetails, 10000); // Poll for updates
        return () => clearInterval(interval);
    }, [id]);

    if (loading) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Loading delivery details...</div>;
    if (!delivery) return <div className="container" style={{ padding: '100px', textAlign: 'center' }}>Delivery not found.</div>;

    const statuses = ['ASSIGNED', 'OTP_VERIFIED', 'IN_TRANSIT', 'DELIVERED'];
    const currentIndex = statuses.indexOf(delivery.status);

    return (
        <>
            <Navbar />
            <div className="container animate-fade" style={{ paddingTop: '120px', paddingBottom: '80px', maxWidth: '800px' }}>
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>← Back to Dashboard</Link>
                    <span className="badge badge-available">ID: {delivery.id.substring(0, 8)}</span>
                </div>

                <div className="auth-card" style={{ padding: '40px', background: '#fff', borderRadius: '16px', boxShadow: 'var(--shadow-subtle)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                        <div style={{ width: '64px', height: '64px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--primary-color)' }}>
                            <Package size={32} />
                        </div>
                        <h1 style={{ marginBottom: '8px' }}>Rescue Mission in Progress</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time tracking for {delivery.request?.donation.foodItem}</p>
                    </div>

                    {/* Progress Bar (Porter-like) */}
                    <div style={{ marginBottom: '48px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                            {statuses.map((s, i) => (
                                <div key={s} style={{ textAlign: 'center', flex: 1, position: 'relative' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        background: i <= currentIndex ? 'var(--primary-color)' : '#eee',
                                        border: '4px solid #fff',
                                        boxShadow: '0 0 0 1px #ddd',
                                        margin: '0 auto',
                                        zIndex: 2,
                                        position: 'relative',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#fff',
                                        fontSize: '10px'
                                    }}>
                                        {i < currentIndex ? '✓' : ''}
                                    </div>
                                    <p style={{ fontSize: '0.7rem', marginTop: '8px', fontWeight: i <= currentIndex ? '700' : '500', color: i <= currentIndex ? 'var(--text-color)' : '#999' }}>
                                        {s.replace('_', ' ')}
                                    </p>
                                    {i < statuses.length - 1 && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '12px',
                                            left: '50%',
                                            width: '100%',
                                            height: '2px',
                                            background: i < currentIndex ? 'var(--primary-color)' : '#eee',
                                            zIndex: 1
                                        }} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', borderTop: '1px solid #eee', paddingTop: '32px' }}>
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}><MapPin size={16} /> Location Details</h3>
                            <div style={{ marginBottom: '16px' }}>
                                <small style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pickup From</small>
                                <p style={{ fontWeight: '600' }}>{delivery.request?.donation.donor.restaurantName || delivery.request?.donation.donor.name}</p>
                                <p style={{ fontSize: '0.9rem' }}>{delivery.pickupPoint}</p>
                            </div>
                            <div>
                                <small style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deliver To</small>
                                <p style={{ fontWeight: '600' }}>{delivery.request?.ngo.ngoName || delivery.request?.ngo.name}</p>
                                <p style={{ fontSize: '0.9rem' }}>{delivery.deliveryPoint}</p>
                            </div>
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}><ShieldCheck size={16} /> Verification Status</h3>
                            <div style={{ marginBottom: '16px' }}>
                                <small style={{ color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Volunteer</small>
                                <p style={{ fontWeight: '600' }}>{delivery.volunteer?.name}</p>
                                <p style={{ fontSize: '0.9rem' }}>Mobile: {delivery.volunteer?.mobileNumber}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <div style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    background: delivery.status !== 'ASSIGNED' ? '#e8f5ee' : '#f5f5f5',
                                    color: delivery.status !== 'ASSIGNED' ? '#2d6a4f' : '#888',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    OTP Verified: {delivery.status !== 'ASSIGNED' ? 'YES' : 'NO'}
                                </div>
                                <div style={{
                                    padding: '8px 12px',
                                    borderRadius: '8px',
                                    background: delivery.ngoVerified ? '#e8f5ee' : '#f5f5f5',
                                    color: delivery.ngoVerified ? '#2d6a4f' : '#888',
                                    fontSize: '0.85rem',
                                    fontWeight: '600'
                                }}>
                                    NGO Confirmed: {delivery.ngoVerified ? 'YES' : 'NO'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {delivery.currentCoordinates && (
                        <div style={{ marginTop: '32px', background: '#f9fafb', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                            <h3 style={{ fontSize: '1rem', marginBottom: '12px' }}><Navigation size={16} /> Live Tracking</h3>
                            <p style={{ fontSize: '0.9rem' }}>Current Coordinates: <strong>{delivery.currentCoordinates[1].toFixed(4)}, {delivery.currentCoordinates[0].toFixed(4)}</strong></p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Last updated: {new Date(delivery.updatedAt).toLocaleTimeString()}</p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DeliveryDetails;
