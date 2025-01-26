const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    cnic: {
      type: String,
      required: [true, "CNIC is required"],
      unique: true,
      match: [
        /^\d{5}-\d{7}-\d{1}$/,
        "Please provide a valid CNIC number in format: 12345-1234567-1",
      ],
    },
    contactDetails: {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        match: [
          /^(\+92|0)?[0-9]{10}$/,
          "Please provide a valid phone number",
        ],
      },
      alternatePhone: {
        type: String,
        default: null, // Default value for optional fields
      },
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      province: {
        type: String,
        required: [true, "Province is required"],
      },
      postalCode: {
        type: String,
        match: [/^\d{5}$/, "Please provide a valid 5-digit postal code"],
      },
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      select: false, // Excludes password by default when querying
    },
  },
  {
    timestamps: true,
  }
);

// Explicitly define indexes
userSchema.index({ cnic: 1 }, { unique: true });

// Exclude password from being returned in API responses
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
