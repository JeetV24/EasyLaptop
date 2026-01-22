const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const Laptop = require('./models/Laptop');
const User = require('./models/User');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import routes
const authRoutes = require('./routes/auth');
const laptopRoutes = require('./routes/laptops');
const userRoutes = require('./routes/users');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/laptops', laptopRoutes);
app.use('/api/users', userRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Easy Laptop API is running!' });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/easy-laptop')
  .then(async () => {
    console.log('✅ Connected to MongoDB');

    try {
      const laptopCount = await Laptop.countDocuments();

      if (laptopCount === 0) {
        let demoUser = await User.findOne({ email: 'demo@easylaptop.com' });

        if (!demoUser) {
          demoUser = new User({
            name: 'Demo Seller',
            email: 'demo@easylaptop.com',
            password: 'password123',
            phone: '9999999999',
            college: 'Demo College',
            userType: 'seller',
          });

          await demoUser.save();
        }

        const dummyLaptops = [
          {
            title: 'Dell Inspiron 15',
            description: 'Perfect for students. Good battery life and performance for coding and online classes.',
            price: 35000,
            brand: 'Dell',
            model: 'Inspiron 15 3000',
            processor: 'Intel Core i5 10th Gen',
            ram: '8GB',
            storage: '512GB SSD',
            screenSize: '15.6 inch',
            condition: 'Good',
            year: 2021,
            seller: demoUser._id,
            contactEmail: demoUser.email,
            contactPhone: demoUser.phone,
            status: 'active',
          },
          {
            title: 'HP Pavilion Gaming',
            description: 'Gaming and programming laptop with dedicated graphics. Great for heavy workloads.',
            price: 55000,
            brand: 'HP',
            model: 'Pavilion Gaming 15',
            processor: 'AMD Ryzen 5',
            ram: '16GB',
            storage: '512GB SSD',
            screenSize: '15.6 inch',
            condition: 'Excellent',
            year: 2022,
            seller: demoUser._id,
            contactEmail: demoUser.email,
            contactPhone: demoUser.phone,
            status: 'active',
          },
          {
            title: 'Apple MacBook Air',
            description: 'Lightweight MacBook Air, ideal for design, writing, and web development.',
            price: 70000,
            brand: 'Apple',
            model: 'MacBook Air M1',
            processor: 'Apple M1',
            ram: '8GB',
            storage: '256GB SSD',
            screenSize: '13.3 inch',
            condition: 'Excellent',
            year: 2021,
            seller: demoUser._id,
            contactEmail: demoUser.email,
            contactPhone: demoUser.phone,
            status: 'active',
          },
        ];

        await Laptop.insertMany(dummyLaptops);
        console.log('✅ Inserted dummy laptop data');
      }
    } catch (seedError) {
      console.error('❌ Error seeding dummy laptop data:', seedError);
    }
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
