const express = require('express');
const { getAllLessons, createLesson } = require('../models/lesson');
const router = express.Router();

// Get all lessons
router.get('/', async (req, res) => {
  try {
    const lessons = await getAllLessons();
    res.json(lessons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new lesson
router.post('/', async (req, res) => {
  const { title, content, level, difficulty, topic, interactiveData } = req.body;
  try {
    const lessonId = await createLesson(title, content, level, difficulty, topic, interactiveData);
    res.status(201).json({ id: lessonId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;