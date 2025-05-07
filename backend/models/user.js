const pool = require('../db');
const bcrypt = require('bcryptjs');

// Get all users
const getAllUsers = async () => {
  const [rows] = await pool.query('SELECT * FROM Users');
  return rows;
};

// Create a new user (Register)
const createUser = async (username, email, password, role = 'user') => {
  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const [result] = await pool.query(
    'INSERT INTO Users (username, email, passwordHash, role) VALUES (?, ?, ?, ?)',
    [username, email, passwordHash, role]
  );
  return result.insertId;
};

// Login user
const loginUser = async (email, password) => {
  const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
  if (rows.length === 0) {
    throw new Error('User not found');
  }

  const user = rows[0];
  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Return user details (excluding passwordHash)
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };
};

// Update user details
const updateUser = async (id, updates) => {
  const fields = [];
  const values = [];

  // Dynamically build the query based on the fields to update
  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`);
    values.push(value);
  }

  values.push(id); // Add the user ID to the values array

  const query = `UPDATE Users SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.query(query, values);

  if (result.affectedRows === 0) {
    throw new Error('User not found');
  }

  return result.affectedRows;
};

// Delete user
const deleteUser = async (id) => {
  const [result] = await pool.query('DELETE FROM Users WHERE id = ?', [id]);
  if (result.affectedRows === 0) {
    throw new Error('User not found');
  }
  return result.affectedRows;
};

module.exports = { getAllUsers, createUser, loginUser, updateUser, deleteUser };