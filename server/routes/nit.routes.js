const express = require('express');
const router = express.Router();
const { registerNIT, listPendingNITs, updateNITStatus } = require('../controllers/nit.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.post('/register', registerNIT);
router.get('/pending', protect, authorizeRoles('CommonAdmin'), listPendingNITs);
router.patch('/:code/status', protect, authorizeRoles('CommonAdmin'), updateNITStatus);

module.exports = router;