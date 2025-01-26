const Department = require('../models/Department');
const Token = require('../models/Token');

// Get all departments
const getAllDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.status(200).json({
            success: true,
            data: departments,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching departments.' });
    }
};

// Add or update a department
const manageDepartment = async (req, res) => {
    const { action, departmentId, data } = req.body;

    try {
        let department;
        if (action === 'create') {
            department = await Department.create(data);
        } else if (action === 'update') {
            department = await Department.findByIdAndUpdate(departmentId, data, { new: true });
        } else if (action === 'delete') {
            department = await Department.findByIdAndDelete(departmentId);
        } else {
            return res.status(400).json({ success: false, message: 'Invalid action specified.' });
        }

        res.status(200).json({
            success: true,
            message: `Department ${action}d successfully.`,
            data: department,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error managing department.' });
    }
};

// Update beneficiary status
const updateBeneficiaryStatus = async (req, res) => {
    const { tokenId, status, remarks } = req.body;

    try {
        const token = await Token.findByIdAndUpdate(
            tokenId,
            { status, remarks },
            { new: true }
        ).populate('department');

        if (!token) {
            return res.status(404).json({ success: false, message: 'Token not found.' });
        }

        res.status(200).json({
            success: true,
            message: 'Beneficiary status updated successfully.',
            data: token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error updating beneficiary status.' });
    }
};

// Get department activity logs
const getActivityLogs = async (req, res) => {
    const { departmentId } = req.params;

    try {
        const department = await Department.findById(departmentId).populate('activities');

        if (!department) {
            return res.status(404).json({ success: false, message: 'Department not found.' });
        }

        res.status(200).json({
            success: true,
            data: department.activities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching activity logs.' });
    }
};

module.exports = {
    getAllDepartments,
    manageDepartment,
    updateBeneficiaryStatus,
    getActivityLogs,
};
