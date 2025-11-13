const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const serverless = require('serverless-http');

const connectDB = require('../config/connect.db');
const { notFound, errorHandler } = require('../middleware/errorHandler.middleware');

dotenv.config({ path: './.env' });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ROUTES
app.use('/mess',            require('../routes/mess.routes'));
app.use('/events',          require('../routes/event.routes'));
app.use('/v1/teams',        require('../routes/team.routes'));
app.use('/nits',            require('../routes/nit.routes'));
app.use('/auditlogs',       require('../routes/auditLog.routes'));
app.use('/users',           require('../routes/user.routes'));
app.use('/matches',         require('../routes/match.routes'));
app.use('/dashboard',       require('../routes/dashboard.routes'));
app.use('/v1/leaderboard',  require('../routes/leaderboard.routes'));
app.use('/notifications',   require('../routes/notification.routes'));
app.use('/accommodation',   require('../routes/accommodation.routes'));
app.use('/bookings',        require('../routes/booking.routes'));

app.use(notFound);
app.use(errorHandler);

module.exports = serverless(app);