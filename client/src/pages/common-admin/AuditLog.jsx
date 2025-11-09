import React, { useEffect, useState } from "react";
import {
  Search,
  ListFilter,
  Upload,
  Activity,
  User,
  Server,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import api from "../../api/axios";

const handleExport = async () => {
  const res = await api.get("/auditlogs/export", { responseType: "blob" });
  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "audit_logs.csv");
  document.body.appendChild(link);
  link.click();
};

const AuditLogItem = ({
  icon,
  actor,
  status,
  actionTitle,
  actionDetails,
  timestamp,
  isHighlighted = false,
}) => {
  const statusBadgeMap = {
    success: "bg-green-100 text-green-700",
    pending: "bg-orange-100 text-orange-700",
    info: "bg-blue-100 text-blue-700",
  };
  const statusBorderMap = {
    success: "border-l-green-500",
    pending: "border-l-orange-500",
    info: "border-l-blue-500",
  };

  const badgeClass = statusBadgeMap[status] || "bg-gray-100 text-gray-700";
  const borderClass = statusBorderMap[status] || "border-l-gray-300";
  const backgroundClass = isHighlighted
    ? "bg-blue-50"
    : "bg-white hover:bg-gray-50";

  return (
    <div
      className={`p-5 rounded-lg border border-gray-200 shadow-sm transition-colors ${backgroundClass} border-l-4 ${borderClass}`}
    >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium text-gray-700">{actor}</span>
        <span
          className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeClass}`}
        >
          {status}
        </span>
      </div>

      <h3 className="text-md font-semibold text-gray-800 hover:underline cursor-pointer">
        {actionTitle}
      </h3>
      <p className="text-sm text-gray-600 mt-1">{actionDetails}</p>

      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
        <Calendar className="h-4 w-4" />
        <span>{new Date(timestamp).toLocaleString()}</span>
      </div>
    </div>
  );
};

function AuditLogPage() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch logs
  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/auditlogs?page=${page}&limit=8`);
      setLogs(res.data.formatted || []);
      setFilteredLogs(res.data.formatted || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load audit logs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  // Search filter
  useEffect(() => {
    if (search.trim() === "") {
      setFilteredLogs(logs);
    } else {
      const q = search.toLowerCase();
      const filtered = logs.filter(
        (log) =>
          log.actor?.toLowerCase().includes(q) ||
          log.action?.toLowerCase().includes(q) ||
          log.details?.toLowerCase().includes(q)
      );
      setFilteredLogs(filtered);
    }
  }, [search, logs]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Audit Log</h1>
          <p className="text-gray-600">
            Track all system activities and administrative actions
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          <span>Export Log</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search by user, action, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0">
          <ListFilter className="h-4 w-4" />
          <span>All Actions</span>
        </button>
      </div>

      {/* Main Log Container */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-gray-200">
          <Activity className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activities
            </h2>
            <p className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-5 text-center text-gray-500">
            Loading audit logs...
          </div>
        ) : error ? (
          <div className="p-5 text-center text-red-600">{error}</div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-5 text-center text-gray-500">No logs found.</div>
        ) : (
          <div className="p-5 space-y-4">
            {filteredLogs.map((item, index) => (
              <AuditLogItem
                key={item._id || index}
                icon={
                  item.actor?.toLowerCase().includes("system") ? (
                    <Server className="h-5 w-5 text-gray-500" />
                  ) : (
                    <User className="h-5 w-5 text-gray-500" />
                  )
                }
                actor={item.actor || "Unknown Actor"}
                status={item.status || "info"}
                actionTitle={item.action || "Performed Action"}
                actionDetails={item.details || "No details available"}
                timestamp={item.timestamp}
                isHighlighted={index === 0}
              />
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex justify-center items-center gap-3 mt-6">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
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
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className={`flex items-center gap-1 px-3 py-2 rounded-lg border text-sm font-medium ${
              page === totalPages
                ?"text-white bg-blue-300 cursor-not-allowed"
                : "text-white bg-blue-500 hover:bg-blue-400"
            }`}
          >
            Next <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default AuditLogPage;
