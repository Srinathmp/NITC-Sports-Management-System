import { useState } from 'react';
import { Trophy, Search, Filter, Plus, Calendar, MapPin, Users, Edit, ChevronDown } from 'lucide-react';

const getStatusStyles = (status) => {
    switch (status) {
        case 'ongoing':
            return 'bg-blue-600 text-white border-blue-600';
        case 'upcoming':
            return 'bg-orange-400 text-white border-orange-400';
        case 'registration':
            return 'bg-yellow-400 text-white border-yellow-400';
        case 'completed':
            return 'bg-green-600 text-white border-green-600';
        default:
            return 'bg-gray-600 text-white border-gray-600';
    }
};

const getStatusText = (status) => {
    switch (status) {
        case 'registration': return 'Registration Open';
        case 'upcoming': return 'Upcoming';
        case 'ongoing': return 'Ongoing';
        case 'completed': return 'Completed';
        default: return status;
    }
};

const StatCard = ({ title, value, subtitle, Icon }) => {
    return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm text-gray-900">{title}</h3>
            <Icon className="h-4 w-4 text-gray-500" />
        </div>
        <div className="px-6 pb-6">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
    </div>);
};

const EventCard = ({ event }) => {
    const registrationPercentage = Math.round((event.registeredTeams / event.maxTeams) * 100);

    return (<div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all">
        <div className="p-6 pb-0">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{event.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">Organized by {event.organizer}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusStyles(event.status)}`}>
                    {getStatusText(event.status)}
                </span>
            </div>
        </div>

        <div className="p-6">
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{event.sport}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{event.startDate} to {event.endDate}</span>
                </div>

                <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{event.venue}</span>
                </div>

                <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-900">
                        {event.registeredTeams}/{event.maxTeams} teams registered
                    </span>
                </div>

                <div className="space-y-1 pt-2">
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>Registration Progress</span>
                        <span>{registrationPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${registrationPercentage}%` }}
                        ></div>
                    </div>
                </div>

                <div className="flex justify-center gap-2 pt-2">
                    <button className="cursor-pointer w-full px-4 py-2 text-sm font-semibold rounded-lg border border-gray-200 bg-white hover:bg-gray-100 transition-colors">
                        View Details
                    </button>
                </div>
            </div>
        </div>
    </div>);
};

function Events() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const events = [
        { id: 1, name: 'Inter-NIT Basketball Championship', sport: 'Basketball', status: 'ongoing', startDate: '2024-02-15', endDate: '2024-02-20', venue: 'Main Sports Complex', registeredTeams: 16, maxTeams: 16, organizer: 'NIT Trichy' },
        { id: 2, name: 'Football Premier League', sport: 'Football', status: 'upcoming', startDate: '2024-02-25', endDate: '2024-03-05', venue: 'Football Stadium', registeredTeams: 12, maxTeams: 16, organizer: 'NIT Warangal' },
        { id: 3, name: 'Cricket T20 Tournament', sport: 'Cricket', status: 'registration', startDate: '2024-03-10', endDate: '2024-03-20', venue: 'Cricket Ground', registeredTeams: 8, maxTeams: 16, organizer: 'NIT Surathkal' },
        { id: 4, name: 'Volleyball Championship', sport: 'Volleyball', status: 'completed', startDate: '2024-01-15', endDate: '2024-01-25', venue: 'Indoor Sports Hall', registeredTeams: 12, maxTeams: 12, organizer: 'NIT Rourkela' },
        { id: 5, name: 'Tennis Open', sport: 'Tennis', status: 'upcoming', startDate: '2024-03-25', endDate: '2024-04-05', venue: 'Tennis Courts', registeredTeams: 24, maxTeams: 32, organizer: 'NIT Calicut' },
    ];

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchQuery.toLowerCase()) || event.sport.toLowerCase().includes(searchQuery.toLowerCase()) || event.organizer.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    const ongoingCount = events.filter(e => e.status === 'ongoing').length;
    const registrationCount = events.filter(e => e.status === 'registration').length;
    const totalTeams = events.reduce((sum, event) => sum + event.registeredTeams, 0);
    const completedCount = events.filter(e => e.status === 'completed').length;

    return (
        <div className="space-y-6 w-full p-8 pt-5 px-4 md:px-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                <p className="text-gray-500 mt-1">Browse upcoming and ongoing tournaments</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="flex flex-col sm:flex-row gap-4 flex-1 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <input type="text" placeholder="Search events, sports, or organizers..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-400 bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    </div>

                    <div className="relative w-full sm:w-40">
                        <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="w-full px-4 py-2.5 rounded-lg border border-gray-400 bg-white text-gray-900 hover:bg-gray-100 transition-colors flex items-center justify-between" >
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4" />
                                <span className="text-sm">
                                    {selectedStatus === 'all' ? 'All Status' : getStatusText(selectedStatus)}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4" />
                        </button>

                        {isFilterOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                                <div className="absolute z-20 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                                    <button onClick={() => { setSelectedStatus('all'); setIsFilterOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg ${selectedStatus === 'all' ? 'bg-gray-100' : ''}`} >
                                        All Status
                                    </button>
                                    <button onClick={() => { setSelectedStatus('registration'); setIsFilterOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors ${selectedStatus === 'registration' ? 'bg-gray-100' : ''}`} >
                                        Registration
                                    </button>
                                    <button onClick={() => { setSelectedStatus('upcoming'); setIsFilterOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors ${selectedStatus === 'upcoming' ? 'bg-gray-100' : ''}`} >
                                        Upcoming
                                    </button>
                                    <button onClick={() => { setSelectedStatus('ongoing'); setIsFilterOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors ${selectedStatus === 'ongoing' ? 'bg-gray-100' : ''}`} >
                                        Ongoing
                                    </button>
                                    <button onClick={() => { setSelectedStatus('completed'); setIsFilterOpen(false); }} className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-100 transition-colors last:rounded-b-lg ${selectedStatus === 'completed' ? 'bg-gray-1G00' : ''}`} >
                                        Completed
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}
            </div>

            {filteredEvents.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex flex-col items-center justify-center py-12 px-6">
                        <Trophy className="h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500 text-center">
                            {searchQuery || selectedStatus !== 'all' ? 'Try adjusting your search or filters' : 'No events have been created yet'}
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard title="Total Events" value={events.length} subtitle={`${ongoingCount} ongoing`} Icon={Trophy} />
                <StatCard title="Registrations Open" value={registrationCount} subtitle="Events accepting teams" Icon={Users} />
                <StatCard title="Total Teams" value={totalTeams} subtitle="Across all events" Icon={Users} />
                <StatCard title="Completed Events" value={completedCount} subtitle="This season" Icon={Trophy} />
            </div>
        </div>);
};

export default Events;