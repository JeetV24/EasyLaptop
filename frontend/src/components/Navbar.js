import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          💻 Easy Laptop
        </Link>
        <div className="navbar-links">
          <Link to="/">Home</Link>
          <Link to="/browse">Browse Laptops</Link>
          {user ? (
            <>
              {(user.userType === 'seller' || user.userType === 'both') && (
                <>
                  <Link to="/add-listing">Sell Laptop</Link>
                  <Link to="/my-listings">My Listings</Link>
                </>
              )}
              <Link to="/profile">Profile</Link>
              <span>
                Hello, {user.name} 
                {user.userType && (
                  <span style={{ fontSize: '0.85rem', marginLeft: '5px', opacity: 0.9 }}>
                    ({user.userType === 'seller' ? 'Seller' : user.userType === 'customer' ? 'Buyer' : 'Buyer & Seller'})
                  </span>
                )}
              </span>
              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '5px 15px' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
