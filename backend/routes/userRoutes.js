const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', {
      expiresIn: '1h',
    });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update high score
router.put('/score', async (req, res) => {
  const { token, difficulty, score } = req.body;

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.userId);

    if (score > user.highScores[difficulty]) {
      user.highScores[difficulty] = score;
      await user.save();
    }

    res.json({ message: 'Score updated successfully', highScores: user.highScores });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to get leaderboard
router.get('/leaderboard', async (req, res) => {
  const { difficulty } = req.query;
  if (!difficulty) {
    return res.status(400).json({ error: 'Difficulty query parameter is required' });
  }
  try {
    const users = await User.find()
      .sort({ [`highScores.${difficulty}`]: -1 })
      .limit(10)
      .select('username highScores');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Get global rankings
router.get('/rankings', async (req, res) => {
  try {
    const users = await User.find().sort({ 'highScores.hard': -1, 'highScores.medium': -1, 'highScores.easy': -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
