import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const AddListing = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    brand: '',
    model: '',
    processor: '',
    ram: '',
    storage: '',
    screenSize: '',
    condition: 'Good',
    year: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('You can only upload up to 5 images');
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.description || !formData.price || !formData.brand) {
      setError('Please fill in all required fields (Title, Description, Price, Brand)');
      return;
    }

    setLoading(true);

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      images.forEach((image) => {
        formDataToSend.append('images', image);
      });

      // Send request with multipart/form-data
      await axios.post('/api/laptops', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Redirect to my listings page
      navigate('/my-listings');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">Sell Your Laptop</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., MacBook Pro 13-inch 2020"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Describe your laptop in detail..."
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (USD) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="Enter price"
              />
            </div>
            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                placeholder="e.g., Apple, Dell, HP, Lenovo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="model">Model</label>
              <input
                type="text"
                id="model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="e.g., MacBook Pro, XPS 13"
              />
            </div>
            <div className="form-group">
              <label htmlFor="processor">Processor</label>
              <input
                type="text"
                id="processor"
                name="processor"
                value={formData.processor}
                onChange={handleChange}
                placeholder="e.g., Intel i7, Apple M1, AMD Ryzen 5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="ram">RAM</label>
              <input
                type="text"
                id="ram"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                placeholder="e.g., 8GB, 16GB"
              />
            </div>
            <div className="form-group">
              <label htmlFor="storage">Storage</label>
              <input
                type="text"
                id="storage"
                name="storage"
                value={formData.storage}
                onChange={handleChange}
                placeholder="e.g., 256GB SSD, 512GB SSD"
              />
            </div>
            <div className="form-group">
              <label htmlFor="screenSize">Screen Size</label>
              <input
                type="text"
                id="screenSize"
                name="screenSize"
                value={formData.screenSize}
                onChange={handleChange}
                placeholder="e.g., 13.3 inch, 15.6 inch"
              />
            </div>
            <div className="form-group">
              <label htmlFor="condition">Condition</label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="year">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max={new Date().getFullYear()}
                placeholder="e.g., 2020"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactEmail">Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Leave blank to use your account email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="contactPhone">Contact Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Leave blank to use your account phone"
              />
            </div>
            <div className="form-group">
              <label htmlFor="images">Images (up to 5)</label>
              <input
                type="file"
                id="images"
                name="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
              {images.length > 0 && (
                <div className="image-preview">
                  {images.map((image, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Creating Listing...' : 'Create Listing'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
