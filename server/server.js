// server.js
// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser')

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


//Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/nits', require('./routes/nitRoutes'));
app.use('/api/teams', require('./routes/teamRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Error handler
const { notFound, errorHandler } = require('./middleware/errorHandler');
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('INSMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

