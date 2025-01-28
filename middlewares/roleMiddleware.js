/**
 * Middleware to enforce role-based access control.
 * @param {Array} allowedRoles - Array of roles allowed to access the route.
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
      try {
        // Check if the user is authenticated and the `req.user` object exists
        if (!req.user) {
          console.error("RoleMiddleware Error: User not authenticated.");
          return res.status(401).json({
            success: false,
            message: "Unauthorized: User not authenticated.",
          });
        }
  
        const { role } = req.user;
  
        // Log the user's role and allowed roles for debugging
        console.log(`User Role: ${role}, Allowed Roles: ${allowedRoles}`);
  
        // Check if the user's role is in the allowed roles
        if (!allowedRoles.includes(role)) {
          console.error("RoleMiddleware Error: Access denied.");
          return res.status(403).json({
            success: false,
            message: "Forbidden: Access is denied.",
          });
        }
  
        // User has access, proceed to the next middleware or controller
        next();
      } catch (error) {
        console.error("RoleMiddleware Error:", error);
        res.status(500).json({
          success: false,
          message: "Internal Server Error: Role verification failed.",
        });
      }
    };
  };
  
  module.exports = roleMiddleware;
  