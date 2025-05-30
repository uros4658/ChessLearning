const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Follow = sequelize.define('Follow', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  followerId: { type: DataTypes.INTEGER, allowNull: false },
  followingId: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'Follows',
  timestamps: false
});

module.exports = { Follow };