import React, { useState, useEffect } from "react";
import { Plus, Edit } from "lucide-react";
import api from "../../api/axios";

function Accommodation() {
  const [accommodations, setAccommodations] = useState([]);
  const [messes, setMesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showMessModal, setShowMessModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    hostel_name: "",
    room_number: "",
    capacity: "",
    occupied: "",
    check_in_date: "",
    check_out_date: "",
    remarks: "",
  });
  const [messForm, setMessForm] = useState({
    mess_name: "",
    capacity_per_meal: "",
    location: "",
    remarks: "",
  });

  // Fetch accommodation and mess data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [accRes, messRes] = await Promise.all([
        api.get("/accommodation"),
        api.get("/mess"),
      ]);
      setAccommodations(accRes.data || []);
      setMesses(messRes.data || []);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Save for Accommodation
  const handleSaveAccommodation = async () => {
    try {
      if (editItem) {
        await api.put(`/accommodation/${editItem._id}`, form);
      } else {
        await api.post("/accommodation", form);
      }
      setShowModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      console.error("Error saving accommodation:", err);
      console.log("Error saving accommodation:", err);
      alert("Failed to save accommodation details.");
    }
  };

  // Handle Save for Mess
  const handleSaveMess = async () => {
    try {
      if (editItem) {
        await api.put(`/mess/${editItem._id}`, messForm);
      } else {
        if (!messForm.mess_name || !messForm.capacity_per_meal || !messForm.location) {
            alert("Please fill all required fields before saving.");
            return;
        }
        await api.post("/mess", messForm);
      }
      setShowMessModal(false);
      setEditItem(null);
      fetchData();
    } catch (err) {
      console.error("Error saving mess details:", err);
      alert("Failed to save mess details.");
    }
  };

  const openAddAccommodation = () => {
    setForm({
      hostel_name: "",
      room_number: "",
      capacity: "",
      occupied: "",
      check_in_date: "",
      check_out_date: "",
      remarks: "",
    });
    setEditItem(null);
    setShowModal(true);
  };

  const openEditAccommodation = (item) => {
    setEditItem(item);
    setForm({
      hostel_name: item.hostel_name,
      room_number: item.room_number,
      capacity: item.capacity,
      occupied: item.occupied,
      check_in_date: item.check_in_date?.split("T")[0] || "",
      check_out_date: item.check_out_date?.split("T")[0] || "",
      remarks: item.remarks,
    });
    setShowModal(true);
  };

  const openAddMess = () => {
    setMessForm({
      mess_name: "",
      capacity_per_meal: "",
      location: "",
      remarks: "",
    });
    setEditItem(null);
    setShowMessModal(true);
  };

  const openEditMess = (item) => {
    setEditItem(item);
    setMessForm({
      mess_name: item.mess_name,
      capacity_per_meal: item.capacity_per_meal,
      location: item.location,
      remarks: item.remarks,
    });
    setShowMessModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Accommodation & Mess Management
      </h1>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={openAddAccommodation}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" /> Add Accommodation
        </button>

        <button
          onClick={openAddMess}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5" /> Add Mess
        </button>
      </div>

      {loading ? (
        <p>Loading details...</p>
      ) : (
        <>
          {/* Accommodation Section */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            🏠 Accommodation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {accommodations.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.hostel_name}
                  </h3>
                  <button
                    onClick={() => openEditAccommodation(item)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Room No: {item.room_number}
                </p>
                <p className="text-sm text-gray-600">
                  Capacity: {item.capacity} | Occupied: {item.occupied}
                </p>
                <p className="text-sm text-gray-600">
                  Check-in:{" "}
                  {item.check_in_date
                    ? new Date(item.check_in_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  Check-out:{" "}
                  {item.check_out_date
                    ? new Date(item.check_out_date).toLocaleDateString()
                    : "N/A"}
                </p>
                {item.remarks && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Amenities:</strong> {item.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Mess Section */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            🍽️ Mess Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messes.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {item.mess_name}
                  </h3>
                  <button
                    onClick={() => openEditMess(item)}
                    className="p-2 rounded-md hover:bg-gray-100"
                  >
                    <Edit className="h-4 w-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">
                  Capacity: {item.capacity_per_meal} per meal
                </p>
                <p className="text-sm text-gray-600">
                  Location: {item.location}
                </p>
                {item.remarks && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Remarks:</strong> {item.remarks}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Accommodation Modal */}
      {showModal && (
        <Modal
          title={editItem ? "Edit Accommodation" : "Add Accommodation"}
          onClose={() => setShowModal(false)}
          onSave={handleSaveAccommodation}
        >
          <FormInput
            label="Hostel Name"
            value={form.hostel_name}
            onChange={(v) => setForm({ ...form, hostel_name: v })}
          />
          <FormInput
            label="Room Number"
            value={form.room_number}
            onChange={(v) => setForm({ ...form, room_number: v })}
          />
          <FormInput
            label="Capacity"
            type="number"
            value={form.capacity}
            onChange={(v) => setForm({ ...form, capacity: v })}
          />
          <FormInput
            label="Occupied"
            type="number"
            value={form.occupied}
            onChange={(v) => setForm({ ...form, occupied: v })}
          />
          <FormInput
            label="Check-in Date"
            type="date"
            value={form.check_in_date}
            onChange={(v) => setForm({ ...form, check_in_date: v })}
          />
          <FormInput
            label="Check-out Date"
            type="date"
            value={form.check_out_date}
            onChange={(v) => setForm({ ...form, check_out_date: v })}
          />
          <FormInput
            label="Amenities"
            value={form.remarks}
            onChange={(v) => setForm({ ...form, remarks: v })}
          />
        </Modal>
      )}

      {/* Mess Modal */}
      {showMessModal && (
        <Modal
          title={editItem ? "Edit Mess" : "Add Mess"}
          onClose={() => setShowMessModal(false)}
          onSave={handleSaveMess}
        >
          <FormInput
            label="Mess Name"
            value={messForm.mess_name}
            onChange={(v) => setMessForm({ ...messForm, mess_name: v })}
          />
          <FormInput
            label="Capacity per Meal"
            type="number"
            value={messForm.capacity_per_meal}
            onChange={(v) =>
              setMessForm({ ...messForm, capacity_per_meal: v })
            }
          />
          <FormInput
            label="Location"
            value={messForm.location}
            onChange={(v) => setMessForm({ ...messForm, location: v })}
          />
          <FormInput
            label="Remarks"
            value={messForm.remarks}
            onChange={(v) => setMessForm({ ...messForm, remarks: v })}
          />
        </Modal>
      )}
    </div>
  );
}

/* Reusable Form Input */
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
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

/* Reusable Modal Component */
function Modal({ title, children, onClose, onSave }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        {children}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Details
          </button>
        </div>
      </div>
    </div>
  );
}

export default Accommodation;
