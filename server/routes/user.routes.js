const express = require('express');
const router = express.Router();
const { registerUser, authUser, verify } = require('../controllers/user.controller');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/me', verify)

module.exports = router;