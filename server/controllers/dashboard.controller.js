const asyncHandler = require('express-async-handler');
const NIT = require('../models/nit.model');
const events = require('../models/event.model');
const matches = require('../models/match.model');
const AuditLog = require('../models/auditLog.model');
const User = require('../models/user.model');
const teams = require('../models/team.model')
const notificationModel = require('../models/notification.model')

/* -------------------- COMMON ADMIN DASHBOARD -------------------- */
const commonAdmin = asyncHandler(async (req, res) => {
    try {
        const page = Number(req.query.page);
        const approved = await NIT.countDocuments({ status: "Approved" });
        const pending = await NIT.countDocuments({ status: "Pending" });

        const eventsResult = await events.aggregate([
            { $group: { _id: '$sport' } },
            { $count: 'distinctCount' }
        ]);
        const sportsCount = eventsResult.length > 0 ? eventsResult[0].distinctCount : 0;

        const eventsCount = await events.estimatedDocumentCount();
        const scheduledMatches = await matches.countDocuments({ status: "Scheduled" });
        const completedMatches = await matches.countDocuments({ status: "Completed" });

        const nitList = await NIT.find({ status: "Pending" })
            .sort({ createdAt: -1 })
            .limit(3)
            .skip((page - 1) * 3)
            .select("name createdAt code isHost adminEmail");

        const logs = await AuditLog.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: '$userDetails' },
            { $match: { 'userDetails.role': "CommonAdmin" } },
            {
                $project: {
                    'action': 1,
                    'details': 1,
                    'createdAt': 1
                }
            },
            { $sort: { createdAt: -1 } }
        ]).limit(5);

        const formatted = logs.map((log) => ({
            action: log.action,
            details: log.details,
            createdAt: new Date(log.createdAt).toLocaleString()
        }));

        res.status(200).json({
            approved,
            pending,
            sportsCount,
            eventsCount,
            scheduledMatches,
            completedMatches,
            pendingList: nitList,
            logs: formatted
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
});

function mapStatus(action) {
    const lower = action?.toLowerCase() || '';
    if (lower.includes('approve') || lower.includes('create') || lower.includes('publish')) return 'success';
    if (lower.includes('reject') || lower.includes('delete')) return 'pending';
    return 'info';
}

/* -------------------- NIT ADMIN DASHBOARD -------------------- */
const nitAdmin = asyncHandler(async (req, res) => {
    const nit = await NIT.findOne({ _id: req.user.nit_id }).select("isHost");
    const isHost = nit.isHost;

    const myTeams = await teams.find({ nit_id: req.user.nit_id }).countDocuments();
    const mySports = await teams.find({ nit_id: req.user.nit_id }).distinct("sport").countDocuments();
    const totalCount = await teams.countDocuments();
    const distinctValues = await teams.distinct("nit_id").countDocuments();

    const upcomingEvents = await events.find()
        .sort({ datetime: -1 })
        .limit(4)
        .select("name venue datetime registeredTeams");

    res.status(200).json({
        isHost,
        totalCount,
        distinctValues,
        upcomingEvents,
        myTeams,
        mySports
    });
});

/* -------------------- COACH DASHBOARD -------------------- */
const coach = asyncHandler(async (req, res) => {
    const coachId = req.user._id;

    const myTeams = await teams.find({ coach_id: coachId }).select('name sport players');
    const teamIds = myTeams.map(t => t._id);
    const totalPlayers = myTeams.reduce((sum, t) => sum + (t.players?.length || 0), 0);

    const now = new Date();
    const weekEnd = new Date(now);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const upcoming = await matches.find({
        matchDateTime: { $gte: now },
        $or: [{ teamA_id: { $in: teamIds } }, { teamB_id: { $in: teamIds } }]
    })
        .sort({ matchDateTime: 1 })
        .populate('teamA_id', 'name sport')
        .populate('teamB_id', 'name sport');

    const completed = await matches.find({
        status: 'Completed',
        $or: [{ teamA_id: { $in: teamIds } }, { teamB_id: { $in: teamIds } }]
    })
        .sort({ matchDateTime: -1 })
        .populate('teamA_id', 'name sport')
        .populate('teamB_id', 'name sport');

    const upcomingWeek = upcoming.filter(m => m.matchDateTime <= weekEnd).length;
    const wins = completed.filter(m => m.winner_id && teamIds.some(id => id.equals(m.winner_id))).length;
    const totalPlayed = completed.length;
    const winRate = totalPlayed ? Math.round((wins / totalPlayed) * 100) : 0;

    const fmtDate = d => new Date(d).toISOString().slice(0, 10);
    const fmtTime = d => {
        const dt = new Date(d);
        const h = dt.getHours() % 12 || 12;
        const m = dt.getMinutes().toString().padStart(2, '0');
        return `${h}:${m} ${dt.getHours() >= 12 ? 'PM' : 'AM'}`;
    };

    const myTeamsFormatted = myTeams.map(t => {
        const next = upcoming.find(m => (m.teamA_id._id.equals(t._id)) || (m.teamB_id._id.equals(t._id)));
        return {
            sport: t.sport,
            players: t.players.length,
            playerList: t.players,
            status: next ? 'active' : 'preparing',
            nextDate: next ? fmtDate(next.matchDateTime) : 'No Schedule'
        };
    });

    const upcomingMatches = upcoming.slice(0, 2).map(m => {
        const oursIsA = teamIds.some(id => id.equals(m.teamA_id._id));
        const opponent = oursIsA ? m.teamB_id.name : m.teamA_id.name;
        return {
            sport: m.teamA_id.sport || m.teamB_id.sport,
            opponent: `vs ${opponent}`,
            timeLocation: fmtTime(m.matchDateTime),
            date: fmtDate(m.matchDateTime)
        };
    });

    const recentResults = completed.slice(0, 3).map(m => {
        const oursIsA = teamIds.some(id => id.equals(m.teamA_id._id));
        const ourScore = oursIsA ? m.scoreA : m.scoreB;
        const oppScore = oursIsA ? m.scoreB : m.scoreA;
        const opponent = oursIsA ? m.teamB_id.name : m.teamA_id.name;
        const won = m.winner_id && teamIds.some(id => id.equals(m.winner_id));
        return {
            sport: m.teamA_id.sport || m.teamB_id.sport,
            opponent,
            score: `${won ? 'Won' : 'Lost'} ${ourScore}-${oppScore}`,
            date: fmtDate(m.matchDateTime),
            result: won ? 'Won' : 'Lost'
        };
    });

    res.json({
        stats: {
            myTeams: myTeams.length,
            totalPlayers,
            upcomingMatches: upcomingWeek,
            winRate: `${winRate}%`
        },
        myTeams: myTeamsFormatted,
        upcomingMatches,
        recentResults
    });
});

/* -------------------- PUBLIC DASHBOARD -------------------- */
const public = asyncHandler(async (req, res) => {
    const topPerformers = await NIT.find()
        .sort({ points: -1 })
        .limit(3)
        .select("name points")
        .lean();

    const liveMatches = await matches.find({ status: "Completed" })
        .populate("teamA_id", "name")
        .populate("teamB_id", "name")
        .sort({ matchDateTime: 1 })
        .limit(5)
        .lean();

    const upcomingEvents = await events.find({ status: "Scheduled" })
        .sort({ date: 1 })
        .limit(3)
        .lean();

    const announcements = await notificationModel.find({ type: "Announcement",recipientRole:"All" })
        .sort({ createdAt: -1 })
        .limit(3)
        .lean();

    const totalNITs = await NIT.countDocuments();
    const totalEvents = await events.countDocuments();
    const totalMatches = await matches.countDocuments();

    const totalMedalsAgg = await NIT.aggregate([
        { $group: { _id: null, medals: { $sum: "$medals" } } }
    ]);

    res.json({
        topPerformers,
        liveMatches,
        upcomingEvents,
        announcements,
        stats: {
            totalNITs,
            totalEvents,
            totalMatches,
            totalMedals: totalMedalsAgg?.[0]?.medals || 0
        }
    });
});

module.exports = {
    commonAdmin,
    nitAdmin,
    coach,
    public
};