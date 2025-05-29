const express = require('express');
const jwt = require('jsonwebtoken');
const { User, getAllUsers, createUser, loginUser } = require('../models/user');
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

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await loginUser(email, password);
    // XP/streak logic for first login of the day
    const dbUser = await User.findByPk(user.id);
    const now = new Date();
    const lastActive = dbUser.lastActive ? new Date(dbUser.lastActive) : null;
    let streak = dbUser.streak || 0;
    let xp = dbUser.xp || 0;
    let level = dbUser.level || 1;
    let bonusGiven = false;
    if (!lastActive || now.toDateString() !== lastActive.toDateString()) {
      // First login today
      if (lastActive) {
        const diff = (now - lastActive) / (1000 * 60 * 60 * 24);
        if (diff < 2 && diff >= 1) streak += 1;
        else if (diff >= 2) streak = 1;
        // else (same day) streak unchanged
      } else {
        streak = 1;
      }
      const xpGain = 15; // e.g. 10 base + 5 bonus for login streak
      xp += xpGain;
      level = Math.floor(xp / 100) + 1;
      await dbUser.update({ xp, level, streak, lastActive: now });
      bonusGiven = true;
    }
    // Create JWT token
    const token = jwt.sign(
      { id: dbUser.id, username: dbUser.username, email: dbUser.email, role: dbUser.role, xp, level, streak },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: { ...user, xp, level, streak }, token, bonusGiven });
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

router.get('/leaderboard', async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['xp', 'DESC']],
      attributes: ['id', 'username', 'xp', 'level', 'streak']
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;