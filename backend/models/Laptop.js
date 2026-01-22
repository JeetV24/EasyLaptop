const mongoose = require('mongoose');

// Laptop Schema - Stores laptop listing information
const laptopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: [0, 'Price cannot be negative'],
    },
    images: [
      {
        type: String, // Path to image file
      },
    ],
    // Laptop specifications
    brand: {
      type: String,
      required: [true, 'Please provide a brand'],
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    processor: {
      type: String,
      trim: true,
    },
    ram: {
      type: String, // e.g., "8GB", "16GB"
      trim: true,
    },
    storage: {
      type: String, // e.g., "256GB SSD", "512GB SSD"
      trim: true,
    },
    screenSize: {
      type: String, // e.g., "13.3 inch", "15.6 inch"
      trim: true,
    },
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    year: {
      type: Number,
      min: [2000, 'Year must be after 2000'],
    },
    // Seller information
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Contact information
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    // Listing status
    status: {
      type: String,
      enum: ['active', 'sold', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create index for search functionality
laptopSchema.index({ title: 'text', description: 'text', brand: 'text' });

// Export Laptop model
module.exports = mongoose.model('Laptop', laptopSchema);
