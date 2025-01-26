require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db.js");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const authRoutes = require("./routes/authRoutes");
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tokens", tokenRoutes);
app.use("/api/departments", departmentRoutes);

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Ensure indexes are properly set up
    await User.syncIndexes();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
