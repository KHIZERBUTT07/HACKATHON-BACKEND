const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect all admin routes with authentication and role-based access
router.use(protect);
router.use(roleMiddleware(['admin'])); // Only allow admins to access these routes

// Route to fetch dashboard metrics
router.get('/dashboard', adminController.getDashboardMetrics);

// Route to manage users (create, update, delete)
router.post('/manage-user', adminController.manageUsers);

// Route to generate reports
router.post('/generate-report', adminController.generateReport);

// Route to update system settings
router.post('/update-settings', adminController.updateSettings);

module.exports = router;
