const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/connect.db');
const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middleware/errorHandler.middleware');

dotenv.config({ path: './.env' });
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/mess',            require('./routes/mess.routes'));
app.use('/api/events',          require('./routes/event.routes'));
app.use('/api/v1/teams',        require('./routes/team.routes'));
app.use('/api/nits',            require('./routes/nit.routes'));
app.use('/api/auditlogs',       require('./routes/auditLog.routes'));
app.use('/api/users',           require('./routes/user.routes'));
app.use('/api/events',          require('./routes/event.routes'));
app.use('/api/matches',         require('./routes/match.routes'));
app.use('/api/dashboard',       require('./routes/dashboard.routes'));
app.use('/api/v1/leaderboard',  require('./routes/leaderboard.routes'));
app.use('/api/notifications',   require('./routes/notification.routes'));
app.use('/api/accommodation',   require('./routes/accommodation.routes'));
app.use('/api/bookings', require('./routes/booking.routes'));
// Error handler  
app.use(notFound);
app.use(errorHandler);

app.get('/', (req, res) => {
  res.send('INSMS API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
