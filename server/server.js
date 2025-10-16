// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

app.get('/', (req, res) => {
  res.send('INSMS API is running...');
});

const PORT = process.env.PORT || 5000;

const connectDB = require('./config/db');
connectDB();


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

