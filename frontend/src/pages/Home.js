import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Home = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch recent laptops
    const fetchLaptops = async () => {
      try {
        const response = await axios.get('/api/laptops?status=active');
        // Get only the first 6 laptops
        setLaptops(response.data.slice(0, 6));
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, []);

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '10px', color: 'white', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>💻 Easy Laptop</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '30px' }}>
            Buy and sell used laptops with fellow students
          </p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/browse" className="btn btn-primary" style={{ background: 'white', color: '#667eea', fontSize: '1.1rem', padding: '12px 30px' }}>
              Browse Laptops
            </Link>
            <Link to="/register" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '1.1rem', padding: '12px 30px', border: '2px solid white' }}>
              Get Started
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div style={{ marginBottom: '60px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Why Choose Easy Laptop?</h2>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🎓</div>
              <h3>Student-Friendly</h3>
              <p>Designed specifically for students by students</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💰</div>
              <h3>Affordable Prices</h3>
              <p>Find great deals on quality used laptops</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
              <h3>Safe & Secure</h3>
              <p>Trusted marketplace with verified students</p>
            </div>
          </div>
        </div>

        {/* Recent Listings */}
        <div>
          <h2 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '2rem' }}>Recent Listings</h2>
          {loading ? (
            <div className="loading">Loading...</div>
          ) : laptops.length === 0 ? (
            <div className="empty-state">
              <h3>No laptops available yet</h3>
              <p>Be the first to list a laptop!</p>
            </div>
          ) : (
            <>
              <div className="grid">
                {laptops.map((laptop) => (
                  <Link key={laptop._id} to={`/listing/${laptop._id}`} style={{ textDecoration: 'none' }}>
                    <div className="card">
                      {laptop.images && laptop.images.length > 0 ? (
                        <img
                          src={`http://localhost:5000${laptop.images[0]}`}
                          alt={laptop.title}
                          className="card-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23757575" font-size="16">No Image</text></svg>';
                          }}
                        />
                      ) : (
                        <img
                          src={
                            'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23757575" font-size="16">No Image</text></svg>'
                          }
                          alt={laptop.title}
                          className="card-image"
                        />
                      )}
                      <div className="card-body">
                        <h3 className="card-title">{laptop.title}</h3>
                        <p className="card-text">{laptop.brand} • {laptop.condition}</p>
                        <div className="card-price">₹{laptop.price}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <Link to="/browse" className="btn btn-primary">
                  View All Listings
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
