const User = require("../models/User");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// Register User
exports.register = async (req, res) => {
  try {
    const { name, cnic, contactDetails, address, purpose } = req.body;

    // Validate required fields
    if (!name || !cnic || !contactDetails.phone || !address.street || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ cnic });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this CNIC already exists.",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      cnic,
      contactDetails,
      address,
      purpose,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Please save your ID for login.",
      userId: user._id,
      user: {
        name: user.name,
        cnic: user.cnic,
        _id: user._id,
      },
    });
  } catch (error) {
    console.error("Registration error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

// Get User ID by CNIC
exports.getUserId = async (req, res) => {
  try {
    const { cnic } = req.body;

    if (!cnic) {
      return res.status(400).json({
        success: false,
        message: "Please provide CNIC.",
      });
    }

    const user = await User.findOne({ cnic }).select("_id name cnic");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this CNIC.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User found.",
      userId: user._id,
      user: {
        name: user.name,
        cnic: user.cnic,
      },
    });
  } catch (error) {
    console.error("Get User ID error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};

// Login with User ID and CNIC
exports.login = async (req, res) => {
  try {
    const { userId, cnic } = req.body;

    if (!userId || !cnic) {
      return res.status(400).json({
        success: false,
        message: "Please provide both User ID and CNIC.",
      });
    }

    const user = await User.findOne({ _id: userId, cnic });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        name: user.name,
        cnic: user.cnic,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again later.",
    });
  }
};
