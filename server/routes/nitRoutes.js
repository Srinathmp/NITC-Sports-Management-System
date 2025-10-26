const express = require('express');
const router = express.Router();
const { registerNIT, listPendingNITs, updateNITStatus } = require('../controllers/nitController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/register', registerNIT);
router.get('/pending', protect, authorizeRoles('CommonAdmin'), listPendingNITs);
router.patch('/:id/status', protect, authorizeRoles('CommonAdmin'), updateNITStatus);

module.exports = router;
