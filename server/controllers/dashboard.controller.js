const asyncHandler = require('express-async-handler');
const NIT = require('../models/nit.model');
const events = require('../models/event.model')
const matches = require('../models/match.model')
const AuditLog = require('../models/auditLog.model');
const User = require('../models/user.model');
const teams = require('../models/team.model')

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
                .select("name createdAt code isHost");
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
        const nit = await NIT.findOne({ _id: req.user.nit_id }).select("isHost")
        const isHost = nit.isHost;
        const myTeams = await teams.find({ nit_id: req.user.nit_id }).countDocuments()
        const mySports = await teams.find({ nit_id: req.user.nit_id }).distinct("sport").countDocuments()
        const totalCount = await teams.countDocuments();
        const distinctValues = await teams.distinct("nit_id").countDocuments();
        const upcomingEvents = await events
            .find({})
            .sort({ datetime: -1 })
            .limit(4)
            .select("name venue datetime registeredTeams")
        res
            .status(200)
            .json({
                isHost: isHost, totalCount: totalCount, distinctValues: distinctValues, upcomingEvents: upcomingEvents, myTeams: myTeams, mySports:mySports
            })
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