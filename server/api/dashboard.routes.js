const express = require('express')
const router = express.Router()
const { protect, authorizeRoles } = require('../middleware/auth.middleware');
const { commonAdmin, nitAdmin, coach, public } = require('../controllers/dashboard.controller')

router.get('/public', public)
router.get('/coach', protect, authorizeRoles("Coach"), coach)
router.get('/nit-admin', protect, authorizeRoles("NITAdmin"), nitAdmin)
router.get('/common-admin', protect, authorizeRoles("CommonAdmin"), commonAdmin)

module.exports = router