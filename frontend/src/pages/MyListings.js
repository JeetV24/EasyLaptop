import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const MyListings = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      const response = await axios.get('/api/laptops/user/my-listings');
      setLaptops(response.data);
    } catch (error) {
      console.error('Error fetching my listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await axios.delete(`/api/laptops/${id}`);
      fetchMyListings(); // Refresh the list
    } catch (error) {
      alert('Failed to delete listing');
      console.error('Error deleting laptop:', error);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 className="page-title" style={{ margin: 0 }}>My Listings</h1>
          <Link to="/add-listing" className="btn btn-primary">
            + Add New Listing
          </Link>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : laptops.length === 0 ? (
          <div className="empty-state">
            <h3>You haven't listed any laptops yet</h3>
            <p>Start selling by creating your first listing!</p>
            <Link to="/add-listing" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Create Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid">
            {laptops.map((laptop) => (
              <div key={laptop._id} className="card">
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
                  <p className="card-text">{laptop.brand} {laptop.model && `• ${laptop.model}`}</p>
                  <p className="card-text" style={{ marginTop: '10px' }}>
                    Status: <strong>{laptop.status}</strong>
                  </p>
                  <div className="card-price">₹{laptop.price}</div>
                </div>
                <div className="card-footer">
                  <Link to={`/listing/${laptop._id}`} className="btn btn-primary" style={{ padding: '8px 15px' }}>
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(laptop._id)}
                    className="btn btn-danger"
                    style={{ padding: '8px 15px' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyListings;
