const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protect all department routes
router.use(protect);

// Get all departments (accessible by all authenticated users)
router.get('/', departmentController.getAllDepartments);

// Admin only routes
router.post('/manage', authorize(['admin']), departmentController.manageDepartment);
router.get('/activity/:departmentId', authorize(['admin']), departmentController.getActivityLogs);

// Department staff and admin routes
router.patch('/beneficiary-status', 
  authorize(['admin', 'staff']), 
  departmentController.updateBeneficiaryStatus
);

module.exports = router;
