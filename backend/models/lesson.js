const pool = require('../db');

// Get progress for a user
const getProgressByUserId = async (userId) => {
  const [rows] = await pool.query('SELECT * FROM Progress WHERE userId = ?', [userId]);
  return rows;
};

// Update progress for a lesson
const updateProgress = async (id, status, performanceStats) => {
  const [result] = await pool.query(
    'UPDATE Progress SET status = ?, performanceStats = ? WHERE id = ?',
    [status, JSON.stringify(performanceStats), id]
  );
  return result.affectedRows;
};

module.exports = { getProgressByUserId, updateProgress };