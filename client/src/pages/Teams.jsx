import { Award, Medal, Crown, Star, Check, ChevronDown, Trophy, Users, Eye } from "lucide-react";
import { useState } from "react";

function StatCard({ title, stat, subtitle }){
    return (
        <div className="flex items-center justify-between rounded-xl bg-white p-6 hover:shadow-xl border border-[#9c9c9c5e]">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat}</p>
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
                <Users className="h-6 w-6 text-gray-600" />
            </div>
        </div>
    );
};

function TeamCard({ teamName, nitName, status, playersCount, sport, coachName, onViewDetails }) {
    const statusClasses = status === 'Active' ? 'bg-blue-500' : 'bg-orange-500';

    return (
        <div className="rounded-xl bg-white p-4 shadow-[0px_4px_10px_rgba(0,0,0,0.05)]">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{teamName}</h3>
                    <p className="text-sm text-gray-500">{nitName}</p>
                </div>
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white ${statusClasses}`}>
                    {status}
                </span>
            </div>
            <div className="mt-4 space-y-2 text-gray-700 text-sm">
                <p className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" /> {playersCount} players
                </p>
                <p>Sport: <span className="font-medium">{sport}</span></p>
                <p>Coach: <span className="font-medium">{coachName}</span></p>
            </div>

            <button onClick={onViewDetails} className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors" >
                <Eye className="h-4 w-4" /> View
            </button>
        </div>
    );
};

function Teams() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState(0);
    const [sports, setSports] = useState(["Overall Rankings", "Basketball", "Football"]);
    const toggleMenu = (index) => {
        setIsOpen(false);
        setSelectedSport(index);
    }
    const teamsData = [
        { id: 'nit-trichy-warriors', teamName: "NIT Trichy Warriors", nitName: "NIT Trichy", status: "Active", playersCount: 12, sport: "Basketball", coachName: "John Smith" },
        { id: 'nit-calicut-chargers', teamName: "NIT Calicut Chargers", nitName: "NIT Calicut", status: "Inactive", playersCount: 15, sport: "Cricket", coachName: "Mike Ross" },
        { id: 'nit-warangal-titans', teamName: "NIT Warangal Titans", nitName: "NIT Warangal", status: "Active", playersCount: 10, sport: "Football", coachName: "Jane Doe" },
        { id: 'nit-calicut-chargers', teamName: "NIT Calicut Chargers", nitName: "NIT Calicut", status: "Inactive", playersCount: 15, sport: "Cricket", coachName: "Mike Ross" },
    ];

    return (
        <div className="mx-auto container pt-5 flex flex-col gap-8 min-h-screen px-2">
            <div>
                <h1 className="text-4xl font-bold">Teams</h1>
                <p className="text-[#000000a1]">Explore all participating teams</p>
            </div>
            <div className="flex justify-between sm:flex-row flex-col gap-8 text-sm">
                <div className="w-full sm:w-60 relative [&_button]:p-2 [&_button]:rounded-lg [&>button]:border [&>button]:border-[#00000039] bg-white">
                    <button className="cursor-pointer flex items-center justify-between gap-4 w-full" onClick={() => setIsOpen(!isOpen)}>
                        <Trophy className="h-5 w-5" />
                        {sports[selectedSport]}
                        <ChevronDown />
                    </button>
                    <div className={`${isOpen ? '' : 'hidden'} z-20 absolute flex flex-col bg-white w-full mt-2 rounded-lg border border-[#00000039] transition-y duration-300 ease-in-out p-1`}>
                        {
                            sports.map((sport, index) => {
                                return <button className="flex items-center gap-4 hover:bg-[#cacaca98]" onClick={() => { toggleMenu(index) }}>{<Check className={`h-5 w-4 ${index == selectedSport ? '' : 'opacity-0'}`} />}{sport}</button>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teamsData.map((team) => (
                    <TeamCard
                        key={team.id}
                        teamName={team.teamName}
                        nitName={team.nitName}
                        status={team.status}
                        playersCount={team.playersCount}
                        sport={team.sport}
                        coachName={team.coachName}
                        onViewDetails={() => handleViewDetails(team.id)}
                    />
                ))}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4">
                <StatCard
                    title="Total Teams"
                    stat={10}
                    subtitle="Competing institutions"
                />
                <StatCard
                    title="Active Teams"
                    stat={136}
                    subtitle="Currently Competing"
                />
                <StatCard
                    title="Total Players"
                    stat={145}
                    subtitle="Across all teams"
                />
                <StatCard
                    title="Sports Categories"
                    stat={8}
                    subtitle="Different sports"
                />
            </div>
        </div>
    )
}

export { Teams };