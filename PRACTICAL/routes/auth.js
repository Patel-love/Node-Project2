const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// GET login page
router.get('/login', (req, res) => {
  // Check if user is already logged in
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/tasks');
  }
  res.render('login', { user: null, error: null });
});

// POST login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Find user
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res.render('login', { 
        user: null, 
        error: 'Invalid username or password' 
      });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Set cookie and redirect
    res.cookie('token', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }).redirect('/tasks');

  } catch (err) {
    console.error('Login error:', err);
    res.render('login', { 
      user: null, 
      error: 'An error occurred during login' 
    });
  }
});

// GET register page
router.get('/register', (req, res) => {
  const token = req.cookies.token;
  if (token) {
    return res.redirect('/tasks');
  }
  res.render('register', { user: null, error: null });
});

// POST register
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.render('register', {
        user: null,
        error: 'Username already exists'
      });
    }

    // Create new user
    const user = new User({ username, password });
    await user.save();
    
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Registration error:', err);
    res.render('register', {
      user: null,
      error: 'An error occurred during registration'
    });
  }
});

// GET logout
router.get('/logout', (req, res) => {
  res.clearCookie('token').redirect('/auth/login');
});

module.exports = router;