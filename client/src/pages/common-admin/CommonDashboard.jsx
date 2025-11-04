import React, { useEffect, useState } from "react";
import { Users, Award, Calendar, Check, X } from "lucide-react";
import api from "../../api/axios"; // ✅ Ensure your axios instance is configured

// Reusable Stat Card
const StatCard = ({ title, value, Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);

// Pending Registration Card
const PendingRegistrationItem = ({ nit, onApprove, onReject }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
    <div>
      <h4 className="font-semibold text-gray-800">{nit.name}</h4>
      <p className="text-sm text-gray-500">
        Registered: {new Date(nit.created_at).toLocaleDateString()}
      </p>
    </div>
    <div className="flex gap-2 mt-3 sm:mt-0 flex-shrink-0">
      <button
        onClick={() => onApprove(nit._id)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer"
      >
        <Check className="h-4 w-4" />
        <span>Approve</span>
      </button>
      <button
        onClick={() => onReject(nit._id)}
        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer"
      >
        <X className="h-4 w-4" />
        <span>Reject</span>
      </button>
    </div>
  </div>
);

function CommonAdminDashboard() {
  const [nits, setNits] = useState([]);
  const [events, setEvents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [nitsRes, eventsRes, matchesRes] = await Promise.all([
        api.get("/nits"),
        api.get("/events"),
        api.get("/matches"),
      ]);

      setNits(nitsRes.data || []);
      setEvents(eventsRes.data || []);
      setMatches(matchesRes.data || []);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Approve NIT
  const handleApprove = async (id) => {
    try {
      await api.patch(`/nits/${id}/approve`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to approve NIT registration.");
    }
  };

  // Reject NIT
  const handleReject = async (id) => {
    try {
      await api.patch(`/nits/${id}/reject`);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to reject NIT registration.");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const pendingNITs = nits.filter((n) => n.status === "Pending");
  const ongoingEvents = events.filter((e) => e.status === "Ongoing");
  const scheduledMatches = matches.filter((m) => m.status === "Scheduled");

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Common Admin Dashboard
        </h1>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total NITs" value={nits.length} Icon={Users} />
        <StatCard
          title="Active Events"
          value={ongoingEvents.length}
          Icon={Award}
        />
        <StatCard
          title="Scheduled Matches"
          value={scheduledMatches.length}
          Icon={Calendar}
        />
      </div>

      {/* Pending NIT Registrations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Pending NIT Registrations
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Review and approve new NIT registrations
        </p>

        {loading ? (
          <p>Loading...</p>
        ) : pendingNITs.length === 0 ? (
          <p className="text-gray-600">No pending registrations.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {pendingNITs.map((nit) => (
              <PendingRegistrationItem
                key={nit._id}
                nit={nit}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default CommonAdminDashboard;
