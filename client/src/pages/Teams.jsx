import { Search, Check, ChevronDown, Users, Eye, X, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

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
}

function TeamCard({ team, onViewDetails }) {
  const { teamName, nitName, playersCount, sport, coachName } = team;
  return (
    <div className="rounded-xl bg-white p-4 shadow-[0px_4px_10px_rgba(0,0,0,0.05)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{teamName}</h3>
          <p className="text-sm text-gray-500">{nitName}</p>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-gray-700 text-sm">
        <p className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-500" /> {playersCount} players
        </p>
        <p>Sport: <span className="font-medium">{sport}</span></p>
        <p>Coach: <span className="font-medium">{coachName}</span></p>
      </div>

      <button
        onClick={() => onViewDetails(team)}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-colors"
      >
        <Eye className="h-4 w-4" /> View
      </button>
    </div>
  );
}

const Badge = ({ children, className }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

function TeamDetailModal({ team, onClose }) {
  const navigate = useNavigate();
  if (!team) return null;

  const onEdit = () => {
    navigate(`/coach/manage-teams?sport=${encodeURIComponent(team.sport)}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white border border-gray-200 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
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
          {/* NIT name */}
          <div className="mb-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
              <MapPin className="h-4 w-4 text-gray-500" />
              <p className="text-sm font-medium text-gray-600">{team.nitName}</p>
            </div>
          </div>

          {/* Sport badge */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Badge className="bg-gray-100 text-gray-700">{team.sport}</Badge>
          </div>

          {/* Coach only (captain / matches / wins / losses removed) */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-4">
            <div className="text-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <Users className="h-5 w-5 mx-auto mb-2 text-gray-500" />
              <p className="text-xs text-gray-500 mb-1">Coach</p>
              <p className="text-lg font-semibold text-gray-900">{team.coachName}</p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Team Members ({team.playersCount})
            </h3>

            {/* Show Edit only if it’s the logged-in coach’s team */}
            {team.isMyTeam && (
              <button
                onClick={onEdit}
                className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700"
              >
                Edit Team
              </button>
            )}
          </div>

          {/* Simple member list placeholder (still demo names for UI) */}
          <div className="bg-gray-50 rounded-lg border border-gray-200 mt-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
              {team.playersCount > 0 ? (
                Array.from({ length: team.playersCount }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-white rounded-md border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                      {team.teamName?.[0] || "T"}
                    </div>
                    <span className="text-sm font-medium text-gray-800">Player {index + 1}</span>
                  </div>
                ))
              ) : (
                <div className="text-sm text-gray-500">No members listed.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Teams() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(0);
  const [sports] = useState(["All Sports", "Basketball", "Football", "Cricket"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const sport = sports[selectedSport];

  const fetchTeams = async () => {
    try {
      const { data } = await api.get('/v1/teams/public', {
        params: { search: searchTerm || undefined, sport }
      });
      setTeams(data.items || []);
      setLoading(false)
    } catch (e) {
      console.error(e);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSport]);
  
  if(loading){
    return <FullPageLoader />
  }

  const onSearch = (e) => setSearchTerm(e.target.value);
  const submitSearch = (e) => { e.preventDefault(); fetchTeams(); };

  const totalTeams  = teams.length;
  const totalSports = new Set(teams.map(t => t.sport)).size;

  return (
    <div className="flex flex-col gap-8 min-h-screen w-full p-8 pt-5 px-4 md:px-8 bg-gray-50">
      <div>
        <h1 className="text-4xl font-bold">Teams</h1>
        <p className="text-[#000000a1]">Explore all participating teams</p>
      </div>

      <div className="flex justify-between sm:flex-row flex-col gap-8 text-sm">
        {/* Search */}
        <form onSubmit={submitSearch} className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search teams, NITs, or coaches..."
            value={searchTerm}
            onChange={onSearch}
            className="w-full p-2.5 pl-10 rounded-lg border border-[#00000039] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        {/* Sport filter */}
        <div className="w-full sm:w-60 relative [&_button]:p-2 [&_button]:rounded-lg [&>button]:border [&>button]:border-[#00000039] bg-white">
          <button className="cursor-pointer flex items-center justify-between gap-4 w-full p-2.5" onClick={() => setIsOpen(!isOpen)}>
            {sport}
            <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
          <div className={`${isOpen ? 'block' : 'hidden'} z-20 absolute flex flex-col bg-white w-full mt-2 rounded-lg border border-[#00000039] p-1 shadow-lg`}>
            {sports.map((s, index) => (
              <button
                key={s}
                className="flex items-center gap-4 hover:bg-[#cacaca98] text-left"
                onClick={() => { setIsOpen(false); setSelectedSport(index); }}
              >
                <Check className={`h-5 w-4 ${index === selectedSport ? 'opacity-100' : 'opacity-0'}`} />
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            onViewDetails={setSelectedTeam}
          />
        ))}
        {!loading && teams.length === 0 && (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">
            No teams found matching your criteria.
          </p>
        )}
        {loading && (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">
            Loading...
          </p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 py-4">
        <StatCard title="Total Teams"       stat={totalTeams}  subtitle="" />
        <StatCard title="Sports Categories" stat={totalSports} subtitle="Different sports" />
      </div>

      {/* Modal */}
      <TeamDetailModal
        team={selectedTeam}
        onClose={() => setSelectedTeam(null)}
      />
    </div>
  );
}
