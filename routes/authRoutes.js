const express = require("express");
const router = express.Router();
const { register, getUserId, login } = require("../controllers/authController");

// Authentication routes
router.post("/register", register);
router.post("/get-user-id", getUserId);  // New route to get user ID
router.post("/login", login);

module.exports = router; 