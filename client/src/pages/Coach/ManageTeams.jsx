import React from 'react';
import { 
    Users, Search, ChevronDown, Plus, Edit, Trash2 
} from 'lucide-react';

function StatCard({ title, value, subtitle, icon: Icon }) {
    return (
        <div className="flex items-center justify-between rounded-lg bg-white p-4 shadow-sm border border-gray-100 transition-shadow duration-200 hover:shadow-lg">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
                <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
            </div>
            <div className="rounded-full bg-gray-100 p-3">
                <Icon className="h-6 w-6 text-gray-600" />
            </div>
        </div>
    );
}

function PlayerTableRow({ player }) {
    const { jersey, name, age, email, phone } = player;

    const statusColors = {
        Active: 'bg-blue-100 text-blue-700',
        Injured: 'bg-red-100 text-red-700',
    };
    
    return (
        <tr className="border-b border-gray-200 bg-white hover:bg-gray-50">
            <td className="px-4 py-3 text-sm font-medium text-gray-700">{jersey}</td>
            <td className="px-4 py-3 text-sm font-semibold text-gray-900">{name}</td>
            <td className="px-4 py-3 text-sm text-gray-500">{age}</td>
            <td className="px-4 py-3 text-sm text-gray-500">
                <div>{email}</div>
                <div className="text-xs text-gray-400">{phone}</div>
            </td>
            <td className="px-4 py-3">
                <div className="flex gap-2">
                    <button className="text-gray-500 hover:text-blue-600 p-1.5 rounded-md hover:bg-gray-100">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-gray-500 hover:text-red-600 p-1.5 rounded-md hover:bg-gray-100">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </td>
        </tr>
    );
}

export default function ManageTeams() {

    const statCardsData = [
        { title: 'Total Players', value: '5', subtitle: 'In roster', icon: Users },
        { title: 'Active Players', value: '4', subtitle: 'Available', icon: Users },
        { title: 'Injured', value: '1', subtitle: 'Recovering', icon: Users },
        { title: 'Average Age', value: '21.6', subtitle: 'Years', icon: Users },
    ];

    const playersData = [
        { jersey: '#10', name: 'John Doe', position: 'Forward', age: 21, email: 'john@example.com', phone: '9876543210', status: 'Active' },
        { jersey: '#7', name: 'Mike Smith', position: 'Guard', age: 22, email: 'mike@example.com', phone: '9876543211', status: 'Active' },
        { jersey: '#15', name: 'David Brown', position: 'Center', age: 23, email: 'david@example.com', phone: '9876543212', status: 'Injured' },
        { jersey: '#3', name: 'Alex Johnson', position: 'Guard', age: 20, email: 'alex@example.com', phone: '9876543213', status: 'Active' },
        { jersey: '#21', name: 'Chris Wilson', position: 'Forward', age: 22, email: 'chris@example.com', phone: '9876543214', status: 'Active' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-8 px-4 md:px-8">
            <div className="mb-6 flex flex-col">
                <h1 className="text-3xl font-bold text-gray-900">Manage Team</h1>
                <p className="text-md text-gray-500">NIT Trichy</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCardsData.map((stat) => (
                    <StatCard 
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                    />
                ))}
            </div>

            <section className="mt-6 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
                    <div className='md:w-auto w-full'>
                        <h2 className="text-xl font-semibold text-gray-800">Team Roster</h2>
                        <p className="text-sm text-gray-500">Manage your team players</p>
                    </div>
                    <div className="flex justify-between gap-4 sm:justify-between w-full md:w-auto">
                        <button className="md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50">
                            Basketball Team
                            <ChevronDown className="h-4 w-4" />
                        </button>
                        <button className="md:flex-none flex items-center justify-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
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
                        className="w-full p-2.5 pl-10 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="divide-y divide-gray-200 w-full">
                        <thead className="bg-gray-50">
                            <tr className='[&>*]:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                <th scope="col">Jersey</th>
                                <th scope="col">Name</th>
                                <th scope="col">Age</th>
                                <th scope="col">Contact</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {playersData.map((player) => (
                                <PlayerTableRow key={player.jersey} player={player} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}