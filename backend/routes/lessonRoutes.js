const express = require('express');
const { getAllLessons, createLesson, getLessonById } = require('../models/lesson');
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

router.get('/:id', async (req, res) => {
  try {
    const lesson = await getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
    res.json(lesson);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id/related', async (req, res) => {
  try {
    const related = await Lesson.findAll({ where: { relatedLessonId: req.params.id } });
    res.json(related);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;