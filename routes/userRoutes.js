const express = require("express");
const router = express.Router();
const { getProfile, getAllUsers, manageUser } = require("../controllers/userController");
const { protect, authorize } = require("../middlewares/authMiddleware");

// Protected routes
router.get("/profile", protect, getProfile);
router.post("/update-profile", protect, manageUser);

// Admin-only routes
router.get("/admin/users", protect, authorize(["admin"]), getAllUsers);
router.post("/admin/manage-user", protect, authorize(["admin"]), manageUser);

module.exports = router;
