// client/src/pages/Leaderboard.jsx
import { Award, Crown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";

function StatCard({ title, stat, subtitle, Icon }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-6 hover:shadow-xl border border-[#9c9c9c5e]">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-semibold text-gray-900">{stat}</p>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="rounded-lg bg-gray-100 p-3">
        <Icon className="h-6 w-6 text-gray-600" />
      </div>
    </div>
  );
}

function PerformerCard({ rank, name, points }) {
  return (
    <div className="rounded-xl border border-gray-200 p-4 text-center bg-white">
      <div className="text-3xl font-bold">#{rank}</div>
      <div className="mt-1 text-lg font-semibold">{name}</div>
      <div className="text-sm text-gray-600">{points} pts</div>
    </div>
  );
}

export default function Leaderboard() {
  const [top, setTop] = useState([]);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalInstitutes, setTotalInstitutes] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  async function load(page = 1) {
    const { data } = await api.get('/v1/leaderboard', { params: { page, limit: 10 } });
    setTop(data.topPerformers || []);
    setRows(data.rankings || []);
    setTotalInstitutes(data.totalInstitutes || 0);
    setTotalPage(data.totalPages || 1);
    setHighestScore(data.highestScore || 0);
    setCurrentPage(page);
  }

  useEffect(() => { load(1); }, []);

  const handleNextPage = () => currentPage < totalPage && load(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && load(currentPage - 1);

  return (
    <div className="w-full p-8 flex flex-col gap-8 px-4 md:px-8">
      <div>
        <h1 className="text-4xl font-bold">Leaderboard & Rankings</h1>
        <p className="text-[#000000a1]">Overall performance (points only)</p>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl flex flex-col items-center justify-center px-6 py-8 border border-[#9c9c9c5e] shadow-lg">
        <p className="text-2xl font-semibold">🏆 Top Performers 🏆</p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full mt-10">
          {top.map((t, i) => (
            <PerformerCard key={t.nit_id || i} rank={i + 1} name={t.name} points={t.points} />
          ))}
          {!top?.length && <div className="text-gray-500 text-sm">No data yet.</div>}
        </div>
      </div>

      {/* Complete Rankings */}
      <div className="bg-white rounded-xl flex flex-col px-4 py-8 border border-[#9c9c9c5e] gap-6 z-10">
        <div className="flex items-center gap-4">
          <TrendingUp />
          <h1 className="text-2xl font-semibold">Complete Rankings</h1>
        </div>

        <div className="flex flex-col gap-2">
          {rows.map((row) => (
            <div
              key={`${row.rank}-${row.nit_id || row.name}`}
              className="flex justify-between items-center border border-gray-300 p-3 rounded-xl hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-[#767676ff]">#{row.rank}</h1>
                <p className="font-semibold text-lg md:text-xl">{row.name}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-xl">{row.points}</p>
                <p className="text-sm text-[#767676ff] font-semibold">points</p>
              </div>
            </div>
          ))}
          {!rows?.length && <div className="text-gray-500 text-sm">No rankings yet.</div>}
        </div>

        <div className="flex items-center justify-between md:px-30 [&_button]:border [&_button]:border-[#7b7b7b5a] [&_button]:p-2 [&_button]:rounded-xl [&_button]:cursor-pointer [&_button]:hover:bg-blue-400 [&_button]:hover:text-white [&_button]:w-20">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
          Page {currentPage} of {totalPage}
          <button onClick={handleNextPage} disabled={currentPage === totalPage}>Next</button>
        </div>
      </div>

      {/* Summary Cards (no medals) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
        <StatCard
          title="Participating NITs"
          stat={totalInstitutes}
          subtitle="Listed in leaderboard"
          Icon={Award}
        />
        <StatCard
          title="Highest Score"
          stat={highestScore}
          subtitle="Top NIT points"
          Icon={Crown}
        />
      </div>
    </div>
  );
}
