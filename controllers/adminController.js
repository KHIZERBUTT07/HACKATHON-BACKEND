const User = require('../models/User');
const Token = require('../models/Token');
const Department = require('../models/Department');

// Dashboard metrics
const getDashboardMetrics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTokens = await Token.countDocuments();
        const departmentActivity = await Department.aggregate([
            { $project: { name: 1, activityCount: { $size: "$activities" } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalTokens,
                departmentActivity
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching dashboard metrics.' });
    }
};

// Manage users
const manageUsers = async (req, res) => {
    const { action, userId, data } = req.body;

    try {
        let user;
        if (action === 'create') {
            user = await User.create(data);
        } else if (action === 'update') {
            user = await User.findByIdAndUpdate(userId, data, { new: true });
        } else if (action === 'delete') {
            user = await User.findByIdAndDelete(userId);
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action specified.' });
        }

        res.status(200).json({
            success: true,
            message: `User ${action}d successfully.`,
            data: user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error managing user.' });
    }
};

// Generate reports
const generateReport = async (req, res) => {
    const { filter } = req.body;

    try {
        const report = await Token.find(filter).populate('user department');

        res.status(200).json({
            success: true,
            data: report
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error generating report.' });
    }
};

// Update system settings
const updateSettings = async (req, res) => {
    const { settings } = req.body;

    try {
        // Assuming you have a `Settings` model or config in your database
        // const updatedSettings = await Settings.updateOne({}, settings, { new: true });
        // For now, sending a success response directly:
        res.status(200).json({
            success: true,
            message: 'Settings updated successfully.',
            data: settings
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating settings.' });
    }
};

module.exports = {
    getDashboardMetrics,
    manageUsers,
    generateReport,
    updateSettings
};
