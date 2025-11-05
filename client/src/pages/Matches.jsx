import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { Calendar, MapPin, Clock, PlusCircle, Edit } from "lucide-react";

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [pending, setPending] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [form, setForm] = useState({});
  const [selectedMatch, setSelectedMatch] = useState(null);
  const role = localStorage.getItem("user");
//   console.log('Role:'+role);
  

  const fetchMatches = async () => {
    const res = await api.get("/matches");
    setMatches(res.data);
  };

  const fetchPending = async () => {
    if (role === "CommonAdmin") {
      const res = await api.get("/matches/pending");
      setPending(res.data);
    }
  };

  useEffect(() => {
    fetchMatches();
    fetchPending();
  }, []);

  const handleAddMatch = async () => {
    await api.post("/matches", form);
    setShowAdd(false);
    fetchMatches();
  };

  const handleUpdateResult = async () => {
    await api.patch(`/matches/${selectedMatch._id}/result`, form);
    setShowUpdate(false);
    fetchMatches();
  };

  const handlePublish = async (id) => {
    await api.patch(`/matches/${id}/publish`);
    fetchPending();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-700">Matches</h1>

      {/* Buttons */}
      {role === "CommonAdmin" && (
        <button
          onClick={() => setShowAdd(true)}
          className="mb-6 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          <PlusCircle size={18} /> Add New Match
        </button>
      )}

      {/* Matches List */}
      <div className="space-y-4">
        {matches.map((m) => (
          <div key={m._id} className="p-4 bg-white border rounded-xl shadow-sm">
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">
                {m.teamA_id?.name} vs {m.teamB_id?.name}
              </h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  m.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {m.status}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {m.event_id?.sport} —{" "}
              {new Date(m.matchDateTime).toLocaleDateString()}{" "}
              {new Date(m.matchDateTime).toLocaleTimeString()}
            </p>
            <p className="text-sm text-gray-600">
              Score: {m.scoreA} - {m.scoreB}
            </p>

            {role === "NITAdmin" && m.status !== "Completed" && (
              <button
                onClick={() => {
                  setSelectedMatch(m);
                  setShowUpdate(true);
                }}
                className="mt-3 flex items-center gap-1 bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
              >
                <Edit size={16} /> Update Result
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Pending Results for CommonAdmin */}
      {role === "CommonAdmin" && pending.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-green-700">
            Pending Results to Publish
          </h2>
          {pending.map((p) => (
            <div
              key={p._id}
              className="p-4 bg-gray-50 border rounded-xl flex justify-between items-center"
            >
              <span className="font-medium">
                {p.teamA_id?.name} vs {p.teamB_id?.name}
              </span>
              <button
                onClick={() => handlePublish(p._id)}
                className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 text-sm"
              >
                Publish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Match Modal */}
      {showAdd && (
        <Modal title="Add Match" onClose={() => setShowAdd(false)} onSave={handleAddMatch}>
          <FormInput label="Event ID" onChange={(v) => setForm({ ...form, event_id: v })} />
          <FormInput label="Team A ID" onChange={(v) => setForm({ ...form, teamA_id: v })} />
          <FormInput label="Team B ID" onChange={(v) => setForm({ ...form, teamB_id: v })} />
          <FormInput
            label="Match Date & Time"
            type="datetime-local"
            onChange={(v) => setForm({ ...form, matchDateTime: v })}
          />
        </Modal>
      )}

      {/* Update Result Modal */}
      {showUpdate && selectedMatch && (
        <Modal title="Update Match Result" onClose={() => setShowUpdate(false)} onSave={handleUpdateResult}>
          <FormInput
            label="Score A"
            type="number"
            onChange={(v) => setForm({ ...form, scoreA: Number(v) })}
          />
          <FormInput
            label="Score B"
            type="number"
            onChange={(v) => setForm({ ...form, scoreB: Number(v) })}
          />
          <FormInput
            label="Remarks"
            onChange={(v) => setForm({ ...form, remarks: v })}
          />
        </Modal>
      )}
    </div>
  );
}

/* Helper Components */
function FormInput({ label, type = "text", onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
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
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
            Close
          </button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
