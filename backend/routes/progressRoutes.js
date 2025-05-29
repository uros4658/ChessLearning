const express = require('express');
const { getProgressByUserId, updateProgress } = require('../models/progress');
const router = express.Router();
const { User } = require('../models/user');

// Get progress for a user
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const progress = await getProgressByUserId(userId);
    res.json(progress);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update progress for a lesson and update XP, streak, level
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, performanceStats, userId } = req.body;
  try {
    const rowsUpdated = await updateProgress(id, status, performanceStats, userId);
    if (rowsUpdated === 0) return res.status(404).json({ error: 'Progress not found' });

    // XP, streak, level logic
    const user = await User.findByPk(userId);
    const now = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    let streak = user.streak || 0;
    if (lastActive) {
      const diff = (now - lastActive) / (1000 * 60 * 60 * 24);
      if (diff < 2 && diff >= 1) streak += 1;
      else if (diff >= 2) streak = 1;
      // else (same day) streak unchanged
    } else {
      streak = 1;
    }
    let xpGain = 10 + (streak > 1 ? 5 : 0);
    let xp = (user.xp || 0) + xpGain;
    let level = Math.floor(xp / 100) + 1;
    await user.update({ xp, level, streak, lastActive: now });

    res.json({ message: 'Progress updated successfully', xp, level, streak });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;