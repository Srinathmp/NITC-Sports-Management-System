const asyncHandler = require('express-async-handler');
const NIT = require('../models/nit.model');
const events = require('../models/event.model')
const matches = require('../models/match.model')
const AuditLog = require('../models/auditLog.model');
const User = require('../models/user.model');

function mapStatus(action) {
    const lower = action?.toLowerCase() || '';
    if (lower.includes('approve') || lower.includes('create') || lower.includes('publish')) return 'success';
    if (lower.includes('reject') || lower.includes('delete')) return 'pending';
    return 'info';
}

const commonAdmin = asyncHandler(
    async (req, res) => {
        try {
            const page = Number(req.query.page);
            const approved = await NIT.countDocuments({ status: "Approved" })
            const pending = await NIT.countDocuments({ status: "Pending" })
            const eventsResult = await events.aggregate([
                { $group: { _id: '$sport' } },
                { $count: 'distinctCount' }
            ]);
            const eventsCount = await events.estimatedDocumentCount();
            const sportsCount = eventsResult.length > 0 ? eventsResult[0].distinctCount : 0;
            const scheduledMatches = await matches.countDocuments({ status: "Scheduled" })
            const completedMatches = await matches.countDocuments({ status: "Completed" })
            const nitList = await NIT
                .find({ status: "Pending" })
                .sort({ createdAt: -1 })
                .limit(3)
                .skip((page - 1) * 3)
                .select("name createdAt code");
            const logs = await AuditLog
                .aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "userDetails"
                        }
                    },
                    {
                        $unwind: '$userDetails'
                    },
                    {
                        $match: {
                            'userDetails.role': "CommonAdmin"
                        }
                    },
                    {
                        $project: {
                            'action': 1,
                            'details': 1,
                            'createdAt': 1
                        }
                    }, 
                    {
                        $sort: { createdAt: -1 }
                    }
                ])
                .limit(5)
            const formatted = logs.map((log) => ({
                action: log.action,
                details: log.details,
                createdAt: new Date(log.createdAt).toLocaleString()
            }))
            res
                .status(200)
                .json({
                    approved: approved, pending: pending, sportsCount: sportsCount, eventsCount: eventsCount,
                    scheduledMatches: scheduledMatches, completedMatches: completedMatches, pendingList: nitList, logs: formatted
                })
        } catch (error) {
            console.log(error)
        }
    }
)

const nitAdmin = asyncHandler(
    async (req, res) => {
        const approved = await NIT.countDocuments({ status: "Approved" })
        const pending = await NIT.countDocuments({ status: "Pending" })
        res.status(200).json({ approved: approved, pending: pending })
    }
)

const coach = asyncHandler(
    async (req, res) => {
        const approved = await NIT.countDocuments({ status: "Approved" })
        const pending = await NIT.countDocuments({ status: "Pending" })
        res.status(200).json({ approved: approved, pending: pending })
    }
)
module.exports = { commonAdmin, nitAdmin, coach }