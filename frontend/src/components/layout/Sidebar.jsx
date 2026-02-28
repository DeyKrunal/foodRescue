import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ role }) => {
    const location = useLocation();

    const donorLinks = [
        { name: 'Overview', path: '/donor/dashboard' },
        { name: 'My Donations', path: '/donor/donations' },
        { name: 'Add Donation', path: '/donate-food' },
        { name: 'NGO Requests', path: '/donor/requests' },
    ];

    const ngoLinks = [
        { name: 'Browse Food', path: '/rescue-food' },
        { name: 'My Requests', path: '/ngo/dashboard' },
        { name: 'History', path: '/ngo/history' },
    ];

    const adminLinks = [
        { name: 'System Overview', path: '/admin/dashboard' },
        { name: 'Manage Users', path: '/admin/users' },
        { name: 'All Donations', path: '/admin/donations' },
    ];

    const links = role === 'DONOR' ? donorLinks : role === 'NGO' ? ngoLinks : adminLinks;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h3>Dashboard</h3>
            </div>
            <nav className="sidebar-nav">
                {links.map((link) => (
                    <Link
                        key={link.path}
                        to={link.path}
                        className={`sidebar-link ${location.pathname === link.path ? 'active' : ''}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
