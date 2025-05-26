const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  relatedLessonId: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'Lessons', key: 'id' } },
  fen: { type: DataTypes.STRING, allowNull: true }, // starting position
  moves: { type: DataTypes.JSON, allowNull: true }, // array of moves
  type: { type: DataTypes.STRING, allowNull: false }, // 'opening' or 'endgame'
  explanations: { type: DataTypes.JSON, allowNull: true } // array of explanations
}, {
  tableName: 'Lessons',
  timestamps: false
});

module.exports = { Lesson, /* ...other exports... */ };

const getAllLessons = async () => Lesson.findAll({ where: { relatedLessonId: null } });

const getLessonById = async (id) => Lesson.findByPk(id);

const createLesson = async (title, content, relatedLessonId = null) => {
  const lesson = await Lesson.create({ title, content, relatedLessonId });
  return lesson.id;
};

const updateLesson = async (id, updates) => {
  const [affectedRows] = await Lesson.update(updates, { where: { id } });
  if (affectedRows === 0) throw new Error('Lesson not found');
  return affectedRows;
};

const deleteLesson = async (id) => {
  const affectedRows = await Lesson.destroy({ where: { id } });
  if (affectedRows === 0) throw new Error('Lesson not found');
  return affectedRows;
};

module.exports = { Lesson, getAllLessons, getLessonById, createLesson, updateLesson, deleteLesson };