import React, { useState, useEffect } from 'react';
import { getAvailableDeliveries, assignDelivery } from '../../../services/api';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Package, MapPin, Navigation, Search } from 'lucide-react';
import Swal from 'sweetalert2';

const AvailableMissions = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchData = async () => {
        setLoading(true);
        try {
            const targetNgoId = user?.affiliatedNgoId || user?.ngoId || user?.id;
            const res = await getAvailableDeliveries(targetNgoId);
            setDeliveries(res.data);
        } catch (err) {
            console.error("Failed to fetch deliveries", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAccept = async (deliveryId) => {
        try {
            await assignDelivery(deliveryId, user.id);
            Swal.fire({
                icon: 'success',
                title: 'Mission Accepted!',
                text: 'Go to My Deliveries to start tracking.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchData();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: "Could not accept delivery. It might have been taken by another volunteer.",
                confirmButtonColor: '#d33'
            });
        }
    };

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="animate-fade">
                <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Available Missions</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Find food rescue opportunities near your location.</p>
                    </div>
                    <div style={{ background: 'var(--primary-color)', color: 'white', padding: '8px 16px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: '600' }}>
                        {deliveries.length} Available
                    </div>
                </div>

                <div className="listing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
                    {deliveries.length > 0 ? deliveries.map(delivery => (
                        <div key={delivery.id} className="food-card" style={{ 
                            background: 'white', 
                            padding: '24px', 
                            borderRadius: '20px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                            border: '1px solid #f1f5f9'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <span className="badge" style={{ background: '#e7f5ff', color: '#1864ab', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: '700' }}>
                                    RESCUE MISSION
                                </span>
                                <Package size={20} color="var(--primary-color)" />
                            </div>
                            
                            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>{delivery.request?.donation.foodItem}</h3>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <MapPin size={16} color="#64748b" style={{ marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Pickup From</p>
                                        <p style={{ fontSize: '0.9rem' }}>{delivery.pickupPoint}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Navigation size={16} color="#64748b" style={{ marginTop: '2px' }} />
                                    <div>
                                        <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Deliver To</p>
                                        <p style={{ fontSize: '0.9rem' }}>{delivery.deliveryPoint}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                className="btn btn-primary" 
                                style={{ width: '100%', padding: '12px', borderRadius: '12px' }} 
                                onClick={() => handleAccept(delivery.id)}
                            >
                                Accept Mission
                            </button>
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🍃</div>
                            <h3>All Caught Up!</h3>
                            <p style={{ color: 'var(--text-muted)' }}>There are no pending rescue missions at the moment. Check back later!</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AvailableMissions;
