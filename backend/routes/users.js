const express = require('express');
const { User } = require('../models');
const router = express.Router();
const authenticateJWT = require('../middleware/auth');
const { generateToken} = require('../utils/jwt')

// Get all users
router.get('/', authenticateJWT, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (currentUser.blocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }
    const users = await User.findAll({
      order: [
        ['lastLogin', 'DESC']
      ]
  });
    res.json(users);
  } catch(error) {
    res.status(500).json({error: 'Failed to fetch users.'});
  }
});

// Create a new user
router.post('/register', async (req, res) => {
  try {
    const {name, email, password} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const newUser = await User.create({ name, email, password});
    res.status(201).json({message: 'User successfully registered!', user: newUser});
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email is already in use.' });
    }
    res.status(500).json({ error: 'Failed to create user.' });
  }
});

// Delete a user by ID
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const { id } = req.params;
    const currentUserId = req.userId;
    const currentUser = await User.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (currentUser.blocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

// Login Route
router.put('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    const isValidPassword = await user.isValidPassword(password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.blocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }

    const token = generateToken(user.id);

    user.lastLogin = new Date();
    await user.save();

    res.status(200).json({ message: 'Sign-in successful.', token, userId: user.id, lastLogin: user.lastLogin });

  } catch (error) {

    res.status(500).json({ message: 'Internal Server Error', error: error.message});
  }
});

// Block a user
router.put('/:id/block', authenticateJWT, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (currentUser.blocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }

    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.blocked = true;
    await user.save();

    res.status(200).json({
      message: 'User blocked successfully.',
      blocked: user.blocked,
      tokenExpired: true,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block user.' });
  }
});

// Unblock a user
router.put('/:id/unblock', authenticateJWT, async (req, res) => {
  try {
    const currentUserId = req.userId;
    const currentUser = await User.findOne({ where: { id: currentUserId } });
    if (!currentUser) {
      return res.status(401).json({ message: 'User not found.' });
    }

    if (currentUser.blocked) {
      return res.status(403).json({ message: 'Your account is blocked' });
    }
    
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    user.blocked = false;
    await user.save();

    res.status(200).json({
      message: 'User unblocked successfully.',
      blocked: user.blocked,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user.' });
  }
});

module.exports = router;
