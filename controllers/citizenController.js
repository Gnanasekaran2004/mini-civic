// controllers/citizenController.js
const Issue = require('../models/Issue');
const Citizen = require('../models/Citizen');

// @desc    Get citizen dashboard page
// @route   GET /citizen-dashboard
exports.getDashboard = async (req, res) => {
  try {
    const citizen = await Citizen.findById(req.user.id);
    // The issue list is now on a separate page.
    res.render('citizen_dashboard', { citizen, error: req.query.error });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// @desc    Get the page to view personal issues with filtering
// @route   GET /my-issues
exports.getMyIssuesPage = async (req, res) => {
    try {
        const { status, date } = req.query;
        let query = { citizen: req.user.id };

        if (status) {
            query.status = status;
        }

        if (date) {
            const startDate = new Date(date);
            const endDate = new Date(date);
            endDate.setDate(startDate.getDate() + 1);
            query.createdAt = { $gte: startDate, $lt: endDate };
        }

        const issues = await Issue.find(query).sort({ createdAt: -1 });
        res.render('my_issues', {
            issues,
            currentStatus: status,
            currentDate: date,
        });
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

// @desc    Submit a new issue
// @route   POST /api/citizen/issues
exports.submitIssue = async (req, res) => {
  const { issueType, description, address } = req.body; // <-- get address
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  try {
    if (!issueType || !description || !address) {
        return res.redirect('/citizen-dashboard?error=MissingFields');
    }
    await Issue.create({
      citizen: req.user.id,
      issueType,
      description,
      address, // <-- save address
      imageUrl,
    });
    res.redirect('/citizen-dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
// @desc    Delete a citizen's issue
// @route   POST /api/citizen/issues/:id/delete
exports.deleteIssue = async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id);

        if (!issue) {
            return res.status(404).send('Issue not found');
        }

        // Security Check: Ensure the logged-in user owns this issue
        if (issue.citizen.toString() !== req.user.id) {
            return res.status(401).send('Not authorized to delete this issue');
        }

        await Issue.findByIdAndDelete(req.params.id);
        res.redirect('/my-issues');

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};