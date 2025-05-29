const express = require('express');
const { Note } = require('../models/note');
const router = express.Router();

// Get notes for a lesson
router.get('/:lessonId', async (req, res) => {
  const { lessonId } = req.params;
  const notes = await Note.findAll({ where: { lessonId } });
  res.json(notes);
});

// Add a note to a lesson
router.post('/:lessonId', async (req, res) => {
  const { lessonId } = req.params;
  const { userId, content } = req.body;
  if (!userId || !content) {
    return res.status(400).json({ error: "userId and content are required" });
  }
  try {
    const note = await Note.create({ lessonId: Number(lessonId), userId, content });
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;