// Populate database with some initial data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/user.model');
const NIT = require('../models/nit.model');
const Team = require('../models/team.model');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear old data (optional)
    await Promise.all([
      User.deleteMany({}),
      NIT.deleteMany({}),
      Team.deleteMany({})
    ]);

    // Create NIT
    const nit = await NIT.create({
      name: 'NIT Trichy',
      code: 'NITT',
      location: 'Tiruchirappalli, Tamil Nadu',
      status: 'Pending',
      isHost: false
    });

    // Hash password helper
    const hashPwd = async (plain) => {
      const salt = await bcrypt.genSalt(10);
      return await bcrypt.hash(plain, salt);
    };

    // Create CommonAdmin
    const commonAdmin = await User.create({
      name: 'Common Admin',
      email: 'commonadmin@insms.com',
      passwordHash: await hashPwd('admin123'),
      role: 'CommonAdmin'
    });

    // Create NITAdmin
    const nitAdmin = await User.create({
      name: 'NIT Trichy Admin',
      email: 'nittadmin@insms.com',
      passwordHash: await hashPwd('admin123'),
      role: 'NITAdmin',
      nit_id: nit._id
    });

    // Create Coach
    const coach = await User.create({
      name: 'Coach Rahul',
      email: 'coach@insms.com',
      passwordHash: await hashPwd('coach123'),
      role: 'Coach',
      nit_id: nit._id
    });

    // Create a Team
    const team = await Team.create({
      name: 'Trichy Tigers',
      sport: 'Cricket',
      coach_id: coach._id,
      nit_id: nit._id,
      players: [
        { name: 'Player One', jerseyNo: 7, position: 'Batsman' },
        { name: 'Player Two', jerseyNo: 10, position: 'Bowler' }
      ]
    });

    console.log('Seed Data Created Successfully');
    console.log(`Common Admin Login: ${commonAdmin.email} / admin123`);
    console.log(`NIT Admin Login: ${nitAdmin.email} / admin123`);
    console.log(`Coach Login: ${coach.email} / coach123`);
    console.log('NIT Registered:', nit.name);
    console.log('Team Registered:', team.name);

    await mongoose.disconnect();
    console.log('Database connection closed');
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seed();