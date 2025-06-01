const express = require('express');
const { Lesson, getAllLessons, createLesson, getLessonById, updateLesson, deleteLesson } = require('../models/lesson');
const adminOnly = require('../middleware/admin');
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
router.post('/', adminOnly, async (req, res) => {
  const { title, content, relatedLessonId, fen, moves, type, explanations } = req.body;
  try {
    const lessonId = await createLesson(title, content, relatedLessonId, fen, moves, type, explanations);
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

// Admin: Create a new lesson
router.post('/', adminOnly, async (req, res) => {
  const { title, content, relatedLessonId, fen, moves, type, explanations } = req.body;
  try {
    const lessonId = await createLesson(title, content, relatedLessonId, fen, moves, type, explanations);
    res.status(201).json({ id: lessonId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update a lesson
router.put('/:id', adminOnly, async (req, res) => {
  try {
    const affectedRows = await updateLesson(req.params.id, req.body);
    if (affectedRows === 0) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete a lesson
router.delete('/:id', adminOnly, async (req, res) => {
  try {
    const affectedRows = await deleteLesson(req.params.id);
    if (affectedRows === 0) return res.status(404).json({ error: 'Lesson not found' });
    res.json({ message: 'Lesson deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;