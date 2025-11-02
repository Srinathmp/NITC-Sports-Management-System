import React, { useState, useRef } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import api from '../../api/axios'; // Make sure this path matches your structure

const FormInput = ({ label, placeholder, required, value, onChange }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

const FormSelect = ({ label, placeholder, required, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div>
      <label className="block mb-2 text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center text-left"
        >
          <span className={value ? 'text-gray-900' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            <ul className="p-1">
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`p-2 text-gray-800 rounded-md cursor-pointer ${
                    value === option ? 'bg-gray-100 font-medium' : 'hover:bg-gray-100'
                  }`}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

const FormDateInput = ({ label, placeholder, required, value, onChange }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
      <input
        type="text"
        placeholder={placeholder}
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>
);

const FormTextarea = ({ label, placeholder, value, onChange }) => (
  <div>
    <label className="block mb-2 text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      placeholder={placeholder}
      rows={4}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    ></textarea>
  </div>
);

function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    sport: "",
    venue: "",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sportOptions = [
    'Basketball', 'Football', 'Cricket', 'Volleyball', 'Badminton',
    'Table Tennis', 'Tennis', 'Chess', 'Athletics', 'Swimming'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name || !form.sport || !form.venue || !form.startDate) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/events", {
        name: form.name,
        sport: form.sport,
        venue: form.venue,
        datetime: form.startDate, // backend uses single datetime
        description: form.description,
        endDate: form.endDate, // optional, for clarity
      });
      setSuccess("✅ Event created successfully!");
      setForm({ name: "", sport: "", venue: "", startDate: "", endDate: "", description: "" });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create event. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
        {/* <p className="text-gray-600">NIT Trichy</p> */}
      </div>

      <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create New Event</h2>
          <p className="text-sm text-gray-500">Add a new sports event to the tournament schedule</p>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <FormInput
            label="Event Name"
            placeholder="e.g., Men's Basketball Finals"
            required
            value={form.name}
            onChange={(value) => setForm({ ...form, name: value })}
          />

          <FormSelect
            label="Sport Type"
            placeholder="Select sport type"
            required
            options={sportOptions}
            value={form.sport}
            onChange={(value) => setForm({ ...form, sport: value })}
          />

          <FormInput
            label="Venue"
            placeholder="e.g., Main Sports Complex"
            required
            value={form.venue}
            onChange={(value) => setForm({ ...form, venue: value })}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormDateInput
              label="Start Date"
              placeholder="Pick a date"
              required
              value={form.startDate}
              onChange={(value) => setForm({ ...form, startDate: value })}
            />
            <FormDateInput
              label="End Date"
              placeholder="Pick a date"
              required
              value={form.endDate}
              onChange={(value) => setForm({ ...form, endDate: value })}
            />
          </div>

          <FormTextarea
            label="Description"
            placeholder="Enter event details and description..."
            value={form.description}
            onChange={(value) => setForm({ ...form, description: value })}
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-medium text-white transition-colors ${loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
