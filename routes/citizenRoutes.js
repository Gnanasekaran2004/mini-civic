const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// KEY PART 1: Make sure 'deleteIssue' is imported here
const { 
    getDashboard, 
    submitIssue, 
    getMyIssuesPage, 
    deleteIssue // <-- Ensure this is included
} = require('../controllers/citizenController');

const { protectCitizen } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// Configure Multer with file size limit (1MB)
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1 }, // 1MB limit
}).single('issueImage');


// --- Page Routes ---
router.get('/citizen-dashboard', protectCitizen, getDashboard);
router.get('/my-issues', protectCitizen, getMyIssuesPage);


// --- API Routes ---
router.post('/api/citizen/issues', protectCitizen, (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.redirect('/citizen-dashboard?error=FileTooLarge');
        } else if (err) {
            return res.redirect('/citizen-dashboard?error=UploadFailed');
        }
        submitIssue(req, res);
    });
});

// KEY PART 2: Ensure this route definition is exactly correct
// It must use router.post() and have the correct path with ':id'
router.post('/api/citizen/issues/:id/delete', protectCitizen, deleteIssue);


module.exports = router;