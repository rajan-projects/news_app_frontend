import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import client from '../config/encore';
import { clearAuthData, getAuthToken } from '../utils/auth';

const Navbar: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = getAuthToken();
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = async () => {
    try {
      await client.users.logout();
      clearAuthData();
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <div className="nav-brand">
          <Link to="/">NewsApp</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/news">News</Link></li>
        </ul>
        <div className="nav-auth">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          ) : (
            <>
              <Link to="/signin" className="btn-auth">Sign In</Link>
              <Link to="/signup" className="btn-auth">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
