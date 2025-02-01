const express = require("express");
const router = express.Router();
const tokenController = require("../controllers/tokenController");
const { protect } = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

// Protect all token routes
router.use(protect);

// ✅ Add route to fetch beneficiary by token number
router.get("/token/:tokenNumber", tokenController.getBeneficiaryByToken);

router.post(
  "/generate",
  roleMiddleware(["receptionist", "admin", "user"]),
  tokenController.generateToken
);
router.get(
  "/:tokenId",
  roleMiddleware(["staff", "receptionist", "admin", "user"]),
  tokenController.getTokenDetails
);
router.post(
  "/update-status",
  roleMiddleware(["staff", "admin", "user"]),
  tokenController.updateTokenStatus
);
router.get("/", roleMiddleware(["admin", "user"]), tokenController.getAllTokens);

module.exports = router;
