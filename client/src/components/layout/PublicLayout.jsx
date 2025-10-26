import { BarChart, BarChart2, Bell, ChartColumn, Columns, Dumbbell, Sword, Swords, Trophy, Users, LogIn, Menu, X } from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { NavBtn } from "../Button";
import { useState, useEffect } from "react";

export default function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const togglemenu = () => { setIsMenuOpen(!isMenuOpen) };

    return (
        <div className={`flex flex-col min-h-screen bg-[#e7e7e78a]`}>
            <header className={`sticky top-0 z-30 bg-white border-b md:px-10 shadow-lg border-[#5184e3ff]`}>
                <div className={`flex items-center justify-between h-14 text-sm px-4`}>
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-blue-800 h-8 w-8" />
                            <p className="text-blue-900 font-bold text-lg">INSMS</p>
                        </div>
                    </Link>
                    <nav className="hidden md:flex justify-between gap-2 text-sm font-semibold">
                        <Link to="/public/leaderboard"><NavBtn screen={true} Icon={ChartColumn} name="Leaderboard" path="/public/leaderboard" toggle={null} /></Link>
                        <Link to="/public/teams"><NavBtn screen={true} Icon={Users} name="Teams" path="/public/teams" toggle={null} /></Link>
                        <Link to="/public/matches"><NavBtn screen={true} Icon={Swords} name="Matches" path="/public/matches" toggle={null} /></Link>
                        <Link to="/public/events"><NavBtn screen={true} Icon={Trophy} name="Events" path="/public/events" toggle={null} /></Link>
                        <Link to="/public/notifications"><NavBtn screen={true} Icon={Bell} name="Notifications" path="/public/notifications" toggle={null} /></Link>
                    </nav>
                    <div className="hidden md:block">
                        <Link to="/login">
                            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#3198e7ff] bg-[#3198e7ff] font-semibold text-white p-2 hover:bg-[#1c89c9ff] hover:border-[#1c89c9ff] transition-all duration-200">
                                <LogIn size={20} strokeWidth={2.5} />
                                Login
                            </button>
                        </Link>
                    </div>
                    <button className="md:hidden z-50" onClick={togglemenu}>
                        {isMenuOpen ? <X className="text-black" /> : <Menu className="text-black" />}
                    </button>
                </div>
            </header>

            <main className={`flex w-full md:px-10 min-h-screen`}>
                <Outlet />
                <div className={`md:hidden fixed h-screen right-0 z-20 flex flex-col gap-2 p-2 border-l pt-8 bg-white shadow-sm ${isMenuOpen ? 'w-52' : 'w-16 hidden'} transition-all duration-300 ease-in-out`} >
                    <nav className="flex flex-col gap-4 font-semibold text-black rounded-xl bg-white/30 h-fit mt-8 pt-10">
                        <Link to="/public/leaderboard"><NavBtn screen={false} Icon={ChartColumn} name="Leaderboard" toggle={togglemenu} path="/public/leaderboard" /></Link>
                        <Link to="/public/teams"><NavBtn screen={false} Icon={Users} name="Teams" toggle={togglemenu} path="/public/teams" /></Link>
                        <Link to="/public/matches"><NavBtn screen={false} Icon={Swords} name="Matches" toggle={togglemenu} path="/public/matches" /></Link>
                        <Link to="/public/events"><NavBtn screen={false} Icon={Trophy} name="Events" toggle={togglemenu} path="/public/events" /></Link>
                        <Link to="/public/notifications"><NavBtn screen={false} Icon={Bell} name="Notifications" toggle={togglemenu} path="/public/notifications" /></Link>
                        <Link to="/login" className="mt-15">
                            <button className="w-full flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#3198e7ff] bg-[#3198e7ff] font-semibold text-white p-2 hover:bg-[#1c89c9ff] hover:border-[#1c89c9ff] transition-all duration-200">
                                <LogIn size={20} strokeWidth={2.5} />
                                Login
                            </button>
                        </Link>
                    </nav>
                </div>
            </main>

            <footer className={`relative border-t border-primary/20 text-black mt-auto ${isMenuOpen ? 'hidden' : ''}`}>
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
    )
}