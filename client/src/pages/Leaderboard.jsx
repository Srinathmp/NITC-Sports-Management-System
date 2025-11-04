import { Award, Crown, Check, ChevronDown, Trophy, TrendingUp } from "lucide-react";
import { useState } from "react";
import { PerformerCard } from "../components/Card";

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

function Leaderboard() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(3);
  const [selectedSport, setSelectedSport] = useState(0);
  const [sports, setSports] = useState(["Overall Rankings", "Basketball", "Football"]);

  // Now each item only tracks name and points
  const items = [
    { name: "NIT Trichy", points: 145 },
    { name: "NIT Warangal", points: 120 },
    { name: "NIT Calicut", points: 118 },
    { name: "NIT Surathkal", points: 102 },
    { name: "NIT Durgapur", points: 98 },
    { name: "NIT Jalandhar", points: 87 },
    { name: "NIT Bhopal", points: 76 },
    { name: "NIT Rourkela", points: 70 },
    { name: "NIT Silchar", points: 65 },
    { name: "NIT Patna", points: 58 },
  ];

  const toggleMenu = (index) => {
    setIsOpen(false);
    setSelectedSport(index);
  };

  const handleNextPage = () => setCurrentPage(currentPage + 1);
  const handlePrevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div className="w-full p-8 flex flex-col gap-8 px-4 md:px-8">
      <div>
        <h1 className="text-4xl font-bold">Leaderboard & Rankings</h1>
        <p className="text-[#000000a1]">Overall performance across all sports</p>
      </div>

      {/* Dropdown for sport selection */}
      <div className="flex justify-between sm:flex-row flex-col gap-8 text-sm">
        <div className="w-full sm:w-60 relative [&_button]:p-2 [&_button]:rounded-lg [&>button]:border [&>button]:border-[#00000039] bg-white">
          <button
            className="cursor-pointer flex items-center justify-between gap-4 w-full"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Trophy className="h-5 w-5" />
            {sports[selectedSport]}
            <ChevronDown />
          </button>
          <div
            className={`${
              isOpen ? "" : "hidden"
            } z-20 absolute flex flex-col bg-white w-full mt-2 rounded-lg border border-[#00000039] transition-y duration-300 ease-in-out p-1`}
          >
            {sports.map((sport, index) => (
              <button
                key={index}
                className="flex items-center gap-4 hover:bg-[#cacaca98]"
                onClick={() => toggleMenu(index)}
              >
                <Check
                  className={`h-5 w-4 ${
                    index === selectedSport ? "" : "opacity-0"
                  }`}
                />
                {sport}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-xl flex flex-col items-center justify-center px-6 py-8 border border-[#9c9c9c5e] shadow-lg">
        <p className="text-2xl font-semibold">🏆 Top Performers 🏆</p>
        <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full mt-10">
          <PerformerCard rank={1} points={145} name="NIT Trichy" />
          <PerformerCard rank={2} points={120} name="NIT Warangal" />
          <PerformerCard rank={3} points={118} name="NIT Calicut" />
        </div>
      </div>

      {/* Complete Rankings */}
      <div className="bg-white rounded-xl flex flex-col px-4 py-8 border border-[#9c9c9c5e] gap-6 z-10">
        <div className="flex items-center gap-4">
          <TrendingUp />
          <h1 className="text-2xl font-semibold">Complete Rankings</h1>
        </div>

        <div className="flex flex-col gap-2">
          {items.map((institute, index) => {
            if (
              (currentPage - 1) * 10 <= index &&
              index < currentPage * 10
            ) {
              return (
                <div
                  key={index}
                  className="flex justify-between items-center border border-gray-300 p-3 rounded-xl hover:shadow-lg"
                >
                  <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold text-[#767676ff]">
                      #{index + 1}
                    </h1>
                    <p className="font-semibold text-lg md:text-xl">
                      {institute.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-xl">{institute.points}</p>
                    <p className="text-sm text-[#767676ff] font-semibold">
                      points
                    </p>
                  </div>
                </div>
              );
            }
          })}
        </div>

        <div className="flex items-center justify-between md:px-30 [&_button]:border [&_button]:border-[#7b7b7b5a] [&_button]:p-2 [&_button]:rounded-xl [&_button]:cursor-pointer [&_button]:hover:bg-blue-400 [&_button]:hover:text-white [&_button]:w-20">
          <button onClick={handlePrevPage} disabled={currentPage === 1}>
            Previous
          </button>
          Page {currentPage} of {totalPage}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPage}
          >
            Next
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 py-4">
        <StatCard
          title="Participating NITs"
          stat={10}
          subtitle="Competing institutions"
          Icon={Award}
        />
        <StatCard
          title="Highest Score"
          stat={145}
          subtitle="Points by NIT Trichy"
          Icon={Crown}
        />
      </div>
    </div>
  );
}

export default Leaderboard;
