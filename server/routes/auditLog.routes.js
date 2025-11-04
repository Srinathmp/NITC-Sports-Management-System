const express = require('express');
const router = express.Router();
const { getAuditLogs,exportAuditLogs } = require('../controllers/auditLog.controller');
const { protect, authorizeRoles } = require('../middleware/auth.middleware');

// Example: Only CommonAdmin can view all logs
router.get('/', protect, authorizeRoles('CommonAdmin'), getAuditLogs);
router.get('/export', protect, authorizeRoles('CommonAdmin'), exportAuditLogs); // Placeholder for export functionality
module.exports = router;
