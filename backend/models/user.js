const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'user' }
}, {
  tableName: 'Users',
  timestamps: false
});

// Get all users
const getAllUsers = async () => {
  return await User.findAll();
};

// Create a new user (Register)
const createUser = async (username, email, password, role = 'user') => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ username, email, passwordHash, role });
  return user.id;
};

// Login user
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('User not found');
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) throw new Error('Invalid credentials');
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

// Update user details
const updateUser = async (id, updates) => {
  const [affectedRows] = await User.update(updates, { where: { id } });
  if (affectedRows === 0) throw new Error('User not found');
  return affectedRows;
};

// Delete user
const deleteUser = async (id) => {
  const affectedRows = await User.destroy({ where: { id } });
  if (affectedRows === 0) throw new Error('User not found');
  return affectedRows;
};

module.exports = { User, getAllUsers, createUser, loginUser, updateUser, deleteUser };