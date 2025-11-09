const asyncHandler = require('express-async-handler');
const Team = require('../models/team.model');
const NIT  = require('../models/nit.model');

// ------- existing handlers (kept) -------

const createTeam = asyncHandler(async (req, res) => {
  const { name, sport, nit_code, players } = req.body;

  // find NIT first
  const nit = await NIT.findOne({ code: nit_code });
  if (!nit) { res.status(404); throw new Error('NIT not found'); }

  // ensure uniqueness within the same NIT & sport
  const exists = await Team.findOne({ name, sport, nit_id: nit._id });
  if (exists) {
    res.status(400);
    throw new Error('Team already registered for this sport in the NIT');
  }

  const team = await Team.create({
    name, sport, nit_id: nit._id, players, coach_id: req.user._id
  });

  res.status(201).json(team);
});

const getTeamsByNIT = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const nit = await NIT.findOne({ code });
  if (!nit) { res.status(404); throw new Error('NIT not found'); }

  const teams = await Team.find({ nit_id: nit._id }).populate('coach_id', 'name');
  res.json(teams);
});

const getAllNIT = asyncHandler(async (req, res) => {
  const page = Number(req.query.page || 1);
  const teams = await Team
    .find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .skip((page - 1) * 6);

  res.json(teams);
});

// ------- coach: fetch team by sport -------

/**
 * GET /api/v1/teams/me/by-sport?sport=Basketball
 */
const getMyTeamBySport = asyncHandler(async (req, res) => {
  const coachId = req.user?._id;
  const { sport } = req.query;

  if (!coachId) return res.status(401).json({ message: 'Unauthorized' });
  if (!sport)   return res.status(400).json({ message: 'sport is required' });

  const team = await Team.findOne({ coach_id: coachId, sport }).lean();
  if (!team) return res.status(404).json({ message: 'Team not found for this sport' });

  const players = (team.players || []).map(p => ({
    id: p.jerseyNo ?? null,
    name: p.name,
    position: p.position || '',
    jerseyNo: p.jerseyNo ?? null
  }));

  res.json({
    team: {
      id: team._id,
      name: team.name,
      sport: team.sport,
      nit_id: team.nit_id,
      totalPlayers: players.length
    },
    players
  });
});

// ------- coach: add player -------

/**
 * POST /api/v1/teams/me/by-sport/players
 * body: { sport, player: { name, position, jerseyNo } }
 */
const addPlayerToMyTeamBySport = asyncHandler(async (req, res) => {
  const coachId = req.user?._id;
  const { sport, player } = req.body;

  if (!coachId) return res.status(401).json({ message: 'Unauthorized' });
  if (!sport)    return res.status(400).json({ message: 'sport is required' });

  if (!player || !player.name || !player.position || player.jerseyNo == null) {
    return res.status(400).json({ message: 'player.name, player.position, player.jerseyNo are required' });
  }

  const team = await Team.findOne({ coach_id: coachId, sport });
  if (!team) return res.status(404).json({ message: 'Team not found for this sport' });

  const jerseyNo = Number(player.jerseyNo);
  if (!Number.isFinite(jerseyNo) || jerseyNo <= 0) {
    return res.status(400).json({ message: 'jerseyNo must be a positive number' });
  }

  const dup = (team.players || []).some(p => Number(p.jerseyNo) === jerseyNo);
  if (dup) return res.status(409).json({ message: 'A player with this jersey number already exists' });

  team.players.push({
    name: String(player.name).trim(),
    position: String(player.position).trim(),
    jerseyNo
  });

  await team.save();

  res.status(201).json({
    player: { id: jerseyNo, name: player.name, position: player.position, jerseyNo },
    totalPlayers: team.players.length
  });
});

// ------- coach: update player (by old jerseyNo in URL) -------

/**
 * PATCH /api/v1/teams/me/by-sport/players/:jerseyNo
 * body: { sport, player: { name?, position?, jerseyNo? } }
 */
const updatePlayerInMyTeamBySport = asyncHandler(async (req, res) => {
  const coachId = req.user?._id;
  const oldJerseyNo = Number(req.params.jerseyNo);
  const { sport, player = {} } = req.body;

  if (!coachId) return res.status(401).json({ message: 'Unauthorized' });
  if (!sport)    return res.status(400).json({ message: 'sport is required' });
  if (!Number.isFinite(oldJerseyNo) || oldJerseyNo <= 0) {
    return res.status(400).json({ message: 'Invalid jerseyNo in URL' });
  }

  const team = await Team.findOne({ coach_id: coachId, sport });
  if (!team) return res.status(404).json({ message: 'Team not found for this sport' });

  const idx = (team.players || []).findIndex(p => Number(p.jerseyNo) === oldJerseyNo);
  if (idx === -1) return res.status(404).json({ message: 'Player not found' });

  if (player.jerseyNo != null) {
    const n = Number(player.jerseyNo);
    if (!Number.isFinite(n) || n <= 0) return res.status(400).json({ message: 'jerseyNo must be a positive number' });
    const dup = team.players.some((p, i) => i !== idx && Number(p.jerseyNo) === n);
    if (dup) return res.status(409).json({ message: 'A player with this jersey number already exists' });
    team.players[idx].jerseyNo = n;
  }

  if (player.name != null)     team.players[idx].name = String(player.name).trim();
  if (player.position != null) team.players[idx].position = String(player.position).trim();

  await team.save();

  const updated = team.players[idx];
  return res.json({
    player: {
      id: updated.jerseyNo,
      name: updated.name,
      position: updated.position || '',
      jerseyNo: updated.jerseyNo
    }
  });
});

// ------- coach: delete player (by jerseyNo in URL) -------

/**
 * DELETE /api/v1/teams/me/by-sport/players/:jerseyNo?sport=Basketball
 */
const deletePlayerInMyTeamBySport = asyncHandler(async (req, res) => {
  const coachId = req.user?._id;
  const jerseyNo = Number(req.params.jerseyNo);
  const { sport } = req.query;

  if (!coachId) return res.status(401).json({ message: 'Unauthorized' });
  if (!sport)    return res.status(400).json({ message: 'sport is required' });
  if (!Number.isFinite(jerseyNo) || jerseyNo <= 0) {
    return res.status(400).json({ message: 'Invalid jerseyNo in URL' });
  }

  const team = await Team.findOne({ coach_id: coachId, sport });
  if (!team) return res.status(404).json({ message: 'Team not found for this sport' });

  const before = team.players.length;
  team.players = (team.players || []).filter(p => Number(p.jerseyNo) !== jerseyNo);
  if (team.players.length === before) return res.status(404).json({ message: 'Player not found' });

  await team.save();
  return res.json({ ok: true, totalPlayers: team.players.length });
});


// -------------------------------------------------------------------
// NEW: Public listing + Coach’s own teams (for Teams page & modal edit)
// -------------------------------------------------------------------

/**
 * GET /api/v1/teams/public?search=&sport=
 * Public list; if req.user exists (optional auth), marks isMyTeam.
 */
const listTeamsPublic = asyncHandler(async (req, res) => {
  const { search = '', sport, page = 1, limit = 9 } = req.query;
  const q = {};
  if (sport && sport !== 'All Sports') q.sport = sport;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Base team query
  const teams = await Team.find(q)
    .populate({ path: 'nit_id', select: 'name' })
    .populate({ path: 'coach_id', select: 'name role' })
    .lean();

  // Search filtering (if applicable)
  const filtered = (search
    ? teams.filter(t => {
        const rx = new RegExp(search.trim(), 'i');
        const coachName = t.coach_id?.name || '';
        const nitName   = t.nit_id?.name || '';
        return rx.test(t.name) || rx.test(coachName) || rx.test(nitName);
      })
    : teams
  );

  const me = req.user?._id?.toString();
  const out = filtered.map(t => ({
    id: t._id,
    teamName: t.name,
    nitName: t.nit_id?.name || 'NIT',
    sport: t.sport,
    coachName: t.coach_id?.name || '—',
    playersCount: Array.isArray(t.players) ? t.players.length : 0,
    isMyTeam: me ? (t.coach_id?._id?.toString() === me) : false,
  }));

  const total = out.length;
  const paginated = out.slice(skip, skip + parseInt(limit));

  res.json({
    items: paginated,
    total,
    totalPages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  });
});

module.exports = { listTeamsPublic };


/**
 * GET /api/v1/teams/mine
 * All teams for the logged-in Coach.
 */
const listMyTeams = asyncHandler(async (req, res) => {
  const coachId = req.user?._id;
  if (!coachId) return res.status(401).json({ message: 'Unauthorized' });

  const teams = await Team.find({ coach_id: coachId })
    .populate({ path: 'nit_id', select: 'name' })
    .lean();

  const out = teams.map(t => ({
    id: t._id,
    teamName: t.name,
    nitName: t.nit_id?.name || 'NIT',
    sport: t.sport,
    coachName: req.user?.name || 'You',
    playersCount: Array.isArray(t.players) ? t.players.length : 0,
    isMyTeam: true,
  }));

  res.json({ items: out, total: out.length });
});

module.exports = {
  createTeam,
  getTeamsByNIT,
  getAllNIT,
  getMyTeamBySport,
  addPlayerToMyTeamBySport,
  updatePlayerInMyTeamBySport,
  deletePlayerInMyTeamBySport,
  listTeamsPublic,   // ✅ NEW
  listMyTeams        // ✅ NEW
};
