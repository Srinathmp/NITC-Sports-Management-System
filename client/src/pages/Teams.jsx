import { Search, Filter, Check, ChevronDown, Users, Eye, X, MapPin, Crown, Calendar, CheckCircle, XCircle } from "lucide-react";
import React, { useState } from "react";

function StatCard({ title, stat, subtitle }) {
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
    const statusColors = {
        Active: 'bg-blue-500',
        Preparing: 'bg-orange-500',
        Inactive: 'bg-gray-500' 
    };
    const statusClasses = statusColors[status] || 'bg-gray-500';

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

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

function TeamDetailModal({ team, onClose }) {
  if (!team) return null;
  const teamStats = {
    matches: 12,
    wins: 9,
    losses: 3,
    captain: 'Rajesh Kumar', 
    members: ["Rajesh Kumar", "Amit Singh", "Priya Sharma", "Vivek Patel", "Sneha Reddy"]
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white border border-gray-200 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{team.teamName}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-900 transition-colors p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <MapPin className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">{team.nitName}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge className="bg-gray-100 text-gray-700">{team.sport}</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Crown className="h-5 w-5 mx-auto mb-2 text-yellow-500" />
              <p className="text-xs text-gray-500 mb-1">Team Captain</p>
              <p className="text-lg font-semibold text-gray-900">{teamStats.captain}</p>
            </div>
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Users className="h-5 w-5 mx-auto mb-2 text-gray-500" />
              <p className="text-xs text-gray-500 mb-1">Coach</p>
              <p className="text-lg font-semibold text-gray-900">{team.coachName}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg shadow-sm border border-gray-200">
              <Calendar className="h-5 w-5 mx-auto mb-2 text-gray-500" />
              <p className="text-2xl font-bold text-gray-900">{teamStats.matches}</p>
              <p className="text-xs text-gray-500">Matches</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg shadow-sm border border-green-200">
              <CheckCircle className="h-5 w-5 mx-auto mb-2 text-green-600" />
              <p className="text-2xl font-bold text-green-600">{teamStats.wins}</p>
              <p className="text-xs text-gray-500">Wins</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg shadow-sm border border-red-200">
              <XCircle className="h-5 w-5 mx-auto mb-2 text-red-600" />
              <p className="text-2xl font-bold text-red-600">{teamStats.losses}</p>
              <p className="text-xs text-gray-500">Losses</p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Users className="h-5 w-5 text-gray-700" />
              Team Members ({team.playersCount})
            </h3>
            <div className="bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
                {teamStats.members.slice(0, team.playersCount).map((member, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {member.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-gray-800">{member}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Teams() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState(0);
    const [sports, setSports] = useState(["All Sports", "Basketball", "Football", "Cricket"]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTeam, setSelectedTeam] = useState(null);

    const toggleMenu = (index) => {
        setIsOpen(false);
        setSelectedSport(index);
    }

    const handleViewDetails = (team) => {
        setSelectedTeam(team);
    };

    const teamsData = [
        { id: 'nit-trichy-warriors', teamName: "NIT Trichy Warriors", nitName: "NIT Trichy", status: "Active", playersCount: 12, sport: "Basketball", coachName: "John Smith" },
        { id: 'nit-warangal-eagles', teamName: "NIT Warangal Eagles", nitName: "NIT Warangal", status: "Active", playersCount: 12, sport: "Basketball", coachName: "Mike Johnson" },
        { id: 'nit-surathkal-sharks', teamName: "NIT Surathkal Sharks", nitName: "NIT Surathkal", status: "Active", playersCount: 18, sport: "Football", coachName: "David Brown" },
        { id: 'nit-rourkela-lions', teamName: "NIT Rourkela Lions", nitName: "NIT Rourkela", status: "Preparing", playersCount: 15, sport: "Cricket", coachName: "Steve Wilson" },
        { id: 'nit-calicut-tigers', teamName: "NIT Calicut Tigers", nitName: "NIT Calicut", status: "Active", playersCount: 18, sport: "Football", coachName: "Tom Davis" },
        { id: 'nit-durgapur-knights', teamName: "NIT Durgapur Knights", nitName: "NIT Durgapur", status: "Active", playersCount: 15, sport: "Cricket", coachName: "Alex Miller" },
    ];

    const filteredTeams = teamsData.filter(team => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          team.teamName.toLowerCase().includes(searchLower) ||
          team.nitName.toLowerCase().includes(searchLower) ||
          team.coachName.toLowerCase().includes(searchLower);
        const matchesSport = 
          selectedSport === 0 || 
          team.sport === sports[selectedSport];

        return matchesSearch && matchesSport;
    });

    const totalTeams = teamsData.length;
    const preparingTeams = teamsData.filter(t => t.status === 'Preparing').length;
    const activeTeams = teamsData.filter(t => t.status === 'Active').length;
    const totalPlayers = teamsData.reduce((acc, team) => acc + team.playersCount, 0);
    const totalSports = new Set(teamsData.map(t => t.sport)).size;

    return (
        <div className="flex flex-col gap-8 min-h-screen w-full p-8 pt-5 px-4 md:px-8 bg-gray-50">
            <div>
                <h1 className="text-4xl font-bold">Teams</h1>
                <p className="text-[#000000a1]">Explore all participating teams</p>
            </div>
            
            <div className="flex justify-between sm:flex-row flex-col gap-8 text-sm">
                <div className="relative w-full sm:w-80">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search teams, NITs, or coaches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-2.5 pl-10 rounded-lg border border-[#00000039] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="w-full sm:w-60 relative [&_button]:p-2 [&_button]:rounded-lg [&>button]:border [&>button]:border-[#00000039] bg-white">
                    <button className="cursor-pointer flex items-center justify-between gap-4 w-full p-2.5" onClick={() => setIsOpen(!isOpen)}>
                        {sports[selectedSport]}
                        <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    <div className={`${isOpen ? 'block' : 'hidden'} z-20 absolute flex flex-col bg-white w-full mt-2 rounded-lg border border-[#00000039] transition-y duration-300 ease-in-out p-1 shadow-lg`}>
                        {
                            sports.map((sport, index) => {
                                return <button key={index} className="flex items-center gap-4 hover:bg-[#cacaca98] text-left" onClick={() => { toggleMenu(index) }}>{<Check className={`h-5 w-4 ${index === selectedSport ? 'opacity-100' : 'opacity-0'}`} />}{sport}</button>
                            })
                        }
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTeams.map((team) => (
                    <TeamCard
                        key={team.id}
                        teamName={team.teamName}
                        nitName={team.nitName}
                        status={team.status}
                        playersCount={team.playersCount}
                        sport={team.sport}
                        coachName={team.coachName}
                        onViewDetails={() => handleViewDetails(team)} // Pass the full team object
                    />
                ))}
                {filteredTeams.length === 0 && (
                    <p className="sm:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">
                        No teams found matching your criteria.
                    </p>
                )}
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4">
                <StatCard
                    title="Total Teams"
                    stat={totalTeams}
                    subtitle={`+${preparingTeams} preparing`}
                />
                <StatCard
                    title="Active Teams"
                    stat={activeTeams}
                    subtitle="Currently competing"
                />
                <StatCard
                    title="Total Players"
                    stat={totalPlayers}
                    subtitle="Across all teams"
                />
                <StatCard
                    title="Sports Categories"
                    stat={totalSports}
                    subtitle="Different sports"
                />
            </div>

            <TeamDetailModal 
                team={selectedTeam} 
                onClose={() => setSelectedTeam(null)} 
            />
        </div>
    )
}

export default Teams;