// routes/authRoutes.js
const express = require('express');
const { registerCitizen, loginCitizen, loginAdmin, logout } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerCitizen);
router.post('/login/citizen', loginCitizen);
router.post('/login/admin', loginAdmin);
router.get('/logout', logout);

module.exports = router;