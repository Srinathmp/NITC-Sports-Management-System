import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from '../contexts/AuthContexts';
import {
  Search, Filter, Trophy, Calendar, MapPin, Users, Eye, Edit,
  CheckCircle, XCircle
} from "lucide-react";
import FullPageLoader from "../components/FullPageLoader";

/* ✅ Toast Component */
function Toast({ message, type }) {
  return (
    <div
      className={`mt-14 fixed top-6 right-6 px-4 py-2 rounded-lg shadow-lg text-white transition-all duration-500 ${type === "success" ? "bg-green-600" : "bg-red-600"
        }`}
    >
      {message}
    </div>
  );
}

export default function Events() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [visibleEvents, setVisibleEvents] = useState([])

  const { user } = useAuth();

  /* ---- Fetch Events ---- */
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/allEventsPublic");
      setEvents(res.data || []);
      setFilteredEvents(res.data || []);
      setLoading(false);
      console.log(res.data)
    } catch (err) {
      console.error("Error fetching events:", err);
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  /* ---- Filters ---- */
  useEffect(() => {
    let filtered = [...events];
    if (statusFilter !== "All") filtered = filtered.filter(e => e.status === statusFilter);
    if (searchQuery.trim())
      filtered = filtered.filter(e => e.name.toLowerCase().includes(searchQuery.toLowerCase()));
    setFilteredEvents(filtered);
    const val = (user === "NITAdmin" || user === "CommonAdmin"
      ? filtered
      : filtered.filter((e) => e.status !== "Pending" && e.status !== "PendingValidation"))
    setVisibleEvents(events)
    // console.log(filtered,val)
  }, [events, searchQuery, statusFilter]);

  if (loading) return <FullPageLoader />;

  /* ---- Modal Actions ---- */
  const openViewModal = (e) => {
    setSelected(e);
    setShowViewModal(true);
  };

  const handleValidation = async (status) => {
    try {
      await api.patch(`/events/${selected._id}/validate`, { status });
      setShowViewModal(false);
      setToast({ message: `Event ${status === "Scheduled" ? "approved ✅" : "rejected ❌"}`, type: "success" });
      fetchEvents();
      setTimeout(() => setToast(null), 2500);
    } catch (err) {
      console.error("Validation failed:", err);
      setToast({ message: "Action failed. Try again.", type: "error" });
      setTimeout(() => setToast(null), 2500);
    }
  };

  /* ---- Styling ---- */
  const labelStyle = {
    Scheduled: "bg-blue-600 text-white",
    PendingValidation: "bg-yellow-500 text-white",
    Cancelled: "bg-red-600 text-white",
    Completed: "bg-green-600 text-white",
  };

  /* ---- user-based visibility ---- */

  return (
    <div className="w-full p-8 px-4 md:px-8">
      {toast && <Toast message={toast.message} type={toast.type} />}

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
        {visibleEvents.map((ev) => (
          <div key={ev._id} className="bg-white border border-black/20 rounded-xl shadow-sm p-6">
            {/* Title & Badge */}
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">{ev.name}</h2>
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${labelStyle[ev.status]}`}>
                {ev.status}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-3">
              Organized by {ev.organizer || "NIT"}
            </p>

            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2"><Trophy size={15} /> {ev.sport}</p>
              <p className="flex items-center gap-2"><Calendar size={15} /> {new Date(ev.datetime).toLocaleDateString()}</p>
              <p className="flex items-center gap-2"><MapPin size={15} /> {ev.venue}</p>
              <p className="flex items-center gap-2">
                <Users size={15} /> Teams Registered: {ev.registeredTeams ?? 0}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => openViewModal(ev)}
                className="w-full py-2 border border-black/20 rounded-lg font-semibold hover:bg-gray-100 flex items-center justify-center gap-2"
              >
                <Eye size={16} /> View Details
              </button>

              {user === "NITAdmin" && (
                <button
                  onClick={() => openViewModal(ev)}
                  className="w-full py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 flex items-center justify-center gap-2"
                >
                  <Edit size={16} /> Edit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View Modal */}
      {showViewModal && selected && (
        <Modal title="Event Details" onClose={() => setShowViewModal(false)}>
          <div className="overflow-x-auto border border-black/30 rounded-lg">
            <table className="w-full text-sm text-left text-gray-700 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              <tbody>
                <tr className="border-b border-black-10 hover:bg-gray-50 transition">
                  <th className="border-r border-black/30 px-4 py-3 font-bold bg-blue-50 w-1/3 rounded-tl-xl">Name</th>
                  <td className="px-4 py-3 font-semibold">{selected.name}</td>
                </tr>
                <tr className="border-b border-black-10 hover:bg-gray-50 transition">
                  <th className="border-r border-black/30 px-4 py-3 font-bold bg-blue-50">Sport</th>
                  <td className="px-4 py-3 font-semibold">{selected.sport}</td>
                </tr>
                <tr className="border-b border-black-10 hover:bg-gray-50 transition">
                  <th className="border-r border-black/30 px-4 py-3 font-bold bg-blue-50">Venue</th>
                  <td className="px-4 py-3 font-semibold">{selected.venue}</td>
                </tr>
                <tr className="border-b border-black-10 hover:bg-gray-50 transition">
                  <th className="border-r border-black/30 px-4 py-3 font-bold bg-blue-50">Date</th>
                  <td className="px-4 py-3 font-semibold">{new Date(selected.datetime).toLocaleString()}</td>
                </tr>
                <tr className="border-b border-black-10 hover:bg-gray-50 transition">
                  <th className="border-r border-black/30 px-4 py-3 font-bold bg-blue-50">Status</th>
                  <td className="px-4 py-3 font-semibold">{selected.status}</td>
                </tr>
                <tr className="hover:bg-gray-50black-10ion">
                  <th className="border-r border-black/30 px-4 py-3 font-bold bg-blue-50 rounded-bl-xl">Stage</th>
                  <td className="px-4 py-3 font-semibold rounded-br-xl">{selected.stage || "N/A"}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ✅ Approve / Reject Buttons for CommonAdmin */}
          {user === "CommonAdmin" && selected.status === "PendingValidation" && (
            <div className="flex justify-end gap-3 mt-6 text-black">
              <button
                onClick={() => handleValidation("Scheduled")}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <CheckCircle size={16} /> Approve
              </button>
              <button
                onClick={() => handleValidation("Cancelled")}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <XCircle size={16} /> Reject
              </button>
            </div>
          )}
        </Modal>
      )}

    </div>
  );
}

/* ------------------ Modal ------------------ */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}