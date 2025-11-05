import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Users, Search, Plus, Edit, Trash2, X as Close } from 'lucide-react';
import api from "../../api/axios";

function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
        {subtitle ? <p className="mt-1 text-xs text-gray-500">{subtitle}</p> : null}
      </div>
      <div className="rounded-full bg-gray-100 p-3">
        <Icon className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}

function PlayerTableRow({ player, onEdit, onDelete }) {
  const { jerseyNo, name, position } = player;
  return (
    <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
      <td className="px-4 py-3 text-sm font-medium text-gray-700">
        {jerseyNo != null ? `#${jerseyNo}` : '-'}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">{name}</td>
      <td className="px-4 py-3 text-sm text-gray-500">{position}</td>
      <td className="px-4 py-3">
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(player)}
            className="text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-gray-100"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(player)}
            className="text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-100"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function PlayerModal({ open, onClose, onSubmit, initial, title = "Add Player" }) {
  const [form, setForm] = useState({ jersey: '', name: '', position: '' });
  const [error, setError] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    if (open) {
      setForm({
        jersey: initial?.jerseyNo != null ? String(initial.jerseyNo) : '',
        name: initial?.name || '',
        position: initial?.position || ''
      });
      setError('');
    }
  }, [open, initial]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [open, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.jersey || !form.name || !form.position) {
      setError('Please fill all required fields.');
      return;
    }
    onSubmit({
      jersey: form.jersey, // parent converts to Number
      name: form.name.trim(),
      position: form.position.trim(),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div ref={containerRef} className="relative z-10 w-full max-w-lg rounded-xl bg-white shadow-xl border border-gray-200">
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <Close className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          {error && <div className="rounded-md bg-red-50 border border-red-200 p-2 text-sm text-red-700">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-600">Jersey No.*</label>
              <input
                name="jersey"
                value={form.jersey}
                onChange={handleChange}
                placeholder="#10 or 10"
                className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Name*</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm text-gray-600">Position*</label>
              <input
                name="position"
                value={form.position}
                onChange={handleChange}
                placeholder="Forward / Guard / Center"
                className="mt-1 w-full rounded-md border border-gray-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
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
  const [editing, setEditing] = useState(null); // { id, name, position, jerseyNo }

  // fetch team & players for the logged-in coach whenever sport changes
  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/v1/teams/me/by-sport', {
          params: { sport },
          headers: { 'x-user-role': 'COACH', 'x-user-id': '000000000000000000000001' } // remove when JWT interceptor is ready
        });
        setTeamMeta(data.team || null);
        const uiPlayers = (data.players || []).map(p => ({
          id: p.id,
          name: p.name,
          position: p.position || '',
          jerseyNo: p.jerseyNo ?? null
        }));
        setPlayers(uiPlayers);
      } catch (e) {
        console.error(e);
        setTeamMeta(null);
        setPlayers([]);
      }
    }
    load();
  }, [sport]);

  const stats = useMemo(() => ({ total: players.length }), [players]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter(p =>
      (p.name || '').toLowerCase().includes(q) ||
      (p.position || '').toLowerCase().includes(q) ||
      String(p.jerseyNo ?? '').toLowerCase().includes(q)
    );
  }, [players, query]);

  // ADD
  const handleAddPlayer = async (fromModal) => {
    const jerseyNo = Number(String(fromModal.jersey).replace(/^#/, ''));
    if (!Number.isFinite(jerseyNo)) return alert('Invalid jersey number');

    try {
      const payload = { sport, player: { name: fromModal.name, position: fromModal.position, jerseyNo } };
      const { data } = await api.post('/v1/teams/me/by-sport/players', payload, {
        headers: { 'x-user-role': 'COACH', 'x-user-id': '000000000000000000000001' }
      });
      const p = data.player;
      setPlayers(prev => [...prev, { id: p.id, name: p.name, position: p.position || '', jerseyNo: p.jerseyNo ?? null }]);
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  // EDIT
  const openEdit = (player) => {
    setEditing(player);   // {id, name, position, jerseyNo}
    setEditOpen(true);
  };

  const handleEditPlayer = async (fromModal) => {
    if (!editing) return;
    const oldJerseyNo = editing.jerseyNo;
    const newJerseyNo = Number(String(fromModal.jersey).replace(/^#/, ''));
    if (!Number.isFinite(newJerseyNo)) return alert('Invalid jersey number');

    try {
      const payload = { sport, player: { name: fromModal.name, position: fromModal.position, jerseyNo: newJerseyNo } };
      const { data } = await api.patch(`/v1/teams/me/by-sport/players/${oldJerseyNo}`, payload, {
        headers: { 'x-user-role': 'COACH', 'x-user-id': '000000000000000000000001' }
      });
      const p = data.player;
      setPlayers(prev =>
        prev.map(x => Number(x.jerseyNo) === Number(oldJerseyNo)
          ? { id: p.id, name: p.name, position: p.position || '', jerseyNo: p.jerseyNo ?? null }
          : x
        )
      );
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setEditing(null);
    }
  };

  // DELETE
  const handleDeletePlayer = async (player) => {
    if (!window.confirm(`Remove ${player.name} (#${player.jerseyNo}) from roster?`)) return;
    try {
      await api.delete(`/v1/teams/me/by-sport/players/${player.jerseyNo}`, {
        params: { sport },
        headers: { 'x-user-role': 'COACH', 'x-user-id': '000000000000000000000001' }
      });
      setPlayers(prev => prev.filter(p => Number(p.jerseyNo) !== Number(player.jerseyNo)));
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 px-4 md:px-8">
      <div className="mb-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900">Manage Team</h1>
        <p className="text-md text-gray-500">{teamMeta?.name || '—'}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Players" value={String(stats.total)} subtitle={teamMeta?.sport || sport} icon={Users} />
      </div>

      <section className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="md:w-auto w-full">
            <h2 className="text-xl font-semibold text-gray-800">Team Roster</h2>
            <p className="text-sm text-gray-500">Manage your team players</p>
          </div>

          <div className="flex justify-between gap-4 w-full md:w-auto">
            <select
              className="md:flex-none w-full md:w-auto border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              value={sport}
              onChange={(e) => setSport(e.target.value)}
            >
              <option>Basketball</option>
              <option>Football</option>
              <option>Volleyball</option>
              <option>Cricket</option>
            </select>

            <button
              onClick={() => setAddOpen(true)}
              className="md:flex-none flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              Add Player
            </button>
          </div>
        </div>

        <div className="relative mt-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name, jersey, or position..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full p-2.5 pl-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="divide-y divide-gray-200 w-full">
            <thead className="bg-gray-50">
              <tr className='[&>*]:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                <th scope="col">Jersey</th>
                <th scope="col">Name</th>
                <th scope="col">Position</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((player) => (
                <PlayerTableRow
                  key={player.id ?? player.jerseyNo}
                  player={player}
                  onEdit={openEdit}
                  onDelete={handleDeletePlayer}
                />
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500">No players found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Add Modal */}
      <PlayerModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAddPlayer}
        title="Add Player"
      />

      {/* Edit Modal */}
      <PlayerModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSubmit={handleEditPlayer}
        initial={editing}
        title="Edit Player"
      />
    </div>
  );
}
