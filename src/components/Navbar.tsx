import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div>
        <div className="nav-brand">
          <Link to="/">NewsApp</Link>
        </div>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/news">News</Link></li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
