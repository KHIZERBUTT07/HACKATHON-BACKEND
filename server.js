require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const tokenRoutes = require("./routes/tokenRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse incoming JSON requests

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes); // Authentication routes
app.use("/api/users", userRoutes); // User management routes
app.use("/api/admin", adminRoutes); // Admin-specific routes
app.use("/api/tokens", tokenRoutes); // Token management routes
app.use("/api/departments", departmentRoutes); // Department management routes

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
