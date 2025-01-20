const express = require('express');
const { User } = require('../models');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

module.exports = router;
