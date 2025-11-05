import { Calendar, Check, ChevronDown, Trophy, Users, Eye, Clock, MapPin } from "lucide-react";
import { useState } from "react";

function StatCard({ title, stat, subtitle, Item }) {
    return (
        <div className="flex items-center justify-between rounded-xl bg-white p-6 hover:shadow-xl border border-[#9c9c9c5e]">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{stat}</p>
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-3">
                <Item className="h-6 w-6 text-gray-600" />
            </div>
        </div>
    );
};

function MatchCard({ team1Name, team1Score, team2Name, team2Score, stage, sport, date, time, venue }) {
    let badgeClasses = '';
    // switch (status.toLowerCase()) {
    //     case 'live':
    //         badgeClasses = 'bg-red-100 text-red-800';
    //         break;
    //     case 'starting soon':
    //         badgeClasses = 'bg-orange-100 text-orange-800';
    //         break;
    //     case 'completed':
    //         badgeClasses = 'bg-blue-100 text-blue-800';
    //         break;
    //     default:
    //         badgeClasses = 'bg-gray-100 text-gray-800';
    // }

    const scoreDisplay = team1Score && team2Score ? `${team1Score} - ${team2Score}` : 'vs';

    return (
        <div className="relative rounded-xl border border-[#b8b8b8ab] bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="top-4 left-4 font-medium flex justify-between">
                {/* <div className={`rounded-full px-2.5 py-0.5 text-xs items-center flex ${badgeClasses}`}>
                    {status.toLowerCase() === 'live' && (
                        <span className="relative mr-1.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                    )}
                    {status}
                </div> */}
                <div className="hidden text-right text-sm rounded-xl bg-blue-200 px-2 py-0.5 font-medium text-gray-700 sm:block">{stage}</div>
            </div>

            <div className="flex flex-col items-center justify-between pt-10 sm:flex-row sm:pt-4 px-4">
                <div className="flex w-full items-center justify-around gap-4 text-center sm:w-auto sm:justify-start lg:gap-8">
                    <span className="w-1/3 font-semibold text-[#535353ec] sm:w-auto sm:text-right">{team1Name}</span>
                    <span className="text-xl font-bold text-gray-900">{scoreDisplay}</span>
                    <span className="w-1/3 font-semibold text-[#535353ec] sm:w-auto sm:text-left">{team2Name}</span>
                </div>
                <div className="mt-4 flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t pt-4 text-sm text-gray-500 font-semibold sm:mt-0 sm:w-auto sm:flex-nowrap sm:justify-end sm:border-t-0 sm:pt-0">
                    <span>{sport}</span>
                    <span className="flex items-center"><Calendar size={12} className="mr-1" /> {date}</span>
                    <span className="flex items-center"><Clock size={12} className="mr-1" /> {time}</span>
                    <span className="flex items-center"><MapPin size={12} className="mr-1" /> {venue}</span>
                </div>
            </div>
        </div>
    );
};

// const LiveMatchCard = ({ stage, score1, score2, team1, team2, sport, venue }) => {
//     return (
//         <div className="w-full max-w-lg">
//             <h2 className="mb-2 flex items-center text-lg font-semibold text-red-600">
//                 <span className="relative mr-2 flex h-3 w-3">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
//                     <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
//                 </span>
//                 Live Matches
//             </h2>
//             <div className="rounded-lg border border-red-200 bg-red-50 p-6 shadow-sm">
//                 <div className="mb-4 flex items-start justify-between">
//                     <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
//                         LIVE
//                     </span>
//                     <span className="text-sm font-medium text-red-700">{stage}</span>
//                 </div>
//                 <div className="text-center">
//                     <p className="text-3xl font-bold text-gray-900">{`${score1}-${score2}`}</p>
//                     <p className="mt-2 text-lg font-semibold text-gray-800">{team1}</p>
//                     <p className="my-1 text-lg text-gray-500">vs</p>
//                     <p className="text-lg font-semibold text-gray-800">{team2}</p>
//                 </div>
//                 <div className="mt-4 flex items-center justify-center gap-4 text-sm text-gray-500">
//                     <span className="flex items-center">
//                         <Trophy size={14} className="mr-1" /> {sport}
//                     </span>
//                     <span className="flex items-center">
//                         <MapPin size={14} className="mr-1" /> {venue}
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// };

function Matches() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSport, setSelectedSport] = useState(0);
    const [sports, setSports] = useState(["Overall Rankings", "Basketball", "Football"]);
    const toggleMenu = (index) => {
        setIsOpen(false);
        setSelectedSport(index);
    }
    const matchesData = [
        {
            id: 1,
            status: 'LIVE',
            team1Name: 'NIT Trichy Warriors', team1Score: '45',
            team2Name: 'NIT Warangal Eagles', team2Score: '38',
            stage: 'Semi-Final', sport: 'Basketball', date: '2024-02-15', time: '10:00 AM', venue: 'Main Court',
        },
        {
            id: 2,
            status: 'Starting Soon',
            team1Name: 'NIT Surathkal Sharks',
            team2Name: 'NIT Calicut Tigers',
            stage: 'Quarter-Final', sport: 'Football', date: '2024-02-15', time: '2:00 PM', venue: 'Football Ground',
        },
        {
            id: 3,
            status: 'Completed',
            team1Name: 'NIT Rourkela Lions', team1Score: '178/7',
            team2Name: 'NIT Durgapur Knights', team2Score: '165/9',
            stage: 'Group Stage', sport: 'Cricket', date: '2024-02-14', time: '9:00 AM', venue: 'Cricket Field',
        },
    ];

    return (
        <div className="space-y-6 w-full p-8 pt-5 px-4 md:px-8">
            <div className="pt-5 flex flex-col gap-8 min-h-screen">
                <div>
                    <h1 className="text-4xl font-bold">Matches</h1>
                    <p className="text-[#000000a1]">View live scores and upcoming fixtures</p>
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
                {/* <div>
                    <LiveMatchCard
                        stage="Semi-Final"
                        score1={45}
                        score2={38}
                        team1="NIT Trichy Warriors"
                        team2="NIT Warangal Eagles"
                        sport="Basketball"
                        venue="Main Court"
                    />
                </div> */}
                <div className="w-full">
                    <h2 className="mb-4 text-2xl font-bold text-gray-800">All Matches</h2>
                    <div className="space-y-4">
                        {matchesData.map((match) => (
                            <MatchCard
                                key={match.id}
                                // status={match.status}
                                team1Name={match.team1Name}
                                team1Score={match.team1Score}
                                team2Name={match.team2Name}
                                team2Score={match.team2Score}
                                stage={match.stage}
                                sport={match.sport}
                                date={match.date}
                                time={match.time}
                                venue={match.venue}
                            />
                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 py-4">
                    <StatCard
                        title="Total Teams"
                        stat={10}
                        subtitle="Competing institutions"
                        Item={Calendar}
                    />
                    <StatCard
                        title="Active Teams"
                        stat={136}
                        subtitle="Currently Competing"
                        Item={Users}
                    />
                    <StatCard
                        title="Total Players"
                        stat={145}
                        subtitle="Across all teams"
                        Item={Clock}
                    />
                    <StatCard
                        title="Sports Categories"
                        stat={8}
                        subtitle="Different sports"
                        Item={Trophy}
                    />
                </div>
            </div>
        </div>
    )
}

export default Matches;