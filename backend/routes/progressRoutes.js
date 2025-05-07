const express = require('express');
const { getProgressByUserId, updateProgress } = require('../models/progress');
const router = express.Router();

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

// Update progress for a lesson
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { status, performanceStats } = req.body;
  try {
    const rowsUpdated = await updateProgress(id, status, performanceStats);
    if (rowsUpdated === 0) return res.status(404).json({ error: 'Progress not found' });
    res.json({ message: 'Progress updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;