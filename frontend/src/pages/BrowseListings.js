import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../App.css';

const BrowseListings = () => {
  const { user } = useAuth();
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
    collegeFilter: 'all', // 'all' or 'myCollege'
  });

  useEffect(() => {
    const fetchLaptops = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.brand) params.append('brand', filters.brand);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.condition) params.append('condition', filters.condition);
        if (filters.collegeFilter === 'myCollege') {
          params.append('collegeFilter', 'myCollege');
        }

        const response = await axios.get(`/api/laptops?${params.toString()}`);
        setLaptops(response.data);
      } catch (error) {
        console.error('Error fetching laptops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptops();
  }, [filters, user]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Browse Laptops</h1>

        {/* Filters */}
        <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
          <h3 style={{ marginBottom: '20px' }}>Search & Filters</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search by title, brand..."
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                name="brand"
                value={filters.brand}
                onChange={handleFilterChange}
                placeholder="Filter by brand..."
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="number"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                placeholder="Min Price"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="number"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                placeholder="Max Price"
                style={{ width: '100%' }}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                style={{ width: '100%' }}
              >
                <option value="">All Conditions</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            {user && user.college && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <select
                  name="collegeFilter"
                  value={filters.collegeFilter}
                  onChange={handleFilterChange}
                  style={{ width: '100%' }}
                >
                  <option value="all">All Colleges</option>
                  <option value="myCollege">My College Only ({user.college})</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Laptop Listings */}
        {loading ? (
          <div className="loading">Loading...</div>
        ) : laptops.length === 0 ? (
          <div className="empty-state">
            <h3>No laptops found</h3>
            <p>Try adjusting your filters or check back later</p>
          </div>
        ) : (
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
                    <p className="card-text">{laptop.brand} {laptop.model && `• ${laptop.model}`}</p>
                    <p className="card-text" style={{ fontSize: '0.9rem' }}>
                      {laptop.processor && `${laptop.processor} • `}
                      {laptop.ram && `${laptop.ram} RAM • `}
                      {laptop.storage && laptop.storage}
                    </p>
                    <p className="card-text" style={{ marginTop: '10px' }}>
                      Condition: <strong>{laptop.condition}</strong>
                    </p>
                    {laptop.seller && laptop.seller.college && (
                      <p className="card-text" style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                        🎓 {laptop.seller.college}
                      </p>
                    )}
                    <div className="card-price">₹{laptop.price}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseListings;
