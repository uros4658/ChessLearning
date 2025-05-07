const express = require('express');
const { getAllUsers, createUser } = require('../models/user');
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

// Create a new user
router.post('/', async (req, res) => {
  const { username, email, passwordHash, role } = req.body;
  try {
    const userId = await createUser(username, email, passwordHash, role);
    res.status(201).json({ id: userId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;