const express = require('express');
const router = express.Router();
const { getProfile, getAllUsers, manageUser } = require('../controllers/userController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protected routes
router.get('/profile', protect, getProfile);
router.post('/update-profile', protect, manageUser);

// Admin-only routes
router.get('/admin/users', protect, authorize(['admin']), getAllUsers);
router.post('/admin/manage-user', protect, authorize(['admin']), manageUser);

// Temporary route to update user role for testing
router.patch('/update-role', protect, authorize(['admin']), async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!['user', 'receptionist', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role provided' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
