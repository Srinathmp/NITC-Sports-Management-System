import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Search, Filter, Trophy, Calendar, MapPin, Users, Eye, Edit } from "lucide-react";
import FullPageLoader from "../components/FullPageLoader";

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState({});

  const role = localStorage.getItem("user");

  const fetchEvents = async () => {
    const res = await api.get("/events/allEvents");
    setEvents(res.data || []);
    setFilteredEvents(res.data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    let filtered = [...events];
    if (statusFilter !== "All") filtered = filtered.filter(e => e.status === statusFilter);
    if (searchQuery.trim())
      filtered = filtered.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredEvents(filtered);
  }, [events, searchQuery, statusFilter]);

  if (loading) return <FullPageLoader />;

  const labelStyle = {
    Scheduled: "bg-blue-600 text-white",
    Pending: "bg-yellow-500 text-white",
    Cancelled: "bg-red-600 text-white",
    Completed: "bg-green-600 text-white"
  };

  const openViewModal = (e) => { setSelected(e); setShowViewModal(true); };
  const openEditModal = (e) => {
    setEditEvent(e);
    setForm({
      name: e.name,
      sport: e.sport,
      venue: e.venue,
      datetime: e.datetime.split("T")[0],
      status: e.status,
      stage: e.stage || "",
      maxTeams: e.maxTeams || 0,
      registeredTeams: e.registeredTeams || 0,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    await api.put(`/events/${editEvent._id}`, form);
    setShowEditModal(false);
    fetchEvents();
  };

  return (
    <div className="w-full p-8 px-4 md:px-8">
      <h1 className="text-3xl font-bold">Events</h1>
      <p className="text-gray-500 mb-8">Browse upcoming and ongoing tournaments</p>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full">
        <div className="relative w-full md:w-2/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search events, sports, or organizers..."
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
            <option>All</option>
            <option>Scheduled</option>
            <option>Pending</option>
            <option>Cancelled</option>
            <option>Completed</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((ev) => {
          const percent = ev.maxTeams ? Math.round((ev.registeredTeams / ev.maxTeams) * 100) : 0;
          return (
            <div key={ev._id} className="bg-white border border-black/20 rounded-xl shadow-sm p-6">
              {/* Title & Badge */}
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold">{ev.name}</h2>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${labelStyle[ev.status]}`}>
                  {ev.status}
                </span>
              </div>

              <p className="text-sm text-gray-500 mb-3">Organized by {ev.organizer || "NIT"}</p>

              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Trophy size={15} /> {ev.sport}</p>
                <p className="flex items-center gap-2"><Calendar size={15} /> {new Date(ev.datetime).toLocaleDateString()}</p>
                <p className="flex items-center gap-2"><MapPin size={15} /> {ev.venue}</p>
                <p className="flex items-center gap-2"> <Users size={15} /> Teams Registered: {ev.registeredTeams ?? 0} </p>

              </div>

              {/* Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => openViewModal(ev)}
                  className="w-full py-2 border border-black/20 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <Eye size={16} /> View Details
                </button>
                {role === "NITAdmin" && (
                  <button
                    onClick={() => openEditModal(ev)}
                    className="w-full py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 flex items-center justify-center gap-2"
                  >
                    <Edit size={16} /> Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View Modal */}
      {showViewModal && <Modal title="Event Details" onClose={() => setShowViewModal(false)}>
        <p><b>Name:</b> {selected.name}</p>
        <p><b>Sport:</b> {selected.sport}</p>
        <p><b>Venue:</b> {selected.venue}</p>
        <p><b>Date:</b> {new Date(selected.datetime).toLocaleString()}</p>
        <p><b>Status:</b> {selected.status}</p>
        <p><b>Stage:</b> {selected.stage || "N/A"}</p>
      </Modal>}

      {/* Edit Modal */}
      {showEditModal && <Modal title="Update Event" onClose={() => setShowEditModal(false)} onSave={handleUpdate}>
        <FormInput label="Event Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <FormInput label="Sport" value={form.sport} onChange={(v) => setForm({ ...form, sport: v })} />
        <FormInput label="Venue" value={form.venue} onChange={(v) => setForm({ ...form, venue: v })} />
        <FormInput label="Date" type="datetime-local" value={form.datetime} onChange={(v) => setForm({ ...form, datetime: v })} />
        <FormInput label="Stage" value={form.stage} onChange={(v) => setForm({ ...form, stage: v })} />
      </Modal>}
    </div>
  );
}

function FormInput({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-2">
      <label className="text-sm">{label}</label>
      <input type={type} className="w-full border border-black/20 p-2 rounded-md mt-1" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Close</button>
          {onSave && <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>}
        </div>
      </div>
    </div>
  );
}
