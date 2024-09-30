const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Sign-up route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create a new user instance
    const newUser = new User({
      username,
      email,
      password, // Password will be hashed before saving (due to pre 'save' hook)
    });

    // Save the user in the database
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: 3600 });

    // Respond with the token
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
