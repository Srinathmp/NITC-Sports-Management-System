// server.js
// require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const bodyParser = require('body-parser')

dotenv.config({path: './.env'});
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }))


//Routes
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/nits', require('./routes/nit.routes'));
app.use('/api/teams', require('./routes/team.routes'));
app.use('/api/events', require('./routes/event.routes'));
app.use('/api/matches', require('./routes/match.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));
app.use('/api/auditlogs', require('./routes/auditLog.routes'));
// Error handler
const { notFound, errorHandler } = require('./middleware/errorHandler.middleware');
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('INSMS API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));