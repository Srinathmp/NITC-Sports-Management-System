const AuditLog = require('../models/auditLog.model');
const User = require('../models/user.model');
const { Parser } = require('json2csv');

// @desc Get all audit logs with user details populated
// @route GET /api/auditlogs
// @access CommonAdmin / NITAdmin (depending on role)

const getAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate('user_id', 'name role email') // include user info
      .sort({ createdAt: -1 });

    // Format logs for frontend
    const formatted = logs.map(log => ({
      _id: log._id,
      actor: log.user_id ? `${log.user_id.role} - ${log.user_id.name}` : 'System',
      action: log.action,
      entity: log.entity,
      details: log.details,
      status: mapStatus(log.action),
      timestamp: log.createdAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    console.error('Error fetching audit logs:', err);
    res.status(500).json({ message: 'Failed to fetch audit logs.' });
  }
};

const exportAuditLogs = async (req, res) => {
  try {
    const logs = await AuditLog.find({})
      .populate('user_id', 'name role email')
      .sort({ createdAt: -1 });

    const formatted = logs.map((log) => ({
      Actor: log.user_id ? `${log.user_id.role} - ${log.user_id.name}` : 'System',
      Action: log.action,
      Entity: log.entity,
      Details: log.details,
      Status: mapStatus(log.action),
      Timestamp: new Date(log.createdAt).toLocaleString(),
    }));

    // Convert to CSV
    const parser = new Parser({ fields: Object.keys(formatted[0] || {}) });
    const csv = parser.parse(formatted);

    // Set headers for download
    res.header('Content-Type', 'text/csv');
    res.attachment(`audit_logs_${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    console.error('Error exporting audit logs:', err);
    res.status(500).json({ message: 'Failed to export audit logs.' });
  }
};

// Helper function to map action → visual status
function mapStatus(action) {
  const lower = action?.toLowerCase() || '';
  if (lower.includes('approve') || lower.includes('create') || lower.includes('publish')) return 'success';
  if (lower.includes('reject') || lower.includes('delete')) return 'pending';
  return 'info';
}

module.exports = { getAuditLogs,exportAuditLogs };
