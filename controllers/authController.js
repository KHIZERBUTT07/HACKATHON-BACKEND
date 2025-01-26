const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User (without password)
exports.register = async (req, res) => {
  try {
    const {
      name,
      cnic,
      contactDetails,
      address,
      purpose,
    } = req.body;

    // Validate required fields
    if (!name || !cnic || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ cnic });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this CNIC already exists'
      });
    }

    // Create new user
    const user = await User.create({
      name,
      cnic,
      contactDetails: {
        phone: contactDetails.phone,
        alternatePhone: contactDetails.alternatePhone || undefined
      },
      address: {
        street: address.street,
        city: address.city,
        province: address.province,
        postalCode: address.postalCode || undefined
      },
      purpose,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please save your ID for login.',
      userId: user._id,
      user: {
        name: user.name,
        cnic: user.cnic,
        _id: user._id
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// Step 1: Get User ID by CNIC
exports.getUserId = async (req, res) => {
  try {
    const { cnic } = req.body;

    if (!cnic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide CNIC'
      });
    }

    const user = await User.findOne({ cnic }).select('_id name cnic');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with this CNIC'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User found',
      userId: user._id,
      user: {
        name: user.name,
        cnic: user.cnic
      }
    });

  } catch (error) {
    console.error('Get User ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// Step 2: Login with User ID and CNIC
exports.login = async (req, res) => {
  try {
    const { userId, cnic } = req.body;

    // Check if JWT_SECRET exists
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    if (!userId || !cnic) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both User ID and CNIC'
      });
    }

    // Find user by ID and CNIC
    const user = await User.findOne({
      _id: userId,
      cnic: cnic
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        cnic: user.cnic,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
}; 