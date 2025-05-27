const express = require('express');
const jwt = require('jsonwebtoken');
const { getAllUsers, createUser, loginUser } = require('../models/user');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';
const adminOnly = require('../middleware/admin');

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
  let { username, email, password, role } = req.body;
  // If registering as admin with admin/admin
  if (username === "admin" && password === "admin") {
    role = "admin";
  }
  try {
    const userId = await createUser(username, email, password, role);
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
    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Get all users
router.get('/', adminOnly, async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete a user
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const affectedRows = await deleteUser(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;