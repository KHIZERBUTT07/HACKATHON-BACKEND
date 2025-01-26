const mongoose = require('mongoose');

// Define the Department schema
const DepartmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        default: '',
        trim: true,
    },
    activities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Activity', // Refers to a separate Activity model if needed
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to update the `updatedAt` field before saving
DepartmentSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Export the model
const Department = mongoose.model('Department', DepartmentSchema);
module.exports = Department;
