const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST: /api/users
router.post('/', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check if user already exists
    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).json({ message: 'User already exists', user: existingUser });
    }

    // Create and save new user
    const user = new User({ name, email });
    await user.save();

    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;
