import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Eye, Edit, Search, Filter } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editEvent, setEditEvent] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState({});
  const role = localStorage.getItem("user"); // e.g., "NITAdmin"
//   console.log("role:"+role);
  
  // Fetch events
  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/allEvents");
      setEvents(res.data || []);
      setFilteredEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Filter and search
  useEffect(() => {
    let filtered = [...events];
    if (statusFilter !== "All") {
      filtered = filtered.filter((e) => e.status === statusFilter);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredEvents(filtered);
  }, [statusFilter, searchQuery, events]);

  const openViewModal = (event) => {
    setSelected(event);
    setShowViewModal(true);
  };

  const openEditModal = (event) => {
    setEditEvent(event);
    setForm({
      name: event.name,
      sport: event.sport,
      venue: event.venue,
      datetime: event.datetime.split("T")[0],
      status: event.status,
      stage: event.stage || "",
      maxTeams: event.maxTeams || 0,
      registeredTeams: event.registeredTeams || 0,
    });
    setShowEditModal(true);
  };

  const handleUpdateEvent = async () => {
    try {
      await api.put(`/events/${editEvent._id}`, form);
      setShowEditModal(false);
      fetchEvents();
    } catch (err) {
      console.error("Error updating event:", err);
      alert("Failed to update event.");
    }
  };

  const statusClasses = {
    Scheduled: "text-green-600 bg-green-50 border border-green-200",
    Pending: "text-yellow-600 bg-yellow-50 border border-yellow-200",
    Cancelled: "text-red-600 bg-red-50 border border-red-200",
    Completed: "text-blue-600 bg-blue-50 border border-blue-200",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Events</h2>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
        <div className="relative w-full sm:w-2/3">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search events by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="relative w-full sm:w-1/3">
          <Filter className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="All">All Status</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((ev) => (
            <div
              key={ev._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {ev.name}
                </h3>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    statusClasses[ev.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {ev.status}
                </span>
              </div>

              <p className="text-sm text-gray-700">
                <strong>Sport:</strong> {ev.sport}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Venue:</strong> {ev.venue}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Date:</strong>{" "}
                {new Date(ev.datetime).toLocaleDateString()}
              </p>

              {/* Registration Progress */}
              {ev.maxTeams ? (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Registration</span>
                    <span>
                      {ev.registeredTeams || 0}/{ev.maxTeams}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{
                        width: `${
                          ((ev.registeredTeams || 0) / ev.maxTeams) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ) : null}

              {/* Buttons */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => openViewModal(ev)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  <Eye size={16} /> View Details
                </button>

                {role === "NITAdmin" && (
                  <button
                    onClick={() => openEditModal(ev)}
                    className="flex items-center gap-1 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 text-sm"
                  >
                    <Edit size={16} /> Update
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selected && (
        <Modal title="Event Details" onClose={() => setShowViewModal(false)}>
          <p><strong>Name:</strong> {selected.name}</p>
          <p><strong>Sport:</strong> {selected.sport}</p>
          <p><strong>Venue:</strong> {selected.venue}</p>
          <p><strong>Date:</strong> {new Date(selected.datetime).toLocaleString()}</p>
          <p><strong>Status:</strong> {selected.status}</p>
          <p><strong>Stage:</strong> {selected.stage || "N/A"}</p>
          <p><strong>Max Teams:</strong> {selected.maxTeams || "N/A"}</p>
          <p><strong>Registered Teams:</strong> {selected.registeredTeams || 0}</p>
        </Modal>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <Modal
          title="Update Event"
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateEvent}
        >
          <FormInput
            label="Event Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <FormInput
            label="Sport"
            value={form.sport}
            onChange={(v) => setForm({ ...form, sport: v })}
          />
          <FormInput
            label="Venue"
            value={form.venue}
            onChange={(v) => setForm({ ...form, venue: v })}
          />
          <FormInput
            label="Date"
            type="datetime-local"
            value={form.datetime}
            onChange={(v) => setForm({ ...form, datetime: v })}
          />
          <FormInput
            label="Stage"
            value={form.stage}
            onChange={(v) => setForm({ ...form, stage: v })}
          />
          <FormInput
            label="Max Teams"
            type="number"
            value={form.maxTeams}
            onChange={(v) => setForm({ ...form, maxTeams: Number(v) })}
          />
          <FormInput
            label="Registered Teams"
            type="number"
            value={form.registeredTeams}
            onChange={(v) => setForm({ ...form, registeredTeams: Number(v) })}
          />
          <FormSelect
            label="Status"
            value={form.status}
            options={["Scheduled", "Cancelled", "Completed"]}
            onChange={(v) => setForm({ ...form, status: v })}
          />
        </Modal>
      )}
    </div>
  );
}

/* --- Reusable Components --- */
function FormInput({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}

function FormSelect({ label, value, options, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
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
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
