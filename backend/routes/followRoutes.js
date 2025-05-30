const express = require('express');
const { Follow } = require('../models/follow');
const { User } = require('../models/user');
const router = express.Router();

// Follow a user by username
router.post('/follow', async (req, res) => {
  const { followerId, username } = req.body;
  if (!followerId || !username) return res.status(400).json({ error: "followerId and username required" });
  const userToFollow = await User.findOne({ where: { username } });
  if (!userToFollow) return res.status(404).json({ error: "User not found" });
  if (userToFollow.id === followerId) return res.status(400).json({ error: "Cannot follow yourself" });
  const [follow, created] = await Follow.findOrCreate({
    where: { followerId, followingId: userToFollow.id }
  });
  res.json({ message: created ? "Followed" : "Already following" });
});

// Unfollow a user by username
router.post('/unfollow', async (req, res) => {
  const { followerId, username } = req.body;
  if (!followerId || !username) return res.status(400).json({ error: "followerId and username required" });
  const userToUnfollow = await User.findOne({ where: { username } });
  if (!userToUnfollow) return res.status(404).json({ error: "User not found" });
  const deleted = await Follow.destroy({
    where: { followerId, followingId: userToUnfollow.id }
  });
  res.json({ message: deleted ? "Unfollowed" : "Not following" });
});

// Get users you follow
router.get('/following/:userId', async (req, res) => {
  const { userId } = req.params;
  const follows = await Follow.findAll({ where: { followerId: userId } });
  const ids = follows.map(f => f.followingId);
  const users = await User.findAll({ where: { id: ids }, attributes: ['id', 'username'] });
  res.json(users);
});

// Get your followers
router.get('/followers/:userId', async (req, res) => {
  const { userId } = req.params;
  const follows = await Follow.findAll({ where: { followingId: userId } });
  const ids = follows.map(f => f.followerId);
  const users = await User.findAll({ where: { id: ids }, attributes: ['id', 'username'] });
  res.json(users);
});

module.exports = router;