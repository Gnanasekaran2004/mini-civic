// utils/createAdmin.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        await Admin.deleteMany(); // Clear existing admins

        const admin = new Admin({
            adminId: 'admin',
            password: 'password123' // This will be hashed by the model pre-save hook
        });

        await admin.save();
        console.log('Admin user created successfully!');
        console.log('Admin ID: admin');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();