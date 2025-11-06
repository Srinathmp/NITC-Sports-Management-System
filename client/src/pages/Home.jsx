import "../index.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";

import {
    Trophy,
    LogIn,
    ChartColumn,
    Medal,
    University,
    Dumbbell,
    ClipboardList
} from "lucide-react";

import { LinkBtn } from "../components/Button";
import { LiveCard, StatCard, UpcomingCard, PerformerCard } from "../components/Card";

export default function Home() {
    const [stats, setStats] = useState({});
    const [top, setTop] = useState([]);
    const [live, setLive] = useState([]);
    const [events, setEvents] = useState([]);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const { data } = await api.get("/dashboard/public");
                setStats(data.stats);
                setTop(data.topPerformers);
                setLive(data.liveMatches);
                setEvents(data.upcomingEvents);
                setNotes(data.announcements);
            } catch (err) {
                console.error("Public home load failed", err);
            }
        }
        load();
    }, []);

    return (
        <div className="backdrop-blur-sm bg-gradient-to-b from-blue-700/70 via-slate-600/80 to-blue-900/90">

            {/* Header */}
            <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-white/20 text-white shadow-lg backdrop-blur-lg">
                <div className="relative z-10 mx-auto flex flex-col items-center justify-center px-4 py-24 text-center sm:px-8">
                    <Trophy className="mb-6 text-white/90" size={96} />

                    <h1 className="text-4xl font-bold uppercase tracking-widest text-white sm:text-6xl lg:text-7xl">
                        Inter-NIT Sports
                    </h1>

                    <h2 className="mb-6 mt-2 text-3xl font-bold text-white/80 sm:text-4xl lg:text-5xl">
                        Championship
                    </h2>

                    <p className="mb-10 text-sm font-medium tracking-wider text-white/70 sm:text-base">
                        Excellence in Competition • Unity Through Sport • Champions in Making
                    </p>

                    <div className="m-8 flex flex-col gap-4 sm:flex-row sm:gap-6">
                        <Link to="/login">
                            <button className="w-full flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#f98c07ff] bg-orange-500 px-6 py-3 font-semibold text-white duration-300 hover:scale-105">
                                <LogIn size={20} strokeWidth={2.5} />
                                Sign In
                            </button>
                        </Link>
                        <Link to="/public/leaderboard">
                            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/20 px-6 py-3 font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:bg-white hover:text-blue-600">
                                <ChartColumn size={20} strokeWidth={2.5} />
                                View Rankings
                            </button>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="m-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard Icon={University} Stat={stats.totalNITs} Name="NITs Competing" />
                        <StatCard Icon={Dumbbell} Stat={stats.totalEvents} Name="Sports Events" />
                        <StatCard Icon={ClipboardList} Stat={stats.totalMatches} Name="Total Matches" />
                        <StatCard Icon={Medal} Stat={stats.totalMedals} Name="Medals Awarded" />
                    </div>
                </div>
            </section>

            {/* Main Section */}
            <main className="mt-4 p-4 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* First Column */}
                    <div className="lg:col-span-2">

                        {/* Live Matches */}
                        <div className="rounded-2xl border border-white/30 bg-white/30 px-4 py-6 text-center text-white shadow-lg backdrop-blur-lg sm:px-6 md:px-10">
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-3 text-xl font-bold md:text-3xl">
                                    <ClipboardList />
                                    Matches
                                </h2>
                                <Link to="/public/matches"><LinkBtn>View All</LinkBtn></Link>
                            </div>

                            {live?.length > 0 ? (
                                live.map((m, i) => {
                                    console.log(m);
                                    return <LiveCard
                                        key={i}
                                        game_name={m.sport}
                                        T1={m.teamA_id?.name}
                                        T2={m.teamB_id?.name}
                                        S1={m.scoreA}
                                        S2={m.scoreB}
                                        X={m.status}
                                    />
                                })
                            ) : (
                                <div className="flex items-center justify-center min-h-40"> 
                                    <p className="mt-4 text-lg text-white/80">No Live Matches</p>
                                </div>
                            )}
                        </div>

                        {/* Top Performers */}
                        <div className="mt-10 rounded-2xl border border-white/30 bg-white/35 px-4 py-6 text-center text-white shadow-lg backdrop-blur-lg sm:px-6 md:px-10">
                            <div className="mt-4 flex items-center justify-between">
                                <h2 className="text-left flex items-center gap-3 text-xl font-bold md:text-3xl">
                                    <Trophy className="text-amber-500" size={30} />
                                    Top Performers
                                </h2>
                                <Link to="/public/leaderboard"><LinkBtn>Full Rankings</LinkBtn></Link>
                            </div>

                            <div className={`mt-4 grid ${top?.length>0?'grid-cols-1 gap-6 sm:grid-cols-3':''}`}>
                                {top?.length > 0 ? (
                                    top.map((t, i) => (
                                        <PerformerCard
                                            key={i}
                                            rank={i + 1}
                                            points={t.points}
                                            name={t.name}
                                        />
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center min-h-40">
                                        <p className="text-white text-lg mt-4">No Data</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col">

                        {/* Upcoming Events */}
                        <div className="mb-8 rounded-2xl border border-white/30 bg-white/35 px-4 py-6 text-center text-white shadow-lg backdrop-blur-lg sm:px-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold md:text-3xl">Upcoming Events</h2>
                                <Link to="/public/events"><LinkBtn>View All</LinkBtn></Link>
                            </div>

                            <div className="mt-2 flex flex-col">
                                {events?.length > 0 ? (
                                    events.map((e, i) => (
                                        <UpcomingCard
                                            key={i}
                                            game={e.sport}
                                            date={new Date(e.date).toLocaleDateString()}
                                            teams={`${e.teams?.length || 0} teams`}
                                        />
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center min-h-40">
                                        <p className="text-white text-lg">No upcoming events</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Announcements */}
                        <div className="mb-10 space-y-6 rounded-2xl border border-white/30 bg-white/35 px-4 py-6 text-left text-white shadow-lg backdrop-blur-lg sm:px-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold md:text-2xl">Latest Announcements</h2>
                                <Link to="/public/notifications"><LinkBtn>View All</LinkBtn></Link>
                            </div>

                            <div className="flex flex-col space-y-4">
                                {notes?.length > 0 ? (
                                    notes.map((n, i) => (
                                        <div key={i} className="space-y-1 rounded-xl bg-white/70 p-4 text-black">
                                            <p className="font-semibold">{n.title}</p>
                                            <p className="text-sm">{n.message}</p>
                                            <p className="text-sm">{new Date(n.createdAt).toLocaleString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex items-center justify-center min-h-40">
                                    <p className="text-white text-lg">No announcements yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative border-t border-primary/20 text-white">
                <div className="container mx-auto px-6 py-8">
                    <div className="mb-4 flex items-center justify-center gap-2">
                        <Trophy className="h-6 w-6 text-primary" />
                        <span className="text-lg font-bold text-gradient">INSMS</span>
                    </div>
                    <div className="text-center text-sm text-muted-foreground">
                        <p>&copy; Inter-NIT Sports Management System</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
