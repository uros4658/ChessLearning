const express = require('express');
const { getProgressByUserId, updateProgress } = require('../models/progress');
const router = express.Router();
const { User } = require('../models/user');
const { setProgress } = require('../models/progress');

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
    let rowsUpdated = await updateProgress(id, status, performanceStats, userId);

    // If no row was updated, create it and update again
    if (rowsUpdated[0] === 0) {
      await setProgress(userId, id, status === "completed");
      rowsUpdated = await updateProgress(id, status, performanceStats, userId);
    }

    // XP, streak, level logic
    const user = await User.findByPk(userId);
    const now = new Date();
    const lastActive = user.lastActive ? new Date(user.lastActive) : null;
    let streak = user.streak || 0;
    if (lastActive) {
      const diff = (now - lastActive) / (1000 * 60 * 60 * 24);
      if (diff < 2 && diff >= 1) streak += 1;
      else if (diff >= 2) streak = 1;
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