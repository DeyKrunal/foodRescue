import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import HowItWorksPage from './pages/HowItWorksPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DonateFood from './pages/DonateFood';
import RescueFood from './pages/RescueFood';
import VerifyEmail from './pages/VerifyEmail';

// Dashboards
import DonorDashboard from './pages/dashboard/donor/DonorDashboard';
import DonorMyDonations from './pages/dashboard/donor/DonorMyDonations';
import DonorRequests from './pages/dashboard/donor/DonorRequests';

import NGODashboard from './pages/dashboard/ngo/NGODashboard';
import NGORequestHistory from './pages/dashboard/ngo/NGORequestHistory';
import NGOVolunteers from './pages/dashboard/ngo/NGOVolunteers';
import NGOActiveDeliveries from './pages/dashboard/ngo/NGOActiveDeliveries';

import DonorDeliveryTracking from './pages/dashboard/donor/DonorDeliveryTracking';

import AdminDashboard from './pages/dashboard/admin/AdminDashboard';
import AdminUserManagement from './pages/dashboard/admin/AdminUserManagement';
import AdminDonations from './pages/dashboard/admin/AdminDonations';
import VolunteerDashboard from './pages/dashboard/volunteer/VolunteerDashboard';
import AvailableMissions from './pages/dashboard/volunteer/AvailableMissions';
import MyDeliveries from './pages/dashboard/volunteer/MyDeliveries';
import DeliveryDetails from './pages/dashboard/DeliveryDetails';
import Profile from './pages/dashboard/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/partner" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          {/* Action Routes */}
          <Route path="/donate-food" element={<DonateFood />} />
          <Route path="/rescue-food" element={<RescueFood />} />

          {/* Donor Dashboard */}
          <Route path="/donor/dashboard" element={<DonorDashboard />} />
          <Route path="/donor/donations" element={<DonorMyDonations />} />
          <Route path="/donor/requests" element={<DonorRequests />} />
          <Route path="/donor/tracking" element={<DonorDeliveryTracking />} />

          {/* NGO Dashboard */}
          <Route path="/ngo/dashboard" element={<NGODashboard />} />
          <Route path="/ngo/history" element={<NGORequestHistory />} />
          <Route path="/ngo/tracking" element={<NGOActiveDeliveries />} />
          <Route path="/dashboard/ngo/volunteers" element={<NGOVolunteers />} />

          {/* Admin Dashboard */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/donations" element={<AdminDonations />} />
          
          {/* Volunteer Dashboard */}
          <Route path="/volunteer/dashboard" element={<VolunteerDashboard />} />
          <Route path="/volunteer/available" element={<AvailableMissions />} />
          <Route path="/volunteer/deliveries" element={<MyDeliveries />} />
          <Route path="/delivery/:id" element={<DeliveryDetails />} />

          {/* Profile Route */}
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
