const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Laptop = require('../models/Laptop');
const User = require('../models/User');
const auth = require('../middleware/auth');
const optionalAuth = require('../middleware/optionalAuth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, 'laptop-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter - only allow images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// @route   GET /api/laptops
// @desc    Get all laptops (with optional search and filter)
// @access  Public (with optional authentication for college filtering)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { search, brand, minPrice, maxPrice, condition, status, collegeFilter } = req.query;

    // Build query object
    const query = {};

    // Search by title, description, or brand
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by brand
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Filter by condition
    if (condition) {
      query.condition = condition;
    }

    // Filter by status (default to active only)
    query.status = status || 'active';

    // Filter by college if requested and user is logged in
    if (collegeFilter === 'myCollege' && req.user && req.user.college) {
      // Find all users with the same college (case-insensitive)
      const usersWithCollege = await User.find({
        college: { $regex: new RegExp(`^${req.user.college}$`, 'i') }
      }).select('_id');
      
      const userIds = usersWithCollege.map(user => user._id);
      
      // Filter laptops to only show those from sellers in the same college
      if (userIds.length > 0) {
        query.seller = { $in: userIds };
      } else {
        // If no users found with this college, return empty array
        return res.json([]);
      }
    }

    // Get laptops and populate seller information
    const laptops = await Laptop.find(query)
      .populate('seller', 'name email phone college')
      .sort({ createdAt: -1 }); // Newest first

    res.json(laptops);
  } catch (error) {
    console.error('Get laptops error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/laptops/:id
// @desc    Get single laptop by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id).populate(
      'seller',
      'name email phone college'
    );

    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    res.json(laptop);
  } catch (error) {
    console.error('Get laptop error:', error);
    if (error.name === 'CastError') {
      return res.status(404).json({ message: 'Laptop not found' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/laptops
// @desc    Create a new laptop listing
// @access  Private (requires authentication)
router.post('/', auth, upload.array('images', 5), async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      brand,
      model,
      processor,
      ram,
      storage,
      screenSize,
      condition,
      year,
      contactEmail,
      contactPhone,
    } = req.body;

    // Validation
    if (!title || !description || !price || !brand) {
      return res.status(400).json({ message: 'Please provide title, description, price, and brand' });
    }

    // Get image paths
    const images = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    // Create new laptop listing
    const laptop = new Laptop({
      title,
      description,
      price: Number(price),
      images,
      brand,
      model,
      processor,
      ram,
      storage,
      screenSize,
      condition,
      year: year ? Number(year) : undefined,
      seller: req.user._id,
      contactEmail: contactEmail || req.user.email,
      contactPhone: contactPhone || req.user.phone,
    });

    await laptop.save();
    await laptop.populate('seller', 'name email phone college');

    res.status(201).json({
      message: 'Laptop listing created successfully',
      laptop,
    });
  } catch (error) {
    console.error('Create laptop error:', error);
    res.status(500).json({ message: 'Server error creating laptop listing' });
  }
});

// @route   PUT /api/laptops/:id
// @desc    Update a laptop listing
// @access  Private (only seller can update)
router.put('/:id', auth, upload.array('images', 5), async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    // Check if user is the seller
    if (laptop.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    // Update fields
    const {
      title,
      description,
      price,
      brand,
      model,
      processor,
      ram,
      storage,
      screenSize,
      condition,
      year,
      contactEmail,
      contactPhone,
      status,
    } = req.body;

    if (title) laptop.title = title;
    if (description) laptop.description = description;
    if (price) laptop.price = Number(price);
    if (brand) laptop.brand = brand;
    if (model) laptop.model = model;
    if (processor) laptop.processor = processor;
    if (ram) laptop.ram = ram;
    if (storage) laptop.storage = storage;
    if (screenSize) laptop.screenSize = screenSize;
    if (condition) laptop.condition = condition;
    if (year) laptop.year = Number(year);
    if (contactEmail) laptop.contactEmail = contactEmail;
    if (contactPhone) laptop.contactPhone = contactPhone;
    if (status) laptop.status = status;

    // Handle new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);
      laptop.images = [...laptop.images, ...newImages];
    }

    await laptop.save();
    await laptop.populate('seller', 'name email phone college');

    res.json({
      message: 'Laptop listing updated successfully',
      laptop,
    });
  } catch (error) {
    console.error('Update laptop error:', error);
    res.status(500).json({ message: 'Server error updating laptop listing' });
  }
});

// @route   DELETE /api/laptops/:id
// @desc    Delete a laptop listing
// @access  Private (only seller can delete)
router.delete('/:id', auth, async (req, res) => {
  try {
    const laptop = await Laptop.findById(req.params.id);

    if (!laptop) {
      return res.status(404).json({ message: 'Laptop not found' });
    }

    // Check if user is the seller
    if (laptop.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    // Delete images from filesystem
    laptop.images.forEach((imagePath) => {
      const fullPath = path.join(__dirname, '..', imagePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    });

    await laptop.deleteOne();

    res.json({ message: 'Laptop listing deleted successfully' });
  } catch (error) {
    console.error('Delete laptop error:', error);
    res.status(500).json({ message: 'Server error deleting laptop listing' });
  }
});

// @route   GET /api/laptops/user/my-listings
// @desc    Get current user's laptop listings
// @access  Private
router.get('/user/my-listings', auth, async (req, res) => {
  try {
    const laptops = await Laptop.find({ seller: req.user._id })
      .populate('seller', 'name email phone college')
      .sort({ createdAt: -1 });

    res.json(laptops);
  } catch (error) {
    console.error('Get user listings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
