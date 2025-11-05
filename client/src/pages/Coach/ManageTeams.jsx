import React, { useEffect, useMemo, useState } from 'react';
import { Users, Search, Plus, Edit, Trash2, X as Close } from 'lucide-react';
import api from "../../api/axios";

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100 hover:shadow-lg">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        {subtitle && <p className="mt-1 text-xs text-gray-500">{subtitle}</p>}
      </div>
      <div className="rounded-full bg-gray-100 p-3">
        <Icon className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}

function PlayerTableRow({ player, onEdit, onDelete }) {
  return (
    <tr className="border-b bg-white hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-700">
        {player.jerseyNo != null ? `#${player.jerseyNo}` : '-'}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{player.name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{player.position}</td>
      <td className="px-4 py-3 flex gap-2">
        <button onClick={() => onEdit(player)} className="text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-gray-100">
          <Edit className="h-4 w-4" />
        </button>
        <button onClick={() => onDelete(player)} className="text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-100">
          <Trash2 className="h-4 w-4" />
        </button>
      </td>
    </tr>
  );
}

function PlayerModal({ open, onClose, onSubmit, initial, title }) {
  const [form, setForm] = useState({ jersey: '', name: '', position: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm({
        jersey: initial?.jerseyNo ? String(initial.jerseyNo) : '',
        name: initial?.name || '',
        position: initial?.position || ''
      });
      setError('');
    }
  }, [open, initial]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const submit = e => {
    e.preventDefault();
    if (!form.jersey || !form.name || !form.position) {
      setError('All fields are required');
      return;
    }

    onSubmit({
      jersey: Number(form.jersey.replace('#', '')),
      name: form.name.trim(),
      position: form.position.trim()
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-gray-200">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <Close className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          {error && <div className="bg-red-50 border border-red-200 p-2 text-sm text-red-700">{error}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Jersey No*</label>
              <input name="jersey" value={form.jersey} onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm text-gray-600">Name*</label>
              <input name="name" value={form.name} onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Position*</label>
              <input name="position" value={form.position} onChange={handleChange}
                placeholder="Forward / Keeper / etc"
                className="mt-1 w-full border rounded-md p-2.5 focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border bg-white hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ManageTeams() {
  const [players, setPlayers] = useState([]);
  const [teamMeta, setTeamMeta] = useState(null);
  const [query, setQuery] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [sport, setSport] = useState('Basketball');
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/v1/teams/me/by-sport', { params: { sport } });
        setTeamMeta(data.team);
        setPlayers(data.players);
      } catch {
        setTeamMeta(null);
        setPlayers([]);
      }
    }
    load();
  }, [sport]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return players.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.position.toLowerCase().includes(q) ||
      String(p.jerseyNo).includes(q)
    );
  }, [players, query]);

  const handleAddPlayer = async (p) => {
    try {
      const { data } = await api.post('/v1/teams/me/by-sport/players', { sport, player: p });
      setPlayers(prev => [...prev, data.player]);
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const handleEditPlayer = async (p) => {
    try {
      const { data } = await api.patch(`/v1/teams/me/by-sport/players/${editing.jerseyNo}`, { sport, player: p });
      setPlayers(prev => prev.map(x => x.jerseyNo === editing.jerseyNo ? data.player : x));
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  const handleDeletePlayer = async (player) => {
    if (!window.confirm(`Remove ${player.name} (#${player.jerseyNo})?`)) return;
    try {
      await api.delete(`/v1/teams/me/by-sport/players/${player.jerseyNo}`, { params: { sport } });
      setPlayers(prev => prev.filter(p => p.jerseyNo !== player.jerseyNo));
    } catch (e) { alert(e.response?.data?.message || e.message); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-4 md:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Manage Team</h1>
        <p className="text-md text-gray-500">{teamMeta?.name || '---'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Players" value={String(players.length)} subtitle={sport} icon={Users} />
      </div>

      <section className="mt-6 bg-white p-6 rounded-lg shadow-sm border border-white/60">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Team Roster</h2>
            <p className="text-sm text-gray-500">{sport}</p>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            <select value={sport} onChange={e => setSport(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white w-full md:w-auto">
              <option>Basketball</option>
              <option>Football</option>
              <option>Volleyball</option>
              <option>Cricket</option>
            </select>
            <button onClick={() => setAddOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-1.5">
              <Plus className="h-4 w-4" /> Add Player
            </button>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search players..."
            className="w-full p-2.5 pl-10 border border-blue-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500" />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr className="[&>*]:px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th>Jersey</th><th>Name</th><th>Position</th><th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map(p => (
                <PlayerTableRow key={p.jerseyNo} player={p} onEdit={() => { setEditOpen(true); setEditing(p); }} onDelete={handleDeletePlayer} />
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">No players found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <PlayerModal open={addOpen} onClose={() => setAddOpen(false)} onSubmit={handleAddPlayer} title="Add Player" />
      <PlayerModal open={editOpen} onClose={() => setEditOpen(false)} onSubmit={handleEditPlayer} initial={editing} title="Edit Player" />
    </div>
  );
}
