const express = require('express');
const { getAllUsers, createUser, loginUser } = require('../models/user');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user (Register)
router.post('/', async (req, res) => {
  const { username, email, password, role } = req.body; // Accept 'password'
  try {
    const userId = await createUser(username, email, password, role); // Pass 'password'
    res.status(201).json({ id: userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;