// routes/adminRoutes.js

const express = require('express');
const router = express.Router();
const { getDashboard, updateIssueStatus } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');

// ✅ This is the route that renders the admin dashboard page.
router.get('/admin-dashboard', protectAdmin, getDashboard);

// This is the API route for the form submission to update status.
router.post('/api/admin/issues/:id/status', protectAdmin, updateIssueStatus);

module.exports = router;