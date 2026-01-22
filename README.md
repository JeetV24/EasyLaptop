# 💻 Easy Laptop - Student Laptop Marketplace

A MERN stack application where students can buy and sell used laptops to other students.

## 🚀 Features

- **User Authentication**: Register and login for students
- **Laptop Listings**: Students can create listings with images, prices, and specifications
- **Browse & Search**: Filter and search laptops by brand, price, condition, etc.
- **User Profiles**: Manage your profile and view your listings
- **Image Upload**: Upload multiple images for each laptop listing

## 🛠️ Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn

## 🔧 Installation & Setup

### 1. Clone the repository (or navigate to the project folder)

```bash
cd "Laptop Easy"
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# On Windows PowerShell:
Copy-Item .env.example .env

# Edit .env file and set your MongoDB connection string
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/easy-laptop
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production

# Start the backend server
npm start
# OR for development with auto-restart:
npm run dev
```

The backend server will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## 📁 Project Structure

```
Laptop Easy/
├── backend/
│   ├── models/          # MongoDB models (User, Laptop)
│   ├── routes/          # API routes (auth, laptops, users)
│   ├── middleware/      # Authentication middleware
│   ├── uploads/         # Uploaded images (created automatically)
│   ├── server.js        # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components (Navbar)
│   │   ├── pages/       # Page components
│   │   ├── context/     # React Context (AuthContext)
│   │   ├── App.js       # Main App component
│   │   └── index.js     # React entry point
│   └── package.json
└── README.md
```

## 🎯 How to Use

1. **Register/Login**: Create an account or login if you already have one
2. **Browse Laptops**: View all available laptop listings
3. **Add Listing**: Click "Sell Laptop" to create a new listing
4. **View Details**: Click on any laptop to see full details and seller information
5. **Manage Listings**: Go to "My Listings" to view, edit, or delete your listings
6. **Update Profile**: Edit your profile information

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Laptops
- `GET /api/laptops` - Get all laptops (with filters)
- `GET /api/laptops/:id` - Get single laptop
- `POST /api/laptops` - Create new listing (requires auth)
- `PUT /api/laptops/:id` - Update listing (requires auth, owner only)
- `DELETE /api/laptops/:id` - Delete listing (requires auth, owner only)
- `GET /api/laptops/user/my-listings` - Get user's listings (requires auth)

### Users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/profile` - Update user profile (requires auth)

## 🎓 Learning Points for Beginners

This project demonstrates:

1. **Full-stack Development**: Complete MERN stack application
2. **RESTful API**: Backend API with Express.js
3. **Database Design**: MongoDB schemas and relationships
4. **Authentication**: JWT-based authentication system
5. **File Upload**: Handling image uploads with Multer
6. **React Router**: Client-side routing
7. **Context API**: Global state management
8. **CRUD Operations**: Create, Read, Update, Delete operations
9. **Protected Routes**: Route protection based on authentication

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running on your system
- Check the connection string in `.env` file
- For MongoDB Atlas, use your cloud connection string

### Port Already in Use
- Backend: Change PORT in `.env` file
- Frontend: React will automatically use the next available port

### Image Upload Not Working
- Check that the `uploads` folder exists in the backend directory
- Ensure file size is under 5MB
- Verify file is an image format (jpg, png, etc.)

## 📝 Notes

- Images are stored locally in the `backend/uploads` folder
- For production, consider using cloud storage (AWS S3, Cloudinary, etc.)
- JWT_SECRET should be changed to a secure random string in production
- This is a learning project - add more security features for production use

## 🤝 Contributing

This is a learning project. Feel free to fork and add your own features!

## 📄 License

This project is open source and available for educational purposes.

---

**Happy Coding! 🚀**
