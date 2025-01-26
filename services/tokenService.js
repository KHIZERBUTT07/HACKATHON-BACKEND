const crypto = require("crypto");
const Token = require("../models/Token"); // Assuming Token is your Mongoose model for tokens

class TokenService {
  /**
   * Generate a unique token for a beneficiary's request.
   * @param {Object} tokenData - Data to be associated with the token (e.g., CNIC, department).
   * @returns {Promise<Object>} - The created token object.
   */
  async generateToken(tokenData) {
    try {
      const uniqueToken = crypto.randomBytes(8).toString("hex"); // Generates a unique token string
      const token = new Token({
        token: uniqueToken,
        cnic: tokenData.cnic,
        department: tokenData.department,
        purpose: tokenData.purpose,
        status: "Pending", // Default status
        createdAt: new Date(),
      });
      await token.save();
      return token;
    } catch (error) {
      throw new Error("Error generating token: " + error.message);
    }
  }

  /**
   * Retrieve token details by token ID.
   * @param {string} tokenId - The unique token string.
   * @returns {Promise<Object>} - The token object if found.
   */
  async getTokenDetails(tokenId) {
    try {
      const token = await Token.findOne({ token: tokenId });
      if (!token) {
        throw new Error("Token not found");
      }
      return token;
    } catch (error) {
      throw new Error("Error retrieving token: " + error.message);
    }
  }

  /**
   * Update the status or remarks of a token.
   * @param {string} tokenId - The unique token string.
   * @param {Object} updates - Fields to update (e.g., status, remarks).
   * @returns {Promise<Object>} - The updated token object.
   */
  async updateToken(tokenId, updates) {
    try {
      const token = await Token.findOneAndUpdate(
        { token: tokenId },
        { $set: updates },
        { new: true }
      );
      if (!token) {
        throw new Error("Token not found");
      }
      return token;
    } catch (error) {
      throw new Error("Error updating token: " + error.message);
    }
  }
}

module.exports = new TokenService();
