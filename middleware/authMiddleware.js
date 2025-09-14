// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const Citizen = require('../models/Citizen');
const Admin = require('../models/Admin');

const protectCitizen = async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Citizen.findById(decoded.id).select('-password');
            if (!req.user) { // If user not found
                return res.status(401).redirect('/citizen-login');
            }
            next();
        } catch (error) {
            res.status(401).redirect('/citizen-login');
        }
    } else {
        res.status(401).redirect('/citizen-login');
    }
};

const protectAdmin = async (req, res, next) => {
    let token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await Admin.findById(decoded.id).select('-password');
             if (!req.user) { // If user not found
                return res.status(401).redirect('/admin-login');
            }
            next();
        } catch (error) {
            res.status(401).redirect('/admin-login');
        }
    } else {
        res.status(401).redirect('/admin-login');
    }
};


module.exports = { protectCitizen, protectAdmin };