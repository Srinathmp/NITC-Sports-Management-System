import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Search, Mail } from "lucide-react";
import FullPageLoader from "../../components/FullPageLoader";

export default function CommonAdminUserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nitList, setNitList] = useState([]);
  const [nitFilter, setNitFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ----------------------- MAIL POPUP ----------------------- */
  const [showMailPopup, setShowMailPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [mailSubject, setMailSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [sending, setSending] = useState(false);

  /* ----------------------- ANNOUNCEMENT POPUP ----------------------- */
  const [showAnnouncementPopup, setShowAnnouncementPopup] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMessage, setAnnouncementMessage] = useState("");
  const [announceTarget, setAnnounceTarget] = useState("All");
  const [sendingAnnouncement, setSendingAnnouncement] = useState(false);

  /* ----------------------- FETCH USERS ----------------------- */
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const { data } = await api.get("/notifications/users", {
        params: {
          search,
          role: roleFilter,
          nit: nitFilter,
          page,
          limit: 10,
        },
      });

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------- FETCH NITS ----------------------- */
  const fetchNits = async () => {
    const res = await api.get("/nits/all");
    setNitList(res.data);
  };

  useEffect(() => {
    fetchNits();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [search, roleFilter, nitFilter, page]);

  /* ----------------------- MAIL SENDER ----------------------- */
  const sendMail = async () => {
    try {
      setSending(true);
      await api.post("/notifications/send-mail", {
        userId: selectedUser._id,
        subject: mailSubject,
        message: mailBody,
      });
      alert("Mail sent successfully!");
      setShowMailPopup(false);
      setMailSubject("");
      setMailBody("");
    } catch (err) {
      console.error("Error sending mail:", err);
    } finally {
      setSending(false);
    }
  };

  /* ----------------------- ANNOUNCEMENT SENDER ----------------------- */
  const sendAnnouncement = async () => {
    try {
      setSendingAnnouncement(true);

      await api.post("/notifications/announcement", {
        title: announcementTitle,
        message: announcementMessage,
        target: announceTarget,
      });

      alert("Announcement sent successfully!");
      setShowAnnouncementPopup(false);
      setAnnouncementTitle("");
      setAnnouncementMessage("");
      setAnnounceTarget("All");
    } catch (err) {
      console.error("Announcement error:", err);
      alert("Failed to send announcement");
    } finally {
      setSendingAnnouncement(false);
    }
  };

  if (loading) return <FullPageLoader />;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-3">User Management</h1>
      <p className="text-gray-500 mb-6">View & manage all users</p>

      {/* -------------------------- SEARCH + FILTERS + ANNOUNCEMENT -------------------------- */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full">

        {/* 🔍 Search */}
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            placeholder="Search name, email..."
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 border border-black/20 rounded-lg bg-white focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* Role Filter */}
        <select
          className="w-full md:w-40 px-3 py-2.5 border border-black/20 rounded-lg bg-white focus:ring-2 focus:ring-blue-600"
          value={roleFilter}
          onChange={(e) => {
            setPage(1);
            setRoleFilter(e.target.value);
          }}
        >
          <option value="">All Roles</option>
          <option value="CommonAdmin">Common Admin</option>
          <option value="NITAdmin">NIT Admin</option>
          <option value="Coach">Coach</option>
          <option value="User">User</option>
        </select>

        {/* NIT Filter */}
        <select
          className="w-full md:w-60 px-3 py-2.5 border border-black/20 rounded-lg bg-white focus:ring-2 focus:ring-blue-600"
          value={nitFilter}
          onChange={(e) => {
            setPage(1);
            setNitFilter(e.target.value);
          }}
        >
          <option value="">All NITs</option>
          {nitList.map((n) => (
            <option key={n._id} value={n._id}>{n.name}</option>
          ))}
        </select>

        {/* 📢 Announcement Button */}
        <button
          onClick={() => setShowAnnouncementPopup(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          <Mail size={18} /> Announcement
        </button>
      </div>

      {/* -------------------------- USER TABLE -------------------------- */}
      <div className="bg-white rounded-lg shadow p-4">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">NIT</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b hover:bg-gray-50">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.nit_id?.name || "-"}</td>

                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      setSelectedUser(u);
                      setShowMailPopup(true);
                    }}
                    className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700"
                  >
                    <Mail size={16} /> Mail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* -------------------------- PAGINATION -------------------------- */}
        <div className="flex justify-center gap-4 mt-4">
          <button
            className="px-3 py-1 border rounded-md"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Prev
          </button>

          <span>
            Page <b>{page}</b> / {totalPages}
          </span>

          <button
            className="px-3 py-1 border rounded-md"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>

      {/* -------------------------- MAIL POPUP -------------------------- */}
      {showMailPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-2">
              Send Email to {selectedUser.name}
            </h2>

            <input
              placeholder="Subject"
              value={mailSubject}
              onChange={(e) => setMailSubject(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            <textarea
              placeholder="Message..."
              value={mailBody}
              onChange={(e) => setMailBody(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg h-28"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowMailPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={sendMail}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {sending ? "Sending..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------- ANNOUNCEMENT POPUP -------------------------- */}
      {showAnnouncementPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">

            <h2 className="text-xl font-semibold mb-3">Send Announcement</h2>

            {/* Title */}
            <input
              placeholder="Title"
              value={announcementTitle}
              onChange={(e) => setAnnouncementTitle(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-3"
            />

            {/* Message */}
            <textarea
              placeholder="Message..."
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg h-28 mb-3"
            />

            {/* Send To */}
            <label className="text-sm font-medium text-gray-600 mb-1 block">
              Send To
            </label>

            <select
              value={announceTarget}
              onChange={(e) => setAnnounceTarget(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg mb-4"
            >
              <option value="All">All Users</option>
              <option value="Admin">All Admins</option>
              <option value="Coach">All Coaches</option>
            </select>

            {/* Buttons */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAnnouncementPopup(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={sendAnnouncement}
                disabled={sendingAnnouncement}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {sendingAnnouncement ? "Sending..." : "Send"}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
