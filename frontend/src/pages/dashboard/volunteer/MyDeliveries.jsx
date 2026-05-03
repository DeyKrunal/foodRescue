import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getMyTasks, trackDelivery, completeDelivery, verifyPickupOtp } from '../../../services/api';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Truck, CheckCircle, Navigation, MapPin } from 'lucide-react';
import Swal from 'sweetalert2';

const MyDeliveries = () => {
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await getMyTasks(user.id);
            setMyTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch deliveries", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTrack = async (deliveryId) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await trackDelivery(deliveryId, [longitude, latitude]);
                    
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    
                    Toast.fire({
                        icon: 'success',
                        title: 'Location Updated Live!'
                    });
                    
                    fetchData();
                } catch (err) {
                    console.error(err);
                }
            });
        }
    };

    const handleComplete = async (deliveryId) => {
        try {
            await completeDelivery(deliveryId);
            Swal.fire({
                icon: 'success',
                title: 'Delivered!',
                text: 'Mission accomplished. Thank you!',
                timer: 2000,
                showConfirmButton: false
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const activeTasks = myTasks.filter(t => t.status !== 'DELIVERED');

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="animate-fade">
                <div style={{ marginBottom: '32px' }}>
                    <h1>My Deliveries</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your active missions and track your progress.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px' }}>
                    {activeTasks.length > 0 ? activeTasks.map(task => (
                        <div key={task.id} className="food-card" style={{ 
                            background: 'white', 
                            padding: '28px', 
                            borderRadius: '24px', 
                            boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
                            border: '1px solid #f1f5f9',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <div style={{ 
                                position: 'absolute', 
                                top: 0, 
                                left: 0, 
                                width: '4px', 
                                height: '100%', 
                                background: task.status === 'IN_TRANSIT' ? '#40c057' : '#fab005' 
                            }} />

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                <span style={{ 
                                    padding: '4px 12px', 
                                    borderRadius: '20px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: '700',
                                    background: task.status === 'IN_TRANSIT' ? '#ebfbee' : '#fff9db',
                                    color: task.status === 'IN_TRANSIT' ? '#2b8a3e' : '#f08c00'
                                }}>
                                    {task.status.replace('_', ' ')}
                                </span>
                                <Link to={`/delivery/${task.id}`} style={{ fontSize: '0.8rem', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '600' }}>
                                    Live Map →
                                </Link>
                            </div>

                            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>{task.request?.donation?.foodItem || 'Unknown Item'}</h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <MapPin size={16} color="#94a3b8" />
                                    <p style={{ fontSize: '0.9rem', color: '#475569' }}>{task.pickupPoint}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Navigation size={16} color="#94a3b8" />
                                    <p style={{ fontSize: '0.9rem', color: '#475569' }}>{task.deliveryPoint}</p>
                                </div>
                            </div>

                            {task.status === 'ASSIGNED' && (
                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ background: '#fff9db', padding: '16px', borderRadius: '16px', border: '1px solid #ffe066' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#856404', fontWeight: '700', marginBottom: '8px' }}>Action Required: Pickup Verification</p>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <input 
                                                type="text" 
                                                placeholder="6-digit OTP" 
                                                id={`otp-${task.id}`}
                                                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #ffe066', textAlign: 'center', letterSpacing: '4px', fontWeight: 'bold' }}
                                                maxLength="6"
                                            />
                                            <button 
                                                className="btn btn-primary"
                                                style={{ borderRadius: '10px' }}
                                                onClick={async () => {
                                                    const otp = document.getElementById(`otp-${task.id}`).value;
                                                    if (otp.length !== 6) return Swal.fire('Invalid OTP', 'Enter 6 digits', 'warning');
                                                    try {
                                                        await verifyPickupOtp(task.id, otp);
                                                        Swal.fire('Verified!', 'NGO review pending.', 'success');
                                                        fetchData();
                                                    } catch (err) {
                                                        Swal.fire('Error', 'Invalid OTP', 'error');
                                                    }
                                                }}
                                            >
                                                Verify
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {task.status === 'OTP_VERIFIED' && (
                                <div style={{ marginBottom: '24px', textAlign: 'center', padding: '20px', background: '#e7f5ff', borderRadius: '16px', border: '1px solid #a5d8ff' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#1864ab', fontWeight: '600' }}>Waiting for NGO Approval</p>
                                    <p style={{ fontSize: '0.75rem', color: '#4dabf7', marginTop: '4px' }}>The NGO is verifying the food items.</p>
                                    <button className="btn btn-outline" style={{ marginTop: '12px', fontSize: '0.8rem' }} onClick={fetchData}>Refresh</button>
                                </div>
                            )}

                            {task.status === 'IN_TRANSIT' && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                    <button className="btn btn-outline" style={{ width: '100%' }} onClick={() => handleTrack(task.id)}>
                                        📍 Update GPS Location
                                    </button>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleComplete(task.id)}>
                                        <CheckCircle size={18} style={{ marginRight: '8px' }} /> Mark as Delivered
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '60px', background: '#f8f9fa', borderRadius: '24px' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
                            <h3>No Active Missions</h3>
                            <p style={{ color: 'var(--text-muted)' }}>You don't have any active deliveries. Go to Available Missions to find work!</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MyDeliveries;
