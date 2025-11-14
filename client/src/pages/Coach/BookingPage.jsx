import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Plus } from "lucide-react";

export default function BookingPage() {
  const [tab, setTab] = useState("accommodation");

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book Accommodation & Mess</h1>
      <Tabs value={tab} onChange={setTab}>
        <Tab id="accommodation" label="Accommodation">
          <AccommodationBookingTab />
        </Tab>
        <Tab id="mess" label="Mess">
          <MessBookingTab />
        </Tab>
      </Tabs>
    </div>
  );
}

function AccommodationBookingTab() {
  const [list, setList] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(1);
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]); 

  const fetchTeams = async () => {
    const res = await api.get("/v1/teams/my-teams");
    setTeams(res.data || []);
    if (res.data.length === 1) setTeamId(res.data[0]._id);
  };


  const fetchAll = async () => {
    const [acc, mine] = await Promise.all([
      api.get("/accommodation"),
      api.get("/bookings/accommodation/my"),
    ]);
    setList(acc.data || []);
    setMyBookings(mine.data || []);
  };

  useEffect(() => { fetchAll(); fetchTeams(); }, []);

  const openBook = (acc) => {
    setSelected(acc);
    setCount(1);
    setShowModal(true);
  };

  const submitBooking = async () => {
    try {
      if (!teamId) {
        alert("Please provide your Team ID");
        return;
      }
      await api.post("/bookings/accommodation", {
        accommodation_id: selected._id,
        team_id: teamId,
        count: Number(count),
      });
      setShowModal(false);
      fetchAll();
      alert("Accommodation booked!");
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to book");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {list.map((a) => (
          <div key={a._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-lg">{a.hostel_name}</h3>
            <p className="text-sm text-gray-600">Capacity: {a.capacity}</p>
            <p className="text-sm text-gray-600">Occupied: {a.occupied}</p>
            {a.remarks && <p className="text-sm text-gray-600 mt-1"><strong>Amenities:</strong> {a.remarks}</p>}
            <button
              onClick={() => openBook(a)}
              className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              <Plus size={16} /> Book
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">My Accommodation Bookings</h2>
      {myBookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="space-y-2">
          {myBookings.map((b) => (
            <div key={b._id} className="bg-gray-50 border rounded p-3">
              <div className="font-medium">{b.accommodation_id?.hostel_name}</div>
              <div className="text-sm text-gray-600">
                Team: {b.team_id?.name || b.team_id} • Count: {b.count} • Status: {b.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selected && (
        <Modal title={`Book: ${selected.hostel_name}`} onClose={() => setShowModal(false)} onSave={submitBooking}>
          {/* <FormInput label="Team ID" value={teamId} onChange={setTeamId} /> */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Team</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose your team</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.sport ? `(${t.sport})` : ""}
                </option>
              ))}
            </select>
          </div>
          <FormInput label="People Count" type="number" value={count} onChange={(v) => setCount(Number(v))} />
        </Modal>
      )}
    </>
  );
}

function MessBookingTab() {
  const [list, setList] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [count, setCount] = useState(1);
  const [teamId, setTeamId] = useState("");
  const [teams, setTeams] = useState([]);

  const fetchTeams = async () => {
    const res = await api.get("/v1/teams/my-teams");
    setTeams(res.data || []);
    if (res.data.length === 1) setTeamId(res.data[0]._id);
  };


  const fetchAll = async () => {
    const [m, mine] = await Promise.all([
      api.get("/mess"),
      api.get("/bookings/mess/my"),
    ]);
    setList(m.data || []);
    setMyBookings(mine.data || []);
  };

  useEffect(() => { fetchAll(); fetchTeams();}, []);

  const openBook = (m) => {
    setSelected(m);
    setCount(1);
    setShowModal(true);

  };

  const submitBooking = async () => {
    try {
      if (!teamId) {
        alert("Please provide your Team ID");
        return;
      }
      await api.post("/bookings/mess", {
        mess_id: selected._id,
        team_id: teamId,
        count: Number(count),
      });
      setShowModal(false);
      fetchAll();
      alert("Mess booked!");
    } catch (e) {
      alert(e?.response?.data?.error || "Failed to book mess");
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {list.map((m) => (
          <div key={m._id} className="bg-white border rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-lg">{m.mess_name}</h3>
            <p className="text-sm text-gray-600">Capacity / Meal: {m.capacity_per_meal}</p>
            <p className="text-sm text-gray-600">Occupied: {m.occupied || 0}</p>
            <p className="text-sm text-gray-600">Location: {m.location}</p>
            {m.remarks && <p className="text-sm text-gray-600 mt-1"><strong>Remarks:</strong> {m.remarks}</p>}
            <button
              onClick={() => openBook(m)}
              className="mt-3 inline-flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700"
            >
              <Plus size={16} /> Book
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">My Mess Bookings</h2>
      {myBookings.length === 0 ? (
        <p className="text-gray-600">No bookings yet.</p>
      ) : (
        <div className="space-y-2">
          {myBookings.map((b) => (
            <div key={b._id} className="bg-gray-50 border rounded p-3">
              <div className="font-medium">{b.mess_id?.mess_name}</div>
              <div className="text-sm text-gray-600">
                Team: {b.team_id?.name || b.team_id} • Count: {b.count} • Status: {b.status}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selected && (
        <Modal title={`Book: ${selected.mess_name}`} onClose={() => setShowModal(false)} onSave={submitBooking}>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Team</label>
            <select
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Choose your team</option>
              {teams.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name} {t.sport ? `(${t.sport})` : ""}
                </option>
              ))}
            </select>
          </div>
          <FormInput label="People Count" type="number" value={count} onChange={(v) => setCount(Number(v))} />
        </Modal>
      )}
    </>
  );
}

function FormInput({ label, type = "text", value, onChange }) {
  return (
    <div className="mb-3">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        min={type === "number" ? 1 : undefined}
        onChange={(e) => onChange(type === "number" ? Number(e.target.value) : e.target.value)}
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
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">Close</button>
          <button onClick={onSave} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Book</button>
        </div>
      </div>
    </div>
  );
}

export function Tabs({ value, onChange, children }) {
  return (
    <>
      <div className="flex gap-2 mb-4">
        {React.Children.map(children, (child) => (
          <button
            className={`px-3 py-1.5 rounded-md border ${value === child.props.id ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-300"}`}
            onClick={() => onChange(child.props.id)}
          >
            {child.props.label}
          </button>
        ))}
      </div>
      {React.Children.map(children, (child) => value === child.props.id && <div>{child.props.children}</div>)}
    </>
  );
}
export function Tab() { return null; }
