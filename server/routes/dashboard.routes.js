const express = require('express')
const router = express.Router()
const { commonAdmin, nitAdmin, coach, public } = require('../controllers/dashboard.controller')
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

router.get('/common-admin', protect, authorizeRoles("CommonAdmin"), commonAdmin)
router.get('/nit-admin', protect, authorizeRoles("NITAdmin"), nitAdmin)
router.get('/coach', protect, authorizeRoles("Coach"), coach)
router.get('/public', public)

module.exports = router