/**
 * Middleware to enforce role-based access control.
 * @param {Array} allowedRoles - Array of roles allowed to access the route.
 */
const roleMiddleware = (allowedRoles) => {
    return (req, res, next) => {
        try {
            // Assuming `req.user` contains the authenticated user's details
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized: User not authenticated.',
                });
            }

            const { role } = req.user;

            // Check if the user's role is in the allowedRoles array
            if (!allowedRoles.includes(role)) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: You do not have permission to access this resource.',
                });
            }

            next(); // User has permission, proceed to the next middleware or controller
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal Server Error: Role verification failed.',
            });
        }
    };
};

module.exports = roleMiddleware;
