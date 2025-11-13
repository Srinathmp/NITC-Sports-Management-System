import { Search, Check, ChevronDown, Users, Eye } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import FullPageLoader from "../components/FullPageLoader";

/* ------------------ Stat Card ------------------ */
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

/* ------------------ Team Card ------------------ */
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
        <p>
          Sport: <span className="font-medium">{sport}</span>
        </p>
        <p>
          Coach: <span className="font-medium">{coachName}</span>
        </p>
      </div>

      <button
        onClick={() => onViewDetails(team)}
        className="mt-6 w-full flex items-center justify-center gap-2 rounded-md bg-gray-100 px-4 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-200 transition"
      >
        <Eye className="h-4 w-4" /> View
      </button>
    </div>
  );
}

/* ------------------ Team Detail Modal ------------------ */
function TeamDetailModal({ team, onClose }) {
  const navigate = useNavigate();
  if (!team) return null;

  const onEdit = () => {
    navigate(`/coach/manage-teams?sport=${encodeURIComponent(team.sport)}`);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl w-96 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-700">
          ✖
        </button>

        <h2 className="text-xl font-bold mb-3 text-gray-800">{team?.sport} Team</h2>
        <p className="text-sm text-gray-600 mb-4">{team?.playersCount} players</p>

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
              {team?.players?.length > 0 ? (
                team.players.map((p, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-2">{i + 1}</td>
                    <td className="py-2 px-2">{p.jerseyNo || "-"}</td>
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

        <div className="mt-2 items-center flex justify-center">
          {team.isMyTeam && (
            <button
              onClick={onEdit}
              className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm font-medium hover:bg-blue-700"
            >
              Edit Team
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */
export default function Teams() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState(0);
  const [sports] = useState(["All Sports", "Basketball", "Football", "Cricket"]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [teams, setTeams] = useState([]); // full list
  const [filteredTeams, setFilteredTeams] = useState([]); // filtered
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const perPage = 9;

  /* Fetch all teams once */
  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/v1/teams/public");
      setTeams(data.items || []);
      setFilteredTeams(data.items || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  /* Fetch once on mount */
  useEffect(() => {
    fetchTeams();
  }, []);

  /* Apply local filters */
  useEffect(() => {
    let filtered = [...teams];

    const sport = sports[selectedSport];
    if (sport !== "All Sports") {
      filtered = filtered.filter((t) => t.sport === sport);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.teamName.toLowerCase().includes(q) ||
          t.nitName.toLowerCase().includes(q) ||
          t.coachName.toLowerCase().includes(q)
      );
    }

    setFilteredTeams(filtered);
    setPage(1); // reset to page 1 when filters change
  }, [searchTerm, selectedSport, teams]);

  if (loading) return <FullPageLoader />;

  /* Pagination logic */
  const totalTeams = filteredTeams.length;
  const totalSports = new Set(teams.map((t) => t.sport)).size;
  const totalPageCount = Math.ceil(totalTeams / perPage);
  const paginatedTeams = filteredTeams.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex flex-col gap-8 min-h-screen w-full p-8 pt-5 px-4 md:px-8 bg-gray-50">
      <div>
        <h1 className="text-4xl font-bold">Teams</h1>
        <p className="text-[#000000a1]">Explore all participating teams</p>
      </div>

      {/* Search + Filter */}
      <div className="flex justify-between sm:flex-row flex-col gap-8 text-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search teams, NITs, or coaches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 pl-10 rounded-lg border border-[#00000039] bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="w-full sm:w-60 relative [&_button]:p-2 [&_button]:rounded-lg [&>button]:border [&>button]:border-[#00000039] bg-white">
          <button
            className="cursor-pointer flex items-center justify-between gap-4 w-full p-2.5"
            onClick={() => setIsOpen(!isOpen)}
          >
            {sports[selectedSport]}
            <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } z-20 absolute flex flex-col bg-white w-full mt-2 rounded-lg border border-[#00000039] p-1 shadow-lg`}
          >
            {sports.map((s, index) => (
              <button
                key={s}
                className="flex items-center gap-4 hover:bg-[#cacaca98] text-left"
                onClick={() => {
                  setIsOpen(false);
                  setSelectedSport(index);
                }}
              >
                <Check className={`h-5 w-4 ${index === selectedSport ? "opacity-100" : "opacity-0"}`} />
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedTeams.length > 0 ? (
          paginatedTeams.map((team) => <TeamCard key={team.id} team={team} onViewDetails={setSelectedTeam} />)
        ) : (
          <p className="sm:col-span-2 lg:col-span-3 text-center text-gray-500 py-10">No teams found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={() => {
            setPage((p) => Math.max(1, p - 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={page === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium ${
            page === 1
              ? "text-white bg-blue-300 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-400"
          }`}
        >
          Prev
        </button>
        <span className="text-gray-700 font-medium">
          Page {page} of {totalPageCount}
        </span>
        <button
          onClick={() => {
            setPage((p) => Math.min(totalPageCount, p + 1));
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          disabled={page === totalPageCount}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium ${
            page === totalPageCount
              ? "text-white bg-blue-300 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-400"
          }`}
        >
          Next
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 py-4">
        <StatCard title="Total Teams" stat={totalTeams} subtitle="Across all sports" />
        <StatCard title="Sports Categories" stat={totalSports} subtitle="Different sports" />
      </div>

      {/* Modal */}
      <TeamDetailModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />
    </div>
  );
}
