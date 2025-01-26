const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');
const { protect } = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Protect all token routes with authentication
router.use(protect);

// Routes for token management
router.post('/generate', roleMiddleware(['receptionist', 'admin']), tokenController.generateToken); // Generate a new token
router.get('/:tokenId', roleMiddleware(['staff', 'receptionist', 'admin']), tokenController.getTokenDetails); // Get token details
router.post('/update-status', roleMiddleware(['staff', 'admin']), tokenController.updateTokenStatus); // Update token status
router.get('/', roleMiddleware(['admin']), tokenController.getAllTokens); // Get all tokens (admin only)

module.exports = router;
