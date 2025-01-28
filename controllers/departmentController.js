const Department = require('../models/Department');

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

module.exports = {
  getAllDepartments: async (req, res) => {
    try {
      const departments = await Department.find();
      res.status(200).json({ success: true, data: departments });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error fetching departments.' });
    }
  },
  manageDepartment,
  updateBeneficiaryStatus: async (req, res) => {
    // Your updateBeneficiaryStatus implementation
  },
  getActivityLogs: async (req, res) => {
    // Your getActivityLogs implementation
  },
};
