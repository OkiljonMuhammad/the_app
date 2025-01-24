const express = require('express');
const cors = require('cors');
const path = require('path');
const usersRouter = require('./routes/users');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/users', usersRouter);

// Serve React static files
app.use(express.static(path.join(__dirname, 'build')));

// Catch-all route to serve React's index.html for other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = app;
