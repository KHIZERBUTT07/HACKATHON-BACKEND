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
          /^(\+92|92|0)?3[0-9]{2}-?[0-9]{7}$/,
          "Please provide a valid phone number in formats like +92 300 1234567 or 0300-1234567",
        ],
      },
      alternatePhone: {
        type: String,
        default: null, // Optional alternate phone number
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
      select: false, // Excludes password from default queries
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Define unique index for CNIC
userSchema.index({ cnic: 1 }, { unique: true });

// Exclude sensitive data (like password) when converting to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
