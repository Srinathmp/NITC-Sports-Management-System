const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const NIT = require('../models/nit.model');

// Register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, nit_code, contactNumber } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const nit = await NIT.find({ code: nit_code });
  if (!nit) { res.status(404); throw new Error('NIT not found'); }
  const nit_id = nit[0]._id
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const user = await User.create({
    name, email, passwordHash: hash, role, nit_id, contactNumber
  });
  res.status(201).json({ id: user._id, name: user.name, email: user.email, role: user.role });
});

// Authenticate & get token
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, id: user._id, name: user.name, role: user.role });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

module.exports = { registerUser, authUser };