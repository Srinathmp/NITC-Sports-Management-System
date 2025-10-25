import '../index.css'
import { Crown, Medal, Star } from 'lucide-react';

const rankStyles = {
    1: {
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        iconColor: 'text-[#f3ef25ff]',
        icon: <Crown size={32} />,
        order: 'sm:order-2 order-1 md:scale-105'
    },
    2: {
        bgColor: 'bg-slate-100',
        borderColor: 'border-slate-200',
        iconColor: 'text-slate-500',
        icon: <Medal size={32} />,
        order: 'sm:order-1 order-2'
    },
    3: {
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-[#cc6600ff]',
        icon: <Star size={32} />,
        order: 'order-3'
    },
};

function StatCard({ Icon, Stat, Name }) {
    return (
        <div className="transition-all rounded-xl border border-white/20 bg-white/10 px-8 py-6 text-center backdrop-blur-md hover:scale-105 hover:bg-white/15 lg:px-18">
            <Icon className="mx-auto mb-3 h-7 w-7 text-white sm:h-8 sm:w-8" />
            <div className="mb-1 text-3xl font-bold sm:text-4xl">{Stat}</div>
            <div className="text-xs font-medium text-white/80">{Name}</div>
        </div>
    )
}

function LiveCard({ game_name, T1, T2, S1, S2, X }) {
    return (
        <div className='mt-6 rounded-2xl border border-red-300 bg-pink-50 p-3 shadow-md transition-all hover:scale-[1.03] hover:shadow-xl sm:p-4'>
            <div className="flex items-center justify-between pb-2 md:pb-3">
                <h2 className="flex items-center gap-3 font-bold">
                    <div className="animate-pulse rounded-full bg-red-400 px-2 py-0.5 text-center text-xs text-white">🔴 LIVE</div>
                </h2>
                <h2 className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-center text-xs font-semibold text-black">
                    {game_name}
                </h2>
            </div>
            <div className='grid grid-cols-3 items-center gap-2 sm:gap-4'>
                <div className='text-right text-base font-semibold text-slate-900 sm:text-lg md:text-xl'>{T1}</div>
                <div className='flex flex-col'>
                    <div className='text-center text-xl font-bold text-slate-900 sm:text-2xl'>{S1}-{S2}</div>
                    <div className='text-center text-sm text-slate-700'>{X}</div>
                </div>
                <div className='text-left text-base font-semibold text-slate-900 sm:text-lg md:text-xl'>{T2}</div>
            </div>
        </div>
    )
}

function UpcomingCard({ game, date, teams }) {
    return (
        <div className="mt-4 rounded-lg border-2 border-white/30 bg-white/60 p-4 hover:shadow-xl">
            <div className="flex items-center justify-between">
                <div className="text-left">
                    <p className="font-semibold text-black">{game}</p>
                    <p className="text-sm text-black">{date}</p>
                </div>
                <span className="rounded-full bg-orange-500 px-3 py-1 text-xs font-bold text-white">
                    {teams}
                </span>
            </div>
        </div>
    )
}

function PerformerCard({ rank, name, points, medals }) {
    const styles = rankStyles[rank];

    return (
        <div className={`flex flex-col items-center justify-center space-y-2 rounded-xl border-2 px-6 py-4 text-center shadow-sm transition-all hover:shadow-2xl ${styles.bgColor} ${styles.borderColor} ${styles.order}`} >
            <div className={styles.iconColor}>{styles.icon}</div>
            <h3 className="text-base font-semibold text-slate-800 sm:text-lg">{name}</h3>
            <p className="text-2xl font-bold text-blue-600 sm:text-3xl">{points} pts</p>
            <p className="text-sm text-slate-500 font-semibold">{medals} medals</p>
        </div>
    );
}

export { LiveCard, StatCard, UpcomingCard, PerformerCard };