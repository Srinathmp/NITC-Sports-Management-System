import React, { useState, useEffect } from "react";
import api from "../api/axios";
import {
  Calendar, Clock, MapPin, Trophy, Users, PlusCircle, Edit
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

function MatchCard({ m }) {
  const statusLabel =
    m.status === "Completed" ? "Completed" :
    m.status === "Ongoing" ? "LIVE" : "Upcoming";

  const badgeClasses =
    statusLabel === "LIVE" ? "bg-red-100 text-red-800" :
    statusLabel === "Completed" ? "bg-blue-100 text-blue-800" :
    "bg-orange-100 text-orange-800";

  const team1Score = m.scoreA ?? null;
  const team2Score = m.scoreB ?? null;
  const scoreDisplay = team1Score !== null ? `${team1Score} - ${team2Score}` : "vs";

  return (
    <div className="relative rounded-xl border border-[#b8b8b8ab] bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="top-4 left-4 font-medium flex justify-between">
        <div className={`rounded-full px-2.5 py-0.5 text-xs items-center flex ${badgeClasses}`}>
          {statusLabel === "LIVE" && (
            <span className="relative mr-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          {statusLabel}
        </div>
      </div>

      <div className="flex flex-col items-center justify-around pt-10 sm:flex-row sm:pt-4">
        <div className="flex w-full items-center justify-around gap-4 text-center sm:w-auto sm:justify-start lg:gap-8">
          <span className="w-1/3 font-semibold text-[#535353ec] sm:w-auto sm:text-right">{m.teamA_id?.name}</span>
          <span className="text-xl font-bold text-gray-900">{scoreDisplay}</span>
          <span className="w-1/3 font-semibold text-[#535353ec] sm:w-auto sm:text-left">{m.teamB_id?.name}</span>
        </div>

        <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-4 text-sm text-gray-500 font-semibold sm:mt-0 sm:w-auto sm:flex-nowrap sm:justify-end sm:border-t-0 sm:pt-0">
          <span>{m.event_id?.sport}</span>
          <span className="flex items-center"><Calendar size={12} className="mr-1" /> {new Date(m.matchDateTime).toLocaleDateString()}</span>
          <span className="flex items-center"><Clock size={12} className="mr-1" /> {new Date(m.matchDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span className="flex items-center"><MapPin size={12} className="mr-1" /> {m.venue || "TBD"}</span>
        </div>
      </div>
    </div>
  );
}

/* ------------------ Main Component ------------------ */

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [pending, setPending] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [form, setForm] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const role = localStorage.getItem("user");

  /* ---- Fetch Data ---- */
  const fetchData = async () => {
    try {
      const [matchesRes, teamsRes, eventsRes] = await Promise.all([
        api.get("/matches"),
        api.get("/matches/teams"),
        api.get("/events/allEventsPublic")
      ]);
      setMatches(matchesRes.data);
      setTeams(teamsRes.data);
      setEvents(eventsRes.data);
      setLoading(false);
      if (role === "CommonAdmin") {
        const res1 = await api.get("/matches/pending");
        setPending(res1.data);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <FullPageLoader />;

  /* ---- Handlers ---- */
  const handleAddMatch = async () => {
    await api.post("/matches/create", form);
    setShowAdd(false);
    fetchData();
  };

  const handleUpdateResult = async () => {
    await api.patch(`/matches/${selectedMatch._id}/result`, form);
    setShowUpdate(false);
    fetchData();
  };

  const handlePublish = async (id) => {
    await api.patch(`/matches/${id}/publish`);
    fetchData();
  };

  const liveMatches = matches.filter(m => m.status === "Ongoing");
  const upcoming = matches.filter(m => m.status === "Upcoming");
  const completed = matches.filter(m => m.status === "Completed");

  return (
    <div className="mx-auto container p-5 flex flex-col gap-8 min-h-screen">
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

      {/* All Matches */}
      <h2 className="text-2xl font-bold">All Matches</h2>
      <div className="space-y-4 min-h-80">
        {matches.map((m) => (
          <div key={m._id}>
            <MatchCard m={m} />
            {role === "NITAdmin" && m.status !== "Completed" && (
              <button
                onClick={() => { setSelectedMatch(m); setShowUpdate(true); }}
                className="mt-2 bg-yellow-500 text-white px-3 py-1 rounded-md flex gap-2 items-center"
              >
                <Edit size={16} /> Update Result
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pending Publish */}
      {role === "CommonAdmin" && pending.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-green-700">Pending Results</h2>
          {pending.map((p) => (
            <div key={p._id} className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span>{p.teamA_id?.name} vs {p.teamB_id?.name}</span>
              <button
                onClick={() => handlePublish(p._id)}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
              >
                Publish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4">
        <StatCard title="Total Matches" stat={matches.length} subtitle="Total games" Item={Calendar} />
        <StatCard title="Live Matches" stat={liveMatches.length} subtitle="Currently running" Item={Users} />
        <StatCard title="Completed" stat={completed.length} subtitle="Finished games" Item={Clock} />
        <StatCard title="Upcoming" stat={upcoming.length} subtitle="Fixtures scheduled" Item={Trophy} />
      </div>

      {/* Add Match Modal */}
      {showAdd && (
        <Modal title="Add Match" onClose={() => setShowAdd(false)} onSave={handleAddMatch}>
          <FormSelect label="Event" options={events} valueKey="_id" labelKey="name"
            onChange={(v) => setForm({ ...form, event_id: v })} />
          <FormSelect label="Team A" options={teams} valueKey="_id" labelKey="name"
            onChange={(v) => setForm({ ...form, teamA_id: v })} />
          <FormSelect label="Team B" options={teams} valueKey="_id" labelKey="name"
            onChange={(v) => setForm({ ...form, teamB_id: v })} />
          <FormInput label="Venue" onChange={(v) => setForm({ ...form, venue: v })} />
          <FormInput type="datetime-local" label="Match Date & Time" onChange={(v) => setForm({ ...form, matchDateTime: v })} />
        </Modal>
      )}

      {/* Update Result Modal */}
      {showUpdate && selectedMatch && (
        <Modal title="Update Match Result" onClose={() => setShowUpdate(false)} onSave={handleUpdateResult}>
          <FormInput label="Score A" type="number" onChange={(v) => setForm({ ...form, scoreA: Number(v) })} />
          <FormInput label="Score B" type="number" onChange={(v) => setForm({ ...form, scoreB: Number(v) })} />
          <FormInput label="Remarks" onChange={(v) => setForm({ ...form, remarks: v })} />
        </Modal>
      )}
    </div>
  );
}

/* ------------------ Helper Components ------------------ */

function FormInput({ label, type = "text", onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

function FormSelect({ label, options, valueKey, labelKey, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt[valueKey]} value={opt[valueKey]}>
            {opt[labelKey]}
          </option>
        ))}
      </select>
    </div>
  );
}

function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
        </div>
      </div>
    </div>
  );
}
