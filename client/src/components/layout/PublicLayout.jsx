import { BarChart, BarChart2, Bell, ChartColumn, Columns, Dumbbell, Sword, Swords, Trophy, Users, LogIn, Menu } from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"
import { NavBtn } from "../Button"
import { Children, useState } from "react"

export default function PublicLayout() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const togglemenu = () => { setIsMenuOpen(!isMenuOpen) };

    return (
        <div className="min-h-screen bg-[#e7e7e78a]">
            <header className="sticky top-0 z-20 bg-white border-b shadow-lg border-[#5184e3ff]">
                <div className="flex items-center justify-between h-14 text-sm mx-auto container">
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-blue-800 h-8 w-8" />
                            <p className="text-blue-900 font-bold text-lg">INSMS</p>
                        </div>
                    </Link>
                    <nav className="hidden md:flex justify-between gap-2 text-sm font-semibold">
                        <Link to="/public/leaderboard"><NavBtn screen={true} Icon={ChartColumn} name="Leaderboard"  toggle={null} /></Link>
                        <Link to="/public/teams"><NavBtn screen={true} Icon={Users} name="Teams"  toggle={null} /></Link>
                        <Link to="/public/matches"><NavBtn screen={true} Icon={Swords} name="Matches"  toggle={null} /></Link>
                        <Link to="/public/notifications"><NavBtn screen={true} Icon={Bell} name="Notifications"  toggle={null} /></Link>
                    </nav>
                    <div className="hidden md:block">
                        <Link to="/login">
                            <button className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[#3198e7ff] bg-[#3198e7ff] font-semibold text-white p-2 hover:bg-[#1c89c9ff] hover:border-[#1c89c9ff] transition-all duration-200">
                                <LogIn size={20} strokeWidth={2.5} />
                                Login
                            </button>
                        </Link>
                    </div>
                    <button className="md:hidden" onClick={togglemenu}>
                        <Menu className="text-black" />
                    </button>
                </div>
                <div className={`${!isMenuOpen ? 'hidden opacity-0' : 'opacity-100'} flex items-center bg-[#2378daff] justify-center fixed w-full h-full md:hidden transition-opacity duration-300 ease-in-out text-white text-2xl`}>
                    <nav className="flex flex-col gap-4 font-semibold text-black font-semibold p-8 rounded-xl bg-white/30">
                        <Link to="/public/leaderboard"><NavBtn screen={false} Icon={ChartColumn} name="Leaderboard" toggle={togglemenu} /></Link>
                        <Link to="/public/teams"><NavBtn screen={false} Icon={Users} name="Teams"  toggle={togglemenu} /></Link>
                        <Link to="/public/matches"><NavBtn screen={false} Icon={Swords} name="Matches"  toggle={togglemenu} /></Link>
                        <Link to="/public/notifications"><NavBtn screen={false} Icon={Bell} name="Notifications"  toggle={togglemenu} /></Link>
                    </nav>
                </div>
            </header>
            <main className={`${isMenuOpen ? 'hidden' : 'w-full'}`}>
                <Outlet />
            </main>
            <footer className="relative border-t border-primary/20 text-black mt-10">
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