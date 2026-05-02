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
        { name: 'Dashboard', path: '/ngo/dashboard' },
        { name: 'Rescue Food', path: '/rescue-food' },
        { name: 'Request History', path: '/ngo/history' },
        { name: 'Manage Volunteers', path: '/dashboard/ngo/volunteers' },
    ];

    const volunteerLinks = [
        { name: 'Overview', path: '/volunteer/dashboard' },
        { name: 'Active Deliveries', path: '/volunteer/dashboard' },
    ];

    const adminLinks = [
        { name: 'System Stats', path: '/admin/dashboard' },
        { name: 'Partner Verification', path: '/admin/users' },
        { name: 'Donation Audit', path: '/admin/donations' },
    ];

    const links = role === 'DONOR' ? donorLinks :
                  role === 'NGO' ? ngoLinks :
                  role === 'VOLUNTEER' ? volunteerLinks :
                  adminLinks;

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
