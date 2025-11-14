import React, { useState, useEffect } from 'react';
import {
    Users, CalendarDays, Trophy, Edit, Eye,
    CheckCircle, XCircle, PlusCircle, Trash2
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';
import api from '../../api/axios';
import FullPageLoader from '../../components/FullPageLoader';

function StatCard({ title, value, subtitle, Icon }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
                <Icon className="h-6 w-6 text-gray-600" />
            </div>
        </div>
    );
}

function MyTeamCard({ team, index, onView }) {
    const { sport, players, nextDate } = team;
    const isGray = index % 2 !== 0;
    return (
        <div className={`relative rounded-lg p-4 shadow-sm border border-gray-200 overflow-hidden ${isGray ? 'bg-gray-50' : 'bg-white'} transition-shadow duration-200 hover:shadow-lg`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{sport}</h3>
                    <p className="text-sm text-gray-500 mt-1">{players} players</p>
                </div>
                <div className="flex gap-2">
                    <button className="cursor-pointer text-gray-500 hover:text-gray-700 p-2 rounded-lg border border-gray-300 hover:bg-gray-100">
                        <Edit className="h-5 w-5" />
                    </button>
                    <button
                        onClick={onView}
                        className="cursor-pointer text-gray-500 hover:text-gray-700 p-2 rounded-lg border border-gray-300 hover:bg-gray-100"
                    >
                        <Eye className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
                <p className="text-xs text-gray-500">Next: {nextDate}</p>
            </div>
        </div>
    );
}

function UpcomingMatchCard({ match }) {
    return (
        <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4 transition-shadow duration-200 hover:shadow-lg">
            <div>
                <p className="font-semibold text-gray-800">{match.sport}</p>
                <p className="text-sm text-gray-600 mt-1">{match.opponent}</p>
                <p className="text-sm text-gray-500 mt-1">{match.timeLocation}</p>
            </div>
            <span className="bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">{match.date}</span>
        </div>
    );
}

function RecentResultCard({ result }) {
    const colors = {
        Won: 'bg-green-100 text-green-700 border-green-400 hover:border-green-700 hover:shadow-xl',
        Lost: 'bg-red-100 text-red-700 border-red-400 hover:border-red-700 hover:shadow-xl'
    };
    const Icon = result.result === 'Won' ? CheckCircle : XCircle;
    return (
        <div className={`rounded-lg bg-white p-4 shadow-sm border ${colors[result.result]} transition-shadow duration-200`}>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium">{result.sport}</p>
                <span className={`flex items-center gap-1 text-xs font-semibold ${result.result === 'Won' ? 'text-green-700' : 'text-red-700'}`}>
                    <Icon className="h-4 w-4" /> {result.result}
                </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">vs {result.opponent}</p>
            <p className="text-xl font-bold text-gray-900 my-2">{result.score}</p>
            <p className="text-xs text-gray-500">{result.date}</p>
        </div>
    );
}

function TeamDetailsModal({ open, onClose, team }) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl w-96 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                >
                    ✖
                </button>
                <h2 className="text-xl font-bold mb-3 text-gray-800">{team?.sport} Team</h2>
                <p className="text-sm text-gray-600 mb-4">{team?.players} players</p>
                <div className="max-h-60 overflow-y-auto border rounded-md">
                    <table className="w-full text-sm text-gray-700">
                        <thead className="bg-gray-100 border-b text-gray-700">
                            <tr>
                                <th className="py-2 px-2 text-left w-10">#</th>
                                <th className="py-2 px-2 text-left w-16">Jersey</th>
                                <th className="py-2 px-2 text-left">Player</th>
                            </tr>
                        </thead>
                        <tbody>
                            {team?.playerList?.length > 0 ? (
                                team.playerList.map((p, i) => (
                                    <tr key={i} className="border-b">
                                        <td className="py-2 px-2">{i + 1}</td>
                                        <td className="py-2 px-2">{p.jerseyNo || '-'}</td>
                                        <td className="py-2 px-2">{p.name}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="py-3 text-center text-gray-500">
                                        No players added
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function RegisterTeamModal({ open, onClose, onSuccess, nit_id }) {
    const [teamName, setTeamName] = useState('');
    const [eventId, setEventId] = useState('');
    const [events, setEvents] = useState([]);
    const [players, setPlayers] = useState([{ name: '', jerseyNo: '' }]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            api.get('/events/allEventsPublic')
                .then(res => setEvents(res.data))
                .catch(err => console.error('Error fetching events:', err));
        }
    }, [open]);

    const handleAddPlayer = () => setPlayers([...players, { name: '', jerseyNo: '' }]);
    const handleRemovePlayer = (index) => setPlayers(players.filter((_, i) => i !== index));
    const handleChangePlayer = (index, key, value) => {
        const updated = [...players];
        updated[index][key] = value;
        setPlayers(updated);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            console.log(nit_id)
            await api.post('/v1/teams/create', { name: teamName, event_id: eventId, players, nit_id });
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error creating team:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-lg font-semibold mb-4">Register Team</h2>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Team Name</label>
                    <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-1">Select Event</label>
                    <select
                        value={eventId}
                        onChange={(e) => setEventId(e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select an event</option>
                        {events.map((ev) => (
                            <option key={ev._id} value={ev._id}>{ev.name} ({ev.sport})</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="block text-sm font-medium mb-2">Players</label>
                    {players.map((p, i) => (
                        <div key={i} className="flex gap-2 mb-2">
                            <input
                                type="text"
                                placeholder="Player Name"
                                value={p.name}
                                onChange={(e) => handleChangePlayer(i, 'name', e.target.value)}
                                className="w-2/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                                type="number"
                                placeholder="Jersey #"
                                value={p.jerseyNo}
                                onChange={(e) => handleChangePlayer(i, 'jerseyNo', e.target.value)}
                                className="w-1/3 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                            />
                            {i > 0 && (
                                <button onClick={() => handleRemovePlayer(i)} className="text-red-600 hover:text-red-800">
                                    <Trash2 size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddPlayer}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm mt-2"
                    >
                        <PlusCircle size={16} /> Add Player
                    </button>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
                        Close
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {loading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CoachDashboard() {
    const { name, nitId } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [myTeams, setMyTeams] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [recentResults, setRecentResults] = useState([]);
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [registerModalOpen, setRegisterModalOpen] = useState(false);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/dashboard/coach');
            setStats(res.data.stats);
            setMyTeams(res.data.myTeams);
            setUpcomingMatches(res.data.upcomingMatches);
            setRecentResults(res.data.recentResults);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    if (isLoading) return <FullPageLoader />;

    const statCards = [
        { title: 'My Teams', value: stats.myTeams || '0', subtitle: 'Active Teams', Icon: Users },
        { title: 'Total Players', value: stats.totalPlayers || '0', subtitle: 'Across all teams', Icon: Users },
        { title: 'Upcoming Matches', value: stats.upcomingMatches || '0', subtitle: 'Next 7 days', Icon: CalendarDays },
        { title: 'Win Rate', value: stats.winRate || '0%', subtitle: 'This Tournament', Icon: Trophy },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 px-4 md:px-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {name}</h1>
                <p className="text-md text-gray-500">COACH</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">My Teams</h2>
                            <p className="text-sm text-gray-500">Teams under your coaching</p>
                        </div>
                        <button
                            onClick={() => setRegisterModalOpen(true)}
                            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                        >
                            + Register Team
                        </button>
                    </div>

                    {myTeams.length > 0 ? (
                        <div className="space-y-4">
                            {myTeams.map((t, i) => (
                                <MyTeamCard
                                    key={i}
                                    team={t}
                                    index={i}
                                    onView={() => { setSelectedTeam(t); setTeamModalOpen(true); }}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4">No teams registered!!</div>
                    )}
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold text-gray-800">Upcoming Matches</h2>
                        <p className="text-sm text-gray-500">Your team's scheduled matches</p>
                    </div>
                    {upcomingMatches.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingMatches.map((m, i) => (
                                <UpcomingMatchCard key={i} match={m} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center p-4">No upcoming matches!!</div>
                    )}
                </section>
            </div>

            <section className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Recent Results</h2>
                <p className="text-sm text-gray-500 mb-4">Your teams' latest match results</p>
                {recentResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {recentResults.map((r, i) => (
                            <RecentResultCard key={i} result={r} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-4">No Matches yet!!</div>
                )}
            </section>

            <TeamDetailsModal open={teamModalOpen} onClose={() => setTeamModalOpen(false)} team={selectedTeam} />
            <RegisterTeamModal open={registerModalOpen} onClose={() => setRegisterModalOpen(false)} onSuccess={fetchDashboard} nit_id={nitId} />
        </div>
    );
}
