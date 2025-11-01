import { useState } from "react";
import { Link, Outlet, NavLink, useLocation } from "react-router-dom";
import { Bell, Trophy, Settings, LogOut, Calendar, ChartColumn, User, Users, LayoutList, Menu, X } from "lucide-react";

function SidebarNav({ isOpen }) {
    const Items = [
        { title: 'Coach Dashboard', icon: User, link: '/coach/dashboard' },
        { title: 'Manage Teams', icon: Users, link: '/coach/manage-teams' },
        { title: 'Teams', icon: LayoutList, link: '/coach/teams' },
        { title: 'Events', icon: Trophy, link: '/coach/events' },
        { title: 'Matches', icon: Calendar, link: '/coach/matches' },
        { title: 'Leaderboard', icon: ChartColumn, link: '/coach/leaderboard' },
    ];

    const path = useLocation();
    const [isActive, setIsActive] = useState(path.pathname);

    return (
        <nav className="flex flex-col gap-2 md:mt-14">
            {Items.map((item) => (
                <NavLink key={item.title} to={item.link} className={`flex items-center gap-4 p-2 rounded-lg text-gray-700 ${isActive === item.link ? 'bg-orange-500 text-white hover:bg-orange-300' : 'hover:bg-gray-200'} ${!isOpen && 'justify-center'} transition-colors duration-200`} onClick={() => setIsActive(item.link)} >
                    <item.icon className="h-5 w-5 min-w-[24px]" />
                    {isOpen && (
                        <span className="font-xl whitespace-nowrap">
                            {item.title}
                        </span>
                    )}
                </NavLink>
            ))}
        </nav>
    );
}

function Coach() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <header className={`sticky top-0 z-30 bg-white border-b shadow-lg border-[#5184e3ff]`}>
                <div className={`flex items-center justify-between h-14 text-sm px-4`}>
                    <Link to="/">
                        <div className="flex items-center gap-2">
                            <Trophy className="text-blue-800 h-8 w-8" />
                            <p className="text-blue-900 font-bold text-lg">INSMS</p>
                        </div>
                    </Link>

                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <Bell className="h-6 w-6 text-gray-600" />
                            <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>
                        <div className="relative">
                            <button onClick={toggleDropdown} className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" >
                                <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-sm">
                                    TC
                                </div>
                            </button>

                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-base font-medium text-gray-900">Team Coach</p>
                                        <p className="text-sm text-gray-500">ccoach@insms.com</p>
                                        <p className="text-xs text-gray-400">Coach • NIT Trichy</p>
                                    </div>
                                    <button className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 space-x-3">
                                        <Settings className="h-5 w-5" />
                                        <span>Settings</span>
                                    </button>
                                    <button className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 space-x-3">
                                        <LogOut className="h-5 w-5" />
                                        <span>Log out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                        <div>
                            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-1 rounded-md text-gray-700 hover:bg-gray-200 flex items-center justify-center">
                                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex min-h-screen bg-gray-50">
                <aside className={`hidden md:block fixed h-screen left-0 z-20 flex flex-col gap-2 p-2 border-r border-[#9d9d9da4] bg-white shadow-sm ${isOpen ? 'w-52' : 'w-16'} transition-all duration-300 ease-in-out`} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} >
                    <SidebarNav isOpen={isOpen} />
                </aside>
                <main className={`flex-1 md:ml-16 transition-all duration-300 ease-in-out min-w-0`} >
                    <Outlet />
                </main>
                <aside className={`md:hidden fixed h-screen right-0 z-20 flex flex-col gap-2 p-2 border-l pt-8 bg-white shadow-sm ${isOpen ? 'w-52' : 'w-16 hidden'} transition-all duration-300 ease-in-out`} >
                    <SidebarNav isOpen={isOpen} />
                </aside>
            </div>

            <footer className={`relative border-t border-primary/20 text-black mt-auto`}>
                <div className="container mx-auto px-6 py-2">
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

export default Coach;