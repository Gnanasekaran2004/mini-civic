// controllers/adminController.js
const Issue = require('../models/Issue');
const Citizen = require('../models/Citizen');

// @desc    Get admin dashboard page with stats and filters
// @route   GET /admin-dashboard
exports.getDashboard = async (req, res) => {
  try {
    const { status, phoneNo } = req.query;
    let query = { status: { $ne: 'Resolved' } }; // <-- Hide resolved issues by default

    // Handle search by phone number
    if (phoneNo) {
        const citizen = await Citizen.findOne({ phoneNo: phoneNo.trim() });
        if (citizen) {
            query.citizen = citizen._id;
        } else {
            // If no citizen found, we should return no issues
            query.citizen = new mongoose.Types.ObjectId(); 
        }
    }
    
    // Handle filter by status
    if (status) {
        // If status is "All", we remove the default filter
        if (status === 'All') {
            delete query.status;
        } else {
            query.status = status;
        }
    }

    const issues = await Issue.find(query).populate('citizen', 'name phoneNo').sort({ createdAt: -1 });
    
    // Get statistics
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'Resolved' });
    const workingIssues = await Issue.countDocuments({ status: 'Working' });
    const pendingIssues = totalIssues - resolvedIssues;


    res.render('admin_dashboard', { 
        issues,
        stats: {
            total: totalIssues,
            resolved: resolvedIssues,
            working: workingIssues,
            pending: pendingIssues
        },
        currentStatus: status,
        currentPhoneNo: phoneNo
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};


// @desc    Update issue status
// @route   POST /api/admin/issues/:id/status
exports.updateIssueStatus = async (req, res) => {
  try {
    await Issue.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect('/admin-dashboard');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};