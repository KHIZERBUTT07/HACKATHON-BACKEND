const express = require("express");
const router = express.Router();
const { register, getUserId, login } = require("../controllers/authController");

// Authentication routes
router.post("/register", register); // Register endpoint
router.post("/get-user-id", getUserId); // Get User ID endpoint
router.post("/login", login); // Login endpoint

module.exports = router;
