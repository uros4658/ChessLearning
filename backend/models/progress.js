const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Progress = sequelize.define('Progress', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  lessonId: { type: DataTypes.INTEGER, allowNull: false },
  completed: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'Progress',
  timestamps: false
});

const getUserProgress = async (userId) => Progress.findAll({ where: { userId } });

const setProgress = async (userId, lessonId, completed) => {
  const [progress, created] = await Progress.findOrCreate({
    where: { userId, lessonId },
    defaults: { completed }
  });
  if (!created) {
    progress.completed = completed;
    await progress.save();
  }
  return progress;
};

module.exports = { Progress, getUserProgress, setProgress };