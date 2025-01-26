const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

/**
 * Middleware to protect routes by verifying JWT tokens
 */
const protect = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Add decoded user data to the request object
        next();
    } catch (error) {
        res.status(401).json({ message: "Not authorized, token invalid" });
    }
};

/**
 * Middleware to restrict access based on user roles
 * @param {string[]} roles - Array of roles allowed to access the route
 */
const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
        return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    next();
};

module.exports = { protect, authorize };
