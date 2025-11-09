import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Calendar,
  Clock,
  MapPin,
  Trophy,
  Users,
  PlusCircle,
  Edit,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import FullPageLoader from "../components/FullPageLoader";

/* ------------------ UI Components ------------------ */

function StatCard({ title, stat, subtitle, Item }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-6 hover:shadow-xl border border-[#9c9c9c5e]">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{stat}</p>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="rounded-lg bg-gray-100 p-3">
        <Item className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}

function MatchCard({ m, updateResult }) {
  const statusLabel =
    m.status === "Completed"
      ? "Completed"
      : m.status === "Ongoing"
      ? "LIVE"
      : "Upcoming";

  const badgeClasses =
    statusLabel === "LIVE"
      ? "bg-red-100 text-red-800"
      : statusLabel === "Completed"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";

  const team1Score = m.scoreA ?? null;
  const team2Score = m.scoreB ?? null;
  const scoreDisplay =
    team1Score !== null ? `${team1Score} - ${team2Score}` : "vs";

  return (
    <div className="relative rounded-xl border border-[#b8b8b8ab] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="top-4 left-4 font-medium flex justify-between">
        <div
          className={`rounded-full px-2.5 py-0.5 text-xs items-center flex ${badgeClasses}`}
        >
          {statusLabel === "LIVE" && (
            <span className="relative mr-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          {statusLabel}
        </div>
        <div>{updateResult}</div>
      </div>

      <div className="flex flex-col items-center justify-around pt-10 sm:flex-row sm:pt-4">
        <div className="flex w-full items-center justify-around gap-4 text-center sm:w-auto sm:justify-start lg:gap-8">
          <span className="w-1/3 font-semibold text-[#535353ec] sm:w-auto sm:text-right">
            {m.teamA_id?.name}
          </span>
          <span className="text-xl font-bold text-gray-900">{scoreDisplay}</span>
          <span className="w-1/3 font-semibold text-[#535353ec] sm:w-auto sm:text-left">
            {m.teamB_id?.name}
          </span>
        </div>

        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-4 text-sm text-gray-500 font-semibold sm:mt-0 sm:w-auto sm:flex-nowrap sm:justify-end sm:border-t-0 sm:pt-0">
          <span>{m.event_id?.sport}</span>
          <span className="flex items-center">
            <Calendar size={12} className="mr-1" />{" "}
            {new Date(m.matchDateTime).toLocaleDateString()}
          </span>
          <span className="flex items-center">
            <Clock size={12} className="mr-1" />{" "}
            {new Date(m.matchDateTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="flex items-center">
            <MapPin size={12} className="mr-1" /> {m.venue || "TBD"}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [pending, setPending] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const role = localStorage.getItem("user");

  /* ---- Fetch Paginated Data ---- */
  const fetchData = async (pageNum = 1) => {
    try {
      setLoading(true);
      const [matchesRes, teamsRes, eventsRes] = await Promise.all([
        api.get(`/matches?page=${pageNum}&limit=10`),
        api.get("/matches/teams"),
        api.get("/events/allEventsPublic"),
      ]);

      // ✅ Sort by priority: Upcoming → Ongoing → Completed
      const ordered = matchesRes.data.items.sort((a, b) => {
        const order = { Scheduled: 1, Upcoming: 1, Ongoing: 2, Completed: 3 };
        return (order[a.status] || 99) - (order[b.status] || 99);
      });

      setMatches(ordered);
      setFilteredMatches(ordered);
      setTotalPages(matchesRes.data.totalPages);
      setTeams(teamsRes.data);
      setEvents(eventsRes.data);
      setPage(pageNum);
      setLoading(false);

      if (role === "CommonAdmin") {
        const res1 = await api.get("/matches/pending");
        setPending(res1.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  /* ---- Filter (client-side) ---- */
  useEffect(() => {
    let filtered = [...matches];
    if (statusFilter !== "All") filtered = filtered.filter((m) => m.status === statusFilter);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.teamA_id?.name?.toLowerCase().includes(query) ||
          m.teamB_id?.name?.toLowerCase().includes(query) ||
          m.event_id?.sport?.toLowerCase().includes(query) ||
          m.venue?.toLowerCase().includes(query)
      );
    }
    setFilteredMatches(filtered);
  }, [searchQuery, statusFilter, matches]);

  if (loading) return <FullPageLoader />;

  /* ---- Pagination ---- */
  const handlePrev = () => {
    if (page > 1) {
      fetchData(page - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      fetchData(page + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const liveMatches = matches.filter((m) => m.status === "Ongoing");
  const upcoming = matches.filter((m) => m.status === "Scheduled" || m.status === "Upcoming");
  const completed = matches.filter((m) => m.status === "Completed");

  return (
    <div className="mx-auto container p-5 flex flex-col gap-8 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Matches</h1>
          <p className="text-[#000000a1]">View scores and upcoming fixtures</p>
        </div>
        {role === "CommonAdmin" && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <PlusCircle size={18} /> Add Match
          </button>
        )}
      </div>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search by team, venue, or sport..."
            className="w-full pl-10 pr-4 py-2.5 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="relative w-full md:w-1/3">
          <Filter className="absolute left-3 top-3 text-gray-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2.5 border border-black/20 rounded-lg focus:ring-2 focus:ring-blue-600"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Scheduled">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Matches */}
      <h2 className="text-2xl font-bold">All Matches</h2>
      <div className="space-y-4 min-h-80">
        {filteredMatches.map((m) => (
          <MatchCard
            key={m._id}
            m={m}
            updateResult={
              role === "NITAdmin" && m.status !== "Completed" && (
                <button
                  onClick={() => {
                    setSelectedMatch(m);
                    setShowUpdate(true);
                  }}
                  className="bg-yellow-500 text-white px-2.5 py-0.5 rounded-md flex gap-2 items-center cursor-pointer"
                >
                  <Edit size={16} /> Update Result
                </button>
              )
            }
          />
        ))}
        {filteredMatches.length === 0 && (
          <p className="text-center text-gray-500 py-8">No matches found.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium ${
            page === 1
              ? "text-white bg-blue-300 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-400"
          }`}
        >
          <ChevronLeft className="h-4 w-4" /> Prev
        </button>

        <span className="text-gray-600 text-sm">
          Page <b>{page}</b> of <b>{totalPages}</b>
        </span>

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium ${
            page === totalPages
              ? "text-white bg-blue-300 cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-400"
          }`}
        >
          Next <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4">
        <StatCard title="Total Matches" stat={matches.length} subtitle="Total games" Item={Calendar} />
        <StatCard title="Live Matches" stat={liveMatches.length} subtitle="Currently running" Item={Users} />
        <StatCard title="Completed" stat={completed.length} subtitle="Finished games" Item={Clock} />
        <StatCard title="Upcoming" stat={upcoming.length} subtitle="Fixtures scheduled" Item={Trophy} />
      </div>
    </div>
  );
}
