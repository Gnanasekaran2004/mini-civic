/* // server.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const citizenRoutes = require('./routes/citizenRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Body parser & Cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set template engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/citizen', citizenRoutes);
app.use('/api/admin', adminRoutes);

// Page Rendering Routes
app.get('/', (req, res) => res.render('index'));
app.get('/citizen-login', (req, res) => res.render('citizen_login', { recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY }));
app.get('/admin-login', (req, res) => res.render('admin_login', { recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY }));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`)); */
// server.js

const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/authRoutes');
const citizenRoutes = require('./routes/citizenRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Body parser & Cookie parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set template engine
app.set('view engine', 'ejs');

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


// Mount routers for API
app.use('/api/auth', authRoutes);

// Mount routers for Page Rendering
app.get('/', (req, res) => res.render('index'));
app.get('/citizen-login', (req, res) => res.render('citizen_login', { recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY }));
app.get('/admin-login', (req, res) => res.render('admin_login', { recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY }));

// ✅ These lines connect the route files to your app
app.use('/', citizenRoutes);
app.use('/', adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));