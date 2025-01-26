const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Token = require('../models/Token');

/**
 * Sign up a new user
 */
const signUp = async (req, res) => {
  try {
    const { name, email, password, imageUrl } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      imageUrl,
    });

    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    // Return user details and token
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        imageUrl: newUser.imageUrl,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

/**
 * Log in an existing user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide all required fields" });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user);

    // Return user details and token
    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

/**
 * Get the authenticated user's profile
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

/**
 * Get all users (Admin only)
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ error: "Server error", details: error.message });
  }
};

// Generate a new token
const generateToken = async (req, res) => {
    try {
        const { beneficiary, department, purpose } = req.body;

        // Generate a unique token number (you can customize this logic)
        const tokenNumber = `TKN${Date.now()}`;

        const newToken = await Token.create({
            tokenNumber,
            beneficiary,
            department,
            purpose
        });

        res.status(201).json({
            success: true,
            data: newToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error generating token'
        });
    }
};

// Get token details
const getTokenDetails = async (req, res) => {
    try {
        const token = await Token.findById(req.params.tokenId)
            .populate('beneficiary', 'name email')
            .populate('department', 'name');

        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found'
            });
        }

        res.status(200).json({
            success: true,
            data: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching token details'
        });
    }
};

// Update token status
const updateTokenStatus = async (req, res) => {
    try {
        const { tokenId, status, remarks } = req.body;

        const token = await Token.findByIdAndUpdate(
            tokenId,
            { status, remarks, updatedAt: Date.now() },
            { new: true }
        );

        if (!token) {
            return res.status(404).json({
                success: false,
                message: 'Token not found'
            });
        }

        res.status(200).json({
            success: true,
            data: token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error updating token status'
        });
    }
};

// Get all tokens
const getAllTokens = async (req, res) => {
    try {
        const tokens = await Token.find()
            .populate('beneficiary', 'name email')
            .populate('department', 'name')
            .sort({ issuedAt: -1 });

        res.status(200).json({
            success: true,
            data: tokens
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tokens'
        });
    }
};

module.exports = {
  signUp,
  login,
  getProfile,
  getAllUsers,
  generateToken,
  getTokenDetails,
  updateTokenStatus,
  getAllTokens
};
