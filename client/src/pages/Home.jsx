import "../index.css";
import { Link } from "react-router-dom";
import { LinkBtn } from "../components/Button";
import { LiveCard, StatCard, UpcomingCard, PerformerCard } from "../components/Card";
import { Trophy, LogIn, ChartColumn, Medal, University, Dumbbell, ClipboardList, } from "lucide-react";

export default function Home() {
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
                        Excellence in Competition &bull; Unity Through Sport &bull; Champions
                        in Making
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
                    <div className="m-10 grid grid-cols-2 gap-4 md:grid-cols-4">
                        <StatCard Icon={University} Stat={23} Name="NITs Competing" />
                        <StatCard Icon={Dumbbell} Stat={8} Name="Sports Events" />
                        <StatCard Icon={ClipboardList} Stat={156} Name="Total Matches" />
                        <StatCard Icon={Medal} Stat={89} Name="Medals Awarded" />
                    </div>
                </div>
            </section>

            {/* Main Section */}
            <main className="mt-4 p-4 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* First-Col */}
                    <div className="lg:col-span-2">
                        {/* Live Match */}
                        <div className="rounded-2xl border border-white/30 bg-white/30 px-4 py-6 text-center text-white shadow-lg backdrop-blur-lg sm:px-6 md:px-10">
                            <div className="flex items-center justify-between">
                                <h2 className="flex items-center gap-3 text-xl font-bold md:text-3xl">
                                    <div className="h-3 w-3 animate-pulse rounded-full bg-red-400"></div>
                                    Live Matches
                                </h2>
                                <Link to="/matches">
                                    <LinkBtn>View All</LinkBtn>
                                </Link>
                            </div>
                            <LiveCard game_name="Basketball" T1="NIT Calicut" T2="NIT Calicut" S1={40} S2={50} X="Q3" />
                            <LiveCard game_name="Basketball" T1="NIT Calicut" T2="NIT Calicut" S1={40} S2={50} X="Q3" />
                        </div>

                        {/* Top-Performer */}
                        <div className="mt-10 rounded-2xl border border-white/30 bg-white/35 px-4 py-6 text-center text-white shadow-lg backdrop-blur-lg sm:px-6 md:px-10">
                            <div className="mt-4 flex items-center justify-between">
                                <h2 className="text-left flex items-center gap-3 text-xl font-bold md:text-3xl">
                                    <Trophy className="text-amber-500" size={30} />
                                    Top Performers
                                </h2>
                                <Link to="/matches">
                                    <LinkBtn>Full Rankings</LinkBtn>
                                </Link>
                            </div>
                            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
                                <PerformerCard rank={1} points={120} medals={16} name="NIT Calicut" />
                                <PerformerCard rank={2} points={120} medals={16} name="NIT Calicut" />
                                <PerformerCard rank={3} points={120} medals={16} name="NIT Calicut" />
                            </div>
                        </div>
                    </div>

                    {/* Second-Col */}
                    <div className="flex flex-col">
                        {/* Upcoming Events */}
                        <div className="mb-8 rounded-2xl border border-white/30 bg-white/35 px-4 py-6 text-center text-white shadow-lg backdrop-blur-lg sm:px-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold md:text-3xl">
                                    Upcoming Events
                                </h2>
                                <Link to="/matches">
                                    <LinkBtn>View All</LinkBtn>
                                </Link>
                            </div>
                            <div className="mt-2 flex flex-col">
                                <UpcomingCard game="Cricket" date="20-02-17" teams="17 teams" />
                                <UpcomingCard game="Cricket" date="20-02-17" teams="17 teams" />
                                <UpcomingCard game="Cricket" date="20-02-17" teams="17 teams" />
                            </div>
                        </div>

                        {/* Announcements */}
                        <div className="mb-10 space-y-6 rounded-2xl border border-white/30 bg-white/35 px-4 py-6 text-left text-white shadow-lg backdrop-blur-lg sm:px-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold md:text-2xl">
                                    Latest Announcements
                                </h2>
                                <Link to="/matches">
                                    <LinkBtn>View All</LinkBtn>
                                </Link>
                            </div>
                            <div className="flex flex-col space-y-4">
                                <div className="space-y-1 rounded-xl bg-white/70 p-4 text-black">
                                    <p className="font-semibold">
                                        Basketball Semi-finals Today
                                    </p>
                                    <p className="text-sm">
                                        Catch the exciting semi-final matches at the Main Sports
                                        Complex.
                                    </p>
                                    <p className="text-sm">2 hours ago</p>
                                </div>
                                <div className="space-y-1 rounded-xl bg-white/70 p-4 text-black">
                                    <p className="font-semibold">
                                        Basketball Semi-finals Today
                                    </p>
                                    <p className="text-sm">
                                        Catch the exciting semi-final matches at the Main Sports
                                        Complex.
                                    </p>
                                    <p className="text-sm">2 hours ago</p>
                                </div>
                                <div className="space-y-1 rounded-xl bg-white/70 p-4 text-black">
                                    <p className="font-semibold">
                                        Basketball Semi-finals Today
                                    </p>
                                    <p className="text-sm">
                                        Catch the exciting semi-final matches at the Main Sports
                                        Complex.
                                    </p>
                                    <p className="text-sm">2 hours ago</p>
                                </div>
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