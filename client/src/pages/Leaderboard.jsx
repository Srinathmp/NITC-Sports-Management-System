import { Award, Medal, Crown, Star, Check, ChevronDown, Trophy } from "lucide-react";
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
};

function Leaderboard() {
    const [isOpen, setIsOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(3);
    const [selectedSport, setSelectedSport] = useState(0);
    const [sports, setSports] = useState(["Overall Rankings", "Basketball", "Football"]);
    const items = [{ name: "NIT", gold: 0, silver: 0, bronze: 0, points: 0, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }, { name: "NIT D", gold: 1, silver: 1, bronze: 1, points: 3, total: 0 }]
    const toggleMenu = (index) => {
        setIsOpen(false);
        setSelectedSport(index);
    }
    const handleNextPage = () => { setCurrentPage(currentPage + 1) }
    const handlePrevPage = () => { setCurrentPage(currentPage - 1) }

    return (
        <div className="w-full pt-5 flex flex-col gap-8 container mx-auto">
            <div>
                <h1 className="text-4xl font-bold">Leaderboard & Rankings</h1>
                <p className="text-[#000000a1]">Overall performance across all sports</p>
            </div>
            <div className="flex justify-between sm:flex-row flex-col gap-8 text-sm">
                <div className="w-full sm:w-60 relative [&_button]:p-2 [&_button]:rounded-lg [&>button]:border [&>button]:border-[#00000039] bg-white">
                    <button className="cursor-pointer flex items-center justify-between gap-4 w-full" onClick={() => setIsOpen(!isOpen)}>
                        <Trophy className="h-5 w-5" />
                        {sports[selectedSport]}
                        <ChevronDown />
                    </button>
                    <div className={`${isOpen ? '' : 'hidden'} z-20 absolute flex flex-col bg-white w-full mt-2 rounded-lg border border-[#00000039] transition-y duration-300 ease-in-out p-1`}>
                        {
                            sports.map((sport, index) => {
                                return <button className="flex items-center gap-4 hover:bg-[#cacaca98]" onClick={() => { toggleMenu(index) }}>{<Check className={`h-5 w-4 ${index == selectedSport ? '' : 'opacity-0'}`} />}{sport}</button>
                            })
                        }
                    </div>
                </div>
            </div>
            <div className="bg-white rounded-xl flex flex-col items-center justify-center px-6 py-8 border border-[#9c9c9c5e]">
                <p className="text-2xl font-semibold">🏆 Top Performers 🏆</p>
                <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3 w-full mt-10">
                    <PerformerCard rank={1} points={10} medals={16} name="NIT Calicut" />
                    <PerformerCard rank={2} points={120} medals={16} name="NIT Calicut" />
                    <PerformerCard rank={3} points={120} medals={16} name="NIT Calicut" />
                </div>
            </div>
            <div className="bg-white rounded-xl flex flex-col px-4 py-8 border border-[#9c9c9c5e] gap-6">
                <h1 className="text-2xl font-semibold">Complete Rankings</h1>
                <div className="flex flex-col gap-2">
                    {
                        items.map((institue, index) => {
                            if ((currentPage - 1) * 10 <= index && index < (currentPage) * 10) {
                                return (
                                    <div className="flex justify-between border border-[#9c9c9c5e] p-2 md:p-4 rounded-lg hover:shadow-lg">
                                        <div className="flex items-center gap-4">
                                            <h1 className="text-2xl font-bold text-[#767676ff]">#{index + 1}</h1>
                                            <div>
                                                <p className="font-semibold text-lg md:text-xl">{institue.name}</p>
                                                <p className="text-sm text-[#767676ff] font-semibold">Total Medals:{institue.total}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-6 text-center flex-col lg:flex-row">
                                            <div className="font-semibold flex gap-2 md:gap-4"><p>🥇{institue.gold}</p> <p>🥈{institue.silver}</p> <p>🥉{institue.bronze}</p></div>
                                            <div className="text-right flex gap-4 md:flex-col md:gap-0">
                                                <p className="font-semibold text-xl">{institue.points}</p>
                                                <p className="text-xl md:text-sm text-[#767676ff] font-semibold">points</p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        })
                    }
                </div>
                <div className="flex items-center justify-between md:px-30 [&_button]:border [&_button]:border-[#949494ff] [&_button]:p-2 [&_button]:rounded-xl [&_button]:cursor-pointer [&_button]:hover:bg-blue-400 [&_button]:hover:text-white">
                    <button onClick={handlePrevPage} disabled={currentPage === 1}> Previous </button>
                    Page {currentPage} of {totalPage}
                    <button onClick={handleNextPage} disabled={currentPage === totalPage}> Next </button>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4">
                <StatCard
                    title="Participating NITs"
                    stat={10}
                    subtitle="Competing institutions"
                    Icon={Award}
                />
                <StatCard
                    title="Total Medals"
                    stat={136}
                    subtitle="Awarded so far"
                    Icon={Medal}
                />
                <StatCard
                    title="Highest Score"
                    stat={145}
                    subtitle="Points by NIT Trichy"
                    Icon={Crown}
                />
                <StatCard
                    title="Most Gold"
                    stat={8}
                    subtitle="Gold medals"
                    Icon={Star}
                />
            </div>
        </div>
    )
}

export { Leaderboard };