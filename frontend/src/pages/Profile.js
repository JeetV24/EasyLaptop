import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const Profile = () => {
  const { user, fetchUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    college: '',
    userType: 'both',
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        college: user.college || '',
        userType: user.userType || 'both',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      await axios.put('/api/users/profile', formData);
      setMessage('Profile updated successfully!');
      fetchUser(); // Refresh user data
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getUserTypeLabel = (userType) => {
    switch (userType) {
      case 'seller':
        return 'Seller';
      case 'customer':
        return 'Customer';
      case 'both':
        return 'Buyer & Seller';
      default:
        return 'Buyer & Seller';
    }
  };

  if (!user) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">My Profile</h2>
          {message && (
            <div className={message.includes('success') ? 'success-message' : 'error-message'}>
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={user.email}
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
              />
              <small style={{ color: '#666' }}>Email cannot be changed</small>
            </div>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="college">College/University</label>
              <input
                type="text"
                id="college"
                name="college"
                value={formData.college}
                onChange={handleChange}
                placeholder="Enter your college/university name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="userType">Account Type</label>
              <select
                id="userType"
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px', fontSize: '16px' }}
              >
                <option value="both">Buy & Sell Laptops</option>
                <option value="seller">Sell Laptops Only</option>
                <option value="customer">Buy Laptops Only</option>
              </select>
              <small style={{ color: '#666', fontSize: '14px' }}>
                Current: {getUserTypeLabel(formData.userType)}
              </small>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
