import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getAvailableDeliveries, getMyTasks, assignDelivery, trackDelivery, completeDelivery, verifyPickupOtp } from '../../../services/api';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { Package, MapPin, Navigation, CheckCircle, Clock, Truck, Users } from 'lucide-react';
import Swal from 'sweetalert2';

const VolunteerDashboard = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(sessionStorage.getItem('user'));

    const fetchData = async () => {
        setLoading(true);
        try {
            const ngoId = user.affiliatedNgoId || user.ngoId;
            if (ngoId) {
                const availableRes = await getAvailableDeliveries(ngoId);
                setDeliveries(availableRes.data);
            }
            const myTasksRes = await getMyTasks(user.id);
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
            await assignDelivery(deliveryId, user.id);
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
                    await trackDelivery(deliveryId, [longitude, latitude]);
                    
                    const task = myTasks.find(d => d.id === deliveryId);
                    const newStatus = (task?.status === 'ASSIGNED' ? 'Picked Up' : 'In Transit');

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
            await completeDelivery(deliveryId);
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


    if (user && user.volunteerStatus !== 'APPROVED') {
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
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Welcome, {user?.name?.split(' ')[0] || 'Volunteer'}!</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>You're making a difference. Here's your impact today.</p>
                </div>

                <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    <div className="stat-mini-card" style={{ background: 'linear-gradient(135deg, #4dabf7 0%, #228be6 100%)', color: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 20px rgba(34, 139, 230, 0.2)' }}>
                        <h4 style={{ opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Available Near You</h4>
                        <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0' }}>{deliveries.length}</p>
                        <Link to="/volunteer/available" style={{ color: 'white', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>View Missions →</Link>
                    </div>
                    <div className="stat-mini-card" style={{ background: 'linear-gradient(135deg, #63e6be 0%, #20c997 100%)', color: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 20px rgba(32, 201, 151, 0.2)' }}>
                        <h4 style={{ opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Active Missions</h4>
                        <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0' }}>{myTasks.filter(t => t.status !== 'DELIVERED').length}</p>
                        <Link to="/volunteer/deliveries" style={{ color: 'white', fontSize: '0.85rem', fontWeight: '600', textDecoration: 'none' }}>Manage Tasks →</Link>
                    </div>
                    <div className="stat-mini-card" style={{ background: 'linear-gradient(135deg, #ff922b 0%, #f76707 100%)', color: 'white', padding: '32px', borderRadius: '24px', boxShadow: '0 10px 20px rgba(247, 103, 7, 0.2)' }}>
                        <h4 style={{ opacity: 0.9, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Rescues</h4>
                        <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: '8px 0' }}>{myTasks.filter(t => t.status === 'DELIVERED').length}</p>
                        <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Lifetime Impact</span>
                    </div>
                </div>

                {/* Affiliation Info Section */}
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', marginBottom: '48px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={28} />
                        </div>
                        <div>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>Affiliated Organization</h4>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.9rem' }}>NGO ID: <strong>{user.affiliatedNgoId}</strong></p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Status:</span>
                        <span className="badge badge-available" style={{ fontSize: '0.8rem', fontWeight: '700' }}>{user.volunteerStatus}</span>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Latest Missions</h3>
                            <Link to="/volunteer/available" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '600' }}>See All</Link>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {deliveries.slice(0, 3).map(delivery => (
                                <div key={delivery.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', borderRadius: '16px', background: '#f8fafc' }}>
                                    <div>
                                        <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{delivery.request?.donation?.foodItem}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#64748b' }}>{delivery.pickupPoint?.split(',')[0] || 'Unknown location'}</p>
                                    </div>
                                    <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }} onClick={() => handleAccept(delivery.id)}>Accept</button>
                                </div>
                            ))}
                            {deliveries.length === 0 && <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>No new missions available.</p>}
                        </div>
                    </div>

                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                            <h3 style={{ margin: 0 }}>Active Task Summary</h3>
                            <Link to="/volunteer/deliveries" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: '600' }}>Manage</Link>
                        </div>
                        {myTasks.filter(t => t.status !== 'DELIVERED').slice(0, 1).map(task => (
                            <div key={task.id}>
                                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fff9db', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f08c00' }}>
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>{task.request?.donation?.foodItem || 'Unknown Item'}</h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Status: <span style={{ fontWeight: '600', color: '#f08c00' }}>{task.status.replace('_', ' ')}</span></p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <p style={{ fontSize: '0.85rem' }}>📍 <strong>From:</strong> {task.pickupPoint}</p>
                                    <p style={{ fontSize: '0.85rem' }}>🎯 <strong>To:</strong> {task.deliveryPoint}</p>
                                </div>
                                <Link to="/volunteer/deliveries" className="btn btn-outline" style={{ width: '100%', marginTop: '20px', textAlign: 'center', textDecoration: 'none', display: 'block' }}>
                                    Go to Task Management
                                </Link>
                            </div>
                        ))}
                        {myTasks.filter(t => t.status !== 'DELIVERED').length === 0 && (
                            <div style={{ textAlign: 'center', padding: '40px' }}>
                                <p style={{ color: '#64748b' }}>No active tasks at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default VolunteerDashboard;
