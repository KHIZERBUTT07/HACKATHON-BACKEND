const mongoose = require('mongoose');

// Define the Token schema
const TokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: String,
        required: true,
        unique: true,
    },
    beneficiary: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Refers to the User model (beneficiary)
        required: true,
    },
    department: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department', // Refers to the Department model
        required: true,
    },
    purpose: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'], // Status options
        default: 'Pending',
    },
    remarks: {
        type: String,
        default: '',
        trim: true,
    },
    issuedAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the `updatedAt` field before saving
TokenSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
const Token = mongoose.model('Token', TokenSchema);
module.exports = Token;
