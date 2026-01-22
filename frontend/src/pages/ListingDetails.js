import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const ListingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        const response = await axios.get(`/api/laptops/${id}`);
        setLaptop(response.data);
      } catch (error) {
        setError('Laptop not found');
        console.error('Error fetching laptop:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptop();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await axios.delete(`/api/laptops/${id}`);
      navigate('/my-listings');
    } catch (error) {
      alert('Failed to delete listing');
      console.error('Error deleting laptop:', error);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  if (error || !laptop) {
    return (
      <div className="page">
        <div className="container">
          <div className="empty-state">
            <h3>{error || 'Laptop not found'}</h3>
            <Link to="/browse" className="btn btn-primary" style={{ marginTop: '20px' }}>
              Browse Laptops
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && laptop.seller._id === user.id;

  return (
    <div className="page">
      <div className="container">
        <Link to="/browse" className="btn btn-secondary" style={{ marginBottom: '20px' }}>
          ← Back to Browse
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop: '20px' }}>
          {/* Left Column - Images */}
          <div>
            {laptop.images && laptop.images.length > 0 ? (
              <div>
                <img
                  src={`http://localhost:5000${laptop.images[0]}`}
                  alt={laptop.title}
                  style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23757575" font-size="20">No Image</text></svg>';
                  }}
                />
                {laptop.images.length > 1 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '10px' }}>
                    {laptop.images.slice(1).map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000${image}`}
                        alt={`${laptop.title} ${index + 2}`}
                        style={{ width: '100%', borderRadius: '5px', cursor: 'pointer' }}
                        onClick={() => window.open(`http://localhost:5000${image}`, '_blank')}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <img
                src={
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400"><rect width="100%" height="100%" fill="%23e0e0e0"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23757575" font-size="20">No Image</text></svg>'
                }
                alt={laptop.title}
                style={{ width: '100%', borderRadius: '8px' }}
              />
            )}
          </div>

          {/* Right Column - Details */}
          <div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>{laptop.title}</h1>
            <div style={{ fontSize: '2rem', color: '#007bff', fontWeight: 'bold', marginBottom: '30px' }}>
              ₹{laptop.price}
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Specifications</h3>
              <table style={{ width: '100%' }}>
                <tbody>
                  {laptop.brand && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Brand:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.brand}</td>
                    </tr>
                  )}
                  {laptop.model && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Model:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.model}</td>
                    </tr>
                  )}
                  {laptop.processor && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Processor:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.processor}</td>
                    </tr>
                  )}
                  {laptop.ram && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>RAM:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.ram}</td>
                    </tr>
                  )}
                  {laptop.storage && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Storage:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.storage}</td>
                    </tr>
                  )}
                  {laptop.screenSize && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Screen Size:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.screenSize}</td>
                    </tr>
                  )}
                  <tr>
                    <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Condition:</td>
                    <td style={{ padding: '8px 0' }}>{laptop.condition}</td>
                  </tr>
                  {laptop.year && (
                    <tr>
                      <td style={{ padding: '8px 0', fontWeight: 'bold' }}>Year:</td>
                      <td style={{ padding: '8px 0' }}>{laptop.year}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Description</h3>
              <p style={{ lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{laptop.description}</p>
            </div>

            <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ marginBottom: '15px' }}>Seller Information</h3>
              <p><strong>Name:</strong> {laptop.seller.name}</p>
              {laptop.seller.college && <p><strong>College:</strong> {laptop.seller.college}</p>}
              {laptop.contactEmail && (
                <p>
                  <strong>Email:</strong>{' '}
                  <a href={`mailto:${laptop.contactEmail}`}>{laptop.contactEmail}</a>
                </p>
              )}
              {laptop.contactPhone && (
                <p>
                  <strong>Phone:</strong>{' '}
                  <a href={`tel:${laptop.contactPhone}`}>{laptop.contactPhone}</a>
                </p>
              )}
            </div>

            {isOwner && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/edit-listing/${id}`} className="btn btn-primary">
                  Edit Listing
                </Link>
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete Listing
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
