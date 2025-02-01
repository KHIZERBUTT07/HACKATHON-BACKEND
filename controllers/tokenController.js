const Token = require("../models/Token");
const Department = require("../models/Department");

/**
 * ✅ Generate a new token
 */
const generateToken = async (req, res) => {
  try {
    const { beneficiary, department, purpose } = req.body;

    if (!beneficiary || !department || !purpose) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields.",
      });
    }

    // Check if the department exists
    const departmentExists = await Department.findById(department);
    if (!departmentExists) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    // Generate a unique token number
    const tokenNumber = `TKN-${Math.floor(1000 + Math.random() * 9000)}`;

    // Create new token
    const newToken = await Token.create({
      tokenNumber,
      beneficiary,
      department,
      purpose,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Token generated successfully.",
      data: newToken,
    });
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({
      success: false,
      message: "Error generating token.",
    });
  }
};

/**
 * ✅ Fetch Beneficiary By Token Number
 */
const getBeneficiaryByToken = async (req, res) => {
  try {
    console.log("Searching for token:", req.params.tokenNumber); // Debugging log

    const token = await Token.findOne({ tokenNumber: req.params.tokenNumber })
      .populate("beneficiary", "name cnic phone address")
      .populate("department", "name");

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: token,
    });
  } catch (error) {
    console.error("Error fetching token details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching token details.",
    });
  }
};

/**
 * ✅ Get token details
 */
const getTokenDetails = async (req, res) => {
  try {
    const token = await Token.findById(req.params.tokenId)
      .populate("beneficiary", "name cnic")
      .populate("department", "name");

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: token,
    });
  } catch (error) {
    console.error("Error fetching token details:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching token details.",
    });
  }
};

/**
 * ✅ Update token status
 */
const updateTokenStatus = async (req, res) => {
  try {
    const { tokenId, status, remarks } = req.body;

    const token = await Token.findByIdAndUpdate(
      tokenId,
      { status, remarks, updatedAt: Date.now() },
      { new: true }
    );

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Token not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Token status updated successfully.",
      data: token,
    });
  } catch (error) {
    console.error("Error updating token status:", error);
    res.status(500).json({
      success: false,
      message: "Error updating token status.",
    });
  }
};

/**
 * ✅ Get all tokens
 */
const getAllTokens = async (req, res) => {
  try {
    const tokens = await Token.find()
      .populate("beneficiary", "name cnic")
      .populate("department", "name")
      .sort({ issuedAt: -1 });

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tokens.",
    });
  }
};

// ✅ Ensure all functions are correctly exported
module.exports = {
  generateToken,
  getBeneficiaryByToken,
  getTokenDetails,
  updateTokenStatus,
  getAllTokens,
};
