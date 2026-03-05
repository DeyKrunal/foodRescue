import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userString = sessionStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    document.cookie = "user_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/login');
  };

  const dashboardPath = user ? (
    user.role === 'DONOR' ? '/donor/dashboard' :
      user.role === 'NGO' ? '/ngo/dashboard' : '/admin/dashboard'
  ) : '/';

  // Check if current path belongs to a dashboard
  const isDashboardActive = user && (
    location.pathname.startsWith('/donor/') ||
    location.pathname.startsWith('/ngo/') ||
    location.pathname.startsWith('/admin/') ||
    location.pathname === dashboardPath
  );

  return (
    <nav className="navbar">
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <div className="logo">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2 style={{ color: 'var(--primary-color)', margin: 0, fontSize: '1.4rem', letterSpacing: '-0.02em' }}>FoodRescue</h2>
          </Link>
        </div>
        <ul className="nav-links">
          <li><NavLink to="/about" className={({ isActive }) => isActive ? 'nav-active' : ''}>Our Mission</NavLink></li>
          <li><NavLink to="/how-it-works" className={({ isActive }) => isActive ? 'nav-active' : ''}>How It Works</NavLink></li>
          {user && (
            <li>
              <NavLink
                to={dashboardPath}
                className={isDashboardActive ? 'nav-active dashboard-active' : 'dashboard-link'}
              >
                Dashboard
              </NavLink>
            </li>
          )}
          {user && user.role === 'DONOR' && <li><NavLink to="/donate-food" className={({ isActive }) => isActive ? 'nav-active' : ''}>Donate</NavLink></li>}
          {user && user.role === 'NGO' && <li><NavLink to="/rescue-food" className={({ isActive }) => isActive ? 'nav-active' : ''}>Rescue</NavLink></li>}
        </ul>
        <div className="auth-btns" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Hello, {user.name}</span>
              <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '8px 16px' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Sign in</Link>
              <Link to="/register" className="btn btn-primary">Join the movement</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
