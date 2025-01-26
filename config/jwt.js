const jwt = require('jsonwebtoken');

// Load environment variables from .env
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d"; // Default to 1 day

/**
 * Generate a JWT token
 * @param {Object} payload - The data to encode in the token
 * @returns {string} - The generated JWT token
 */
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify a JWT token
 * @param {string} token - The token to verify
 * @returns {Object|false} - Decoded payload if valid, or false if invalid
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (err) {
        console.error("Invalid token:", err.message);
        return false;
    }
}

module.exports = {
    generateToken,
    verifyToken,
};
