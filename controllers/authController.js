// controllers/authController.js
const Citizen = require('../models/Citizen');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// Utility to generate JWT
const generateToken = (res, id) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

// Utility to verify reCAPTCHA
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;
  try {
    const { data } = await axios.post(verificationURL);
    return data.success;
  } catch (error) {
    console.error("reCAPTCHA verification failed:", error);
    return false;
  }
};

// @desc    Register a new citizen
// @route   POST /api/auth/register
exports.registerCitizen = async (req, res) => {
  const { name, phoneNo, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  const citizenExists = await Citizen.findOne({ phoneNo });
  if (citizenExists) {
    return res.status(400).json({ message: 'Citizen already exists' });
  }

  const citizen = await Citizen.create({ name, phoneNo, password });

  if (citizen) {
    generateToken(res, citizen._id);
    res.status(201).json({ redirectUrl: '/citizen-dashboard' });
  } else {
    res.status(400).json({ message: 'Invalid citizen data' });
  }
};

// @desc    Auth citizen & get token
// @route   POST /api/auth/login/citizen
exports.loginCitizen = async (req, res) => {
  const { phoneNo, password } = req.body;
  const recaptchaToken = req.body['g-recaptcha-response'];

  if (!(await verifyRecaptcha(recaptchaToken))) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
  }

  const citizen = await Citizen.findOne({ phoneNo });

  if (citizen && (await citizen.matchPassword(password))) {
    generateToken(res, citizen._id);
    res.status(200).json({ redirectUrl: '/citizen-dashboard' });
  } else {
    res.status(401).json({ message: 'Invalid phone number or password' });
  }
};


// @desc    Auth admin & get token
// @route   POST /api/auth/login/admin
exports.loginAdmin = async (req, res) => {
    const { adminId, password } = req.body;
    const recaptchaToken = req.body['g-recaptcha-response'];

    if (!(await verifyRecaptcha(recaptchaToken))) {
        return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
    }

    const admin = await Admin.findOne({ adminId });

    if (admin && (await admin.matchPassword(password))) {
        generateToken(res, admin._id);
        res.status(200).json({ redirectUrl: '/admin-dashboard' });
    } else {
        res.status(401).json({ message: 'Invalid Admin ID or password' });
    }
};


// @desc    Logout user
// @route   GET /api/auth/logout
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.redirect('/');
};