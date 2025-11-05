import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, Trophy, Edit, Eye, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContexts';
import api from '../../api/axios';
import FullPageLoader from '../../components/FullPageLoader';

function TeamDetailsModal({ open, onClose, team }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl w-96 relative">
                
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">✖</button>

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


function StatCard({ title, value, subtitle, icon: Icon }) { /* unchanged */ return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
            <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
        </div>
        <div className="rounded-full bg-gray-100 p-3"><Icon className="h-6 w-6 text-gray-600" /></div>
    </div>
);}

function MyTeamCard({ sport, players, status, nextDate, isGrayBackground, onView }) {
    const statusColors = { active: 'bg-blue-500 text-white', preparing: 'bg-orange-500 text-white' };
    return (
        <div className={`relative rounded-lg p-4 shadow-sm border border-gray-200 overflow-hidden ${isGrayBackground ? 'bg-gray-50' : 'bg-white'} transition-shadow duration-200 hover:shadow-lg`}>
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{sport}</h3>
                    <p className="text-sm text-gray-500 mt-1">{players} players</p>
                </div>
                <div className="flex gap-2">
                    <button className="cursor-pointer text-gray-500 hover:text-gray-700 p-2 rounded-lg border border-gray-300 hover:bg-gray-100"><Edit className="h-5 w-5" /></button>
                    <button onClick={onView} className="cursor-pointer text-gray-500 hover:text-gray-700 p-2 rounded-lg border border-gray-300 hover:bg-gray-100"><Eye className="h-5 w-5" /></button>
                </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
                {/* <span className={`inline-flex items-center rounded-full px-2 h-5 text-xs font-medium ${statusColors[status] || 'bg-gray-200 text-gray-800'}`}>{status}</span> */}
                <p className="text-xs text-gray-500">Next: {nextDate}</p>
            </div>
        </div>
    );
}

function UpcomingMatchCard({ sport, opponent, timeLocation, date }) { /* unchanged */ return (
    <div className="rounded-lg bg-white p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4 transition-shadow duration-200 hover:shadow-lg">
        <div>
            <p className="font-semibold text-gray-800">{sport}</p>
            <p className="text-sm text-gray-600 mt-1">{opponent}</p>
            <p className="text-sm text-gray-500 mt-1">{timeLocation}</p>
        </div>
        <span className="bg-orange-400 text-white text-xs font-bold px-2.5 py-1 rounded-full">{date}</span>
    </div>
);}

function RecentResultCard({ sport, opponent, score, date, result }) { /* unchanged */ const colors={
    Won:'bg-green-100 text-green-700 border-green-400 hover:border-green-700 hover:shadow-xl',
    Lost:'bg-red-100 text-red-700 border-red-400 hover:border-red-700 hover:shadow-xl'
}; const Icon=result==='Won'?CheckCircle:XCircle; return(
    <div className={`rounded-lg bg-white p-4 shadow-sm border ${colors[result]} transition-shadow duration-200`}>
        <div className="flex justify-between items-center">
            <p className="text-sm font-medium">{sport}</p>
            <span className={`flex items-center gap-1 text-xs font-semibold ${result==='Won'?'text-green-700':'text-red-700'}`}>
                <Icon className="h-4 w-4"/> {result}
            </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">vs {opponent}</p>
        <p className="text-xl font-bold text-gray-900 my-2">{score}</p>
        <p className="text-xs text-gray-500">{date}</p>
    </div>
);}

export default function CoachDashboard() {
    const { name } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({});
    const [myTeamsData, setMyTeamsData] = useState([]);
    const [upcomingMatchesData, setUpcomingMatchesData] = useState([]);
    const [recentResultsData, setRecentResultsData] = useState([]);
    const [teamModalOpen, setTeamModalOpen] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const fetchDashboard = async () => {
        try {
            const res = await api.get('/dashboard/coach');
            setStats(res.data.stats);
            setMyTeamsData(res.data.myTeams);
            setUpcomingMatchesData(res.data.upcomingMatches);
            setRecentResultsData(res.data.recentResults);
        } catch (err) { console.error(err); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchDashboard(); }, []);

    if (isLoading) return <FullPageLoader />;

    const statCardsData = [
        { title:'My Teams', value:stats.myTeams||'0', subtitle:'2 active', icon:Users },
        { title:'Total Players', value:stats.totalPlayers||'0', subtitle:'Across all teams', icon:Users },
        { title:'Upcoming Matches', value:stats.upcomingMatches||'0', subtitle:'This week', icon:CalendarDays },
        { title:'Win Rate', value:stats.winRate||'0%', subtitle:'This tournament', icon:Trophy },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 px-4 md:px-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {name}</h1>
                <p className="text-md text-gray-500">NIT Trichy</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCardsData.map(s => <StatCard key={s.title} {...s}/>)}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <div><h2 className="text-xl font-semibold text-gray-800">My Teams</h2>
                        <p className="text-sm text-gray-500">Teams under your coaching</p></div>
                        <button className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-1">+ Register Team</button>
                    </div>
                    <div className="space-y-4">
                        {myTeamsData.map((team,i)=>(
                            <MyTeamCard key={i} {...team}
                                isGrayBackground={i%2!==0}
                                onView={()=>{ setSelectedTeam(team); setTeamModalOpen(true); }}
                            />
                        ))}
                    </div>
                </section>

                <section className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <div className="mb-4"><h2 className="text-xl font-semibold text-gray-800">Upcoming Matches</h2>
                    <p className="text-sm text-gray-500">Your team's scheduled matches</p></div>
                    <div className="space-y-4">
                        {upcomingMatchesData.map((m,i)=><UpcomingMatchCard key={i} {...m}/>)}
                    </div>
                </section>
            </div>

            <section className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Results</h2>
                <p className="text-sm text-gray-500 mb-4">Your teams' latest match results</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentResultsData.map((r,i)=><RecentResultCard key={i} {...r}/>)}
                </div>
            </section>

            <TeamDetailsModal open={teamModalOpen} onClose={()=>setTeamModalOpen(false)} team={selectedTeam}/>
        </div>
    );
}
