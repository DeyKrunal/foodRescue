import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Package, MapPin, Navigation, CheckCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const VolunteerDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        setLoading(true);
        try {
            const availableRes = await api.get('/deliveries/available');
            const myTasksRes = await api.get(`/deliveries/my-tasks/${user.id}`);
            setDeliveries(availableRes.data);
            setMyTasks(myTasksRes.data);
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
            await api.post(`/deliveries/${deliveryId}/assign`, {
                volunteerId: user.id
            });
            Swal.fire({
                icon: 'success',
                title: 'Task accepted!',
                text: 'You can now view this in My Tasks.',
                timer: 2000,
                showConfirmButton: false
            });
            fetchData();
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: "Failed to accept delivery",
                confirmButtonColor: '#d33'
            });
        }
    };

    const handleTrack = async (deliveryId) => {
        // Mocking GPS update for "Porter-like" feel
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    await api.post(`/deliveries/${deliveryId}/track`, [longitude, latitude]);
                    
                    const newStatus = (myTasks.find(d => d.id === deliveryId).status === 'ASSIGNED' ? 'Picked Up' : 'In Transit');
                    
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true
                    });
                    
                    Toast.fire({
                        icon: 'success',
                        title: `Location Updated! Status: ${newStatus}`
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
            await api.post(`/deliveries/${deliveryId}/complete`);
            Swal.fire({
                icon: 'success',
                title: 'Delivered!',
                text: 'Thank you for your service!',
                timer: 2000,
                showConfirmButton: false
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    if (user.volunteerStatus !== 'APPROVED') {
        return (
            <DashboardLayout role="VOLUNTEER">
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    minHeight: '60vh',
                    textAlign: 'center',
                    padding: '40px'
                }}>
                    <div style={{ 
                        width: '80px', 
                        height: '80px', 
                        background: 'rgba(230, 126, 34, 0.1)', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '24px',
                        color: 'var(--accent-color)'
                    }}>
                        <Clock size={40} />
                    </div>
                    <h2 style={{ marginBottom: '16px' }}>Account Pending Approval</h2>
                    <p style={{ maxWidth: '400px', margin: '0 auto 32px', color: 'var(--text-muted)' }}>
                        Your account is linked to NGO ID: <strong>{user.affiliatedNgoId}</strong>. 
                        Please wait for them to approve your application before you can start accepting delivery missions.
                    </p>
                    <button className="btn btn-outline" onClick={() => window.location.reload()}>
                        Check Status Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="VOLUNTEER">
            <div className="volunteer-dashboard animate-fade">
                <div style={{ marginBottom: '32px' }}>
                    <h1>Volunteer Dashboard</h1>
                    <p>Help bridge the gap. Pick up food and deliver it to those in need.</p>
                </div>

                <div className="stats-row">
                    <div className="stat-mini-card">
                        <h4>Available Deliveries</h4>
                        <p>{deliveries.length}</p>
                    </div>
                    <div className="stat-mini-card">
                        <h4>My Active Tasks</h4>
                        <p>{myTasks.filter(t => t.status !== 'DELIVERED').length}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '32px' }}>
                    <section>
                        <h3>Available Near You</h3>
                        <div className="listing-grid">
                            {deliveries.length > 0 ? deliveries.map(delivery => (
                                <div key={delivery.id} className="food-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span className="badge badge-available">New Rescue</span>
                                        <Package size={20} color="var(--primary-color)" />
                                    </div>
                                    <h4>{delivery.request?.donation.foodItem}</h4>
                                    <div style={{ margin: '16px 0', fontSize: '0.9rem' }}>
                                        <p><MapPin size={14} /> <strong>From:</strong> {delivery.pickupPoint}</p>
                                        <p><Navigation size={14} /> <strong>To:</strong> {delivery.deliveryPoint}</p>
                                    </div>
                                    <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => handleAccept(delivery.id)}>
                                        Accept Mission
                                    </button>
                                </div>
                            )) : <p>All caught up! No pending deliveries.</p>}
                        </div>
                    </section>

                    <section>
                        <h3>My Active Missions</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '40px' }}>
                            {myTasks.filter(t => t.status !== 'DELIVERED').map(task => (
                                <div key={task.id} className="stat-mini-card" style={{ borderLeft: '4px solid var(--accent-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                        <span style={{ fontWeight: '600', color: 'var(--accent-color)' }}>{task.status}</span>
                                        <button className="btn-text" onClick={() => handleTrack(task.id)}>📍 Update GPS</button>
                                    </div>
                                    <h4>{task.request?.donation.foodItem}</h4>
                                    <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Tracking: {task.currentCoordinates ? `${task.currentCoordinates[1].toFixed(4)}, ${task.currentCoordinates[0].toFixed(4)}` : 'Wait for update'}</p>
                                    
                                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                                        {task.status === 'ASSIGNED' ? (
                                            <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => handleTrack(task.id)}>Pick Up</button>
                                        ) : (
                                            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleComplete(task.id)}>
                                                <CheckCircle size={16} style={{ marginRight: '8px' }} /> Mark Delivered
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {myTasks.filter(t => t.status !== 'DELIVERED').length === 0 && <p>No active missions.</p>}
                        </div>
                    </section>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VolunteerDashboard;
