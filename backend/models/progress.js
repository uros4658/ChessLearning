const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('User');
const Lesson = require('Lesson');

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, references: { model: User, key: 'id' } },
  lessonId: { type: DataTypes.INTEGER, references: { model: Lesson, key: 'id' } },
  status: { type: DataTypes.ENUM('completed', 'in-progress'), defaultValue: 'in-progress' },
  performanceStats: { type: DataTypes.JSON, defaultValue: {} },
});

module.exports = Progress;