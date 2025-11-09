// client/src/pages/Leaderboard.jsx
import { Award, Crown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { PerformerCard } from "../components/Card";
import FullPageLoader from "../components/FullPageLoader";

function StatCard({ title, stat, subtitle, Icon }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-gradient-to-br from-white to-blue-50 p-6 shadow-md hover:shadow-lg transition-all border border-blue-100">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="mt-1 text-3xl font-bold text-gray-900">{stat}</p>
        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
      </div>
      <div className="rounded-xl bg-blue-100 p-3">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [top, setTop] = useState([]);
  const [rows, setRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [totalInstitutes, setTotalInstitutes] = useState(0);
  const [highestScore, setHighestScore] = useState(0);

  async function load(page = 1) {
    const { data } = await api.get("/v1/leaderboard", { params: { page, limit: 10 } });
    setTop(data.topPerformers || []);
    setRows(data.rankings || []);
    setTotalInstitutes(data.totalInstitutes || 0);
    setTotalPage(data.totalPages || 1);
    setHighestScore(data.highestScore || 0);
    setCurrentPage(page);
    setIsLoading(false);
  }

  useEffect(() => {
    load(1);
  }, []);

  if (isLoading) return <FullPageLoader />;

  const handleNextPage = () => currentPage < totalPage && load(currentPage + 1);
  const handlePrevPage = () => currentPage > 1 && load(currentPage - 1);

  return (
    <div className="w-full p-6 md:p-10 flex flex-col gap-10 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Leaderboard & Rankings</h1>
        <p className="text-gray-500 mt-1">Tracking excellence across all NITs</p>
      </div>

      {/* 🏆 Top Performers */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg px-6 py-10 flex flex-col items-center text-center">
        <h2 className="text-2xl font-semibold text-blue-700 mb-6">🏅 Top Performers 🏅</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mt-4">
          {top.map((t, i) => (
            <PerformerCard key={t.nit_id || i} rank={i + 1} points={t.points} name={t.name} />
          ))}
          {!top?.length && (
            <div className="text-gray-500 text-sm col-span-full py-4">No performance data available yet.</div>
          )}
        </div>
      </div>

      {/* 📊 Complete Rankings */}
      <div className="bg-white rounded-2xl border border-blue-100 shadow-lg px-6 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-2 rounded-lg">
            <TrendingUp className="h-6 w-6 text-blue-700" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">Complete Rankings</h2>
        </div>

        <div className="flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={`${row.rank}-${row.nit_id || row.name}`}
              className="flex justify-between items-center bg-gradient-to-r from-white to-blue-50 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-extrabold text-blue-600">#{row.rank}</span>
                <p className="font-semibold text-lg md:text-xl text-gray-900">{row.name}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-xl text-gray-800">{row.points}</p>
                <p className="text-sm text-gray-500 font-medium">points</p>
              </div>
            </div>
          ))}
          {!rows?.length && (
            <div className="text-gray-500 text-sm text-center py-6">No rankings found.</div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-8 text-sm font-medium">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg transition-all border ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700">
            Page <b>{currentPage}</b> of <b>{totalPage}</b>
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
            className={`px-4 py-2 rounded-lg transition-all border ${
              currentPage === totalPage
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-500"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* 📈 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-4">
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
