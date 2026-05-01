import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';

const DashboardLayout = ({ children, role }) => {
    const navigate = useNavigate();
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (role && user.role !== role) {
            navigate('/');
        }
    }, [user, navigate, role]);

    if (!user) return null;

    return (
        <div className="dashboard-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <div className="dashboard-container" style={{ flex: 1, display: 'flex', background: '#f8fafc' }}>
                <Sidebar role={user.role} />
                <main className="dashboard-content" style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
