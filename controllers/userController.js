const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1h",
    });

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
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Return user details and token
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token  // Include the token in the response
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

/**
 * Manage user (create, update, delete)
 */
const manageUser = async (req, res) => {
    try {
        const { action, userId, data } = req.body;
        const isAdmin = req.user.role === 'admin';
        
        // If not admin, user can only update their own profile
        if (!isAdmin && userId !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Not authorized to modify other users" 
            });
        }

        let user;
        switch (action) {
            case 'update':
                // Remove sensitive fields if not admin
                if (!isAdmin) {
                    delete data.role;
                    delete data.password;
                }
                
                // If updating password, hash it
                if (data.password) {
                    const salt = await bcrypt.genSalt(10);
                    data.password = await bcrypt.hash(data.password, salt);
                }
                
                user = await User.findByIdAndUpdate(
                    userId || req.user.id,
                    data,
                    { new: true }
                ).select('-password');
                break;

            case 'delete':
                if (!isAdmin) {
                    return res.status(403).json({ 
                        success: false, 
                        message: "Only admins can delete users" 
                    });
                }
                user = await User.findByIdAndDelete(userId);
                break;

            default:
                return res.status(400).json({ 
                    success: false, 
                    message: "Invalid action specified" 
                });
        }

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User not found" 
            });
        }

        res.status(200).json({
            success: true,
            message: `User ${action}d successfully`,
            data: user
        });
    } catch (error) {
        console.error('Manage user error:', error);
        res.status(500).json({ 
            success: false, 
            message: "Error managing user",
            error: error.message 
        });
    }
};

module.exports = {
  signUp,
  login,
  getProfile,
  getAllUsers,
  manageUser
};
