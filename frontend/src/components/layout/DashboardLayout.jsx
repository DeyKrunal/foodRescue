import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from '../Navbar';

const DashboardLayout = ({ children, role }) => {
    const navigate = useNavigate();
    const userString = sessionStorage.getItem('user');
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
        <div className="dashboard-layout">
            <Navbar />
            <div className="dashboard-container">
                <Sidebar role={user.role} />
                <main className="dashboard-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
