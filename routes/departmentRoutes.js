const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// Protect all department routes
router.use(protect);

// Admin-only route to manage departments
router.post('/manage', authorize(['admin']), departmentController.manageDepartment);

// Get all departments (accessible by all authenticated users)
router.get('/', departmentController.getAllDepartments);

// Department staff and admin routes
router.patch(
  '/beneficiary-status',
  authorize(['admin', 'staff']),
  departmentController.updateBeneficiaryStatus
);

router.get('/activity/:departmentId', authorize(['admin']), departmentController.getActivityLogs);

module.exports = router;
