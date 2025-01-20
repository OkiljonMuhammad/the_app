const express = require('express');
const cors = require('cors');
const usersRouter = require('./routes/users');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', usersRouter);

module.exports = app;
