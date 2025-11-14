import React, { useEffect, useState } from 'react';
import { Calendar, Users, MapPin, Utensils, Plus, Bed, Settings, Check } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import api from '../../api/axios';
import FullPageLoader from '../../components/FullPageLoader';
import { useAuth } from '../../contexts/AuthContexts';
import { format } from 'date-fns';


const StatCard = ({ title, value, subtitle, Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-3xl font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

const EventItem = ({ title, date, loc, teams }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-[#ababab98] rounded-xl hover:shadow-md transition-all">
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500 mb-2 sm:mb-0">{`${date} -- ${loc}`}</p>
      <span className="bg-orange-400 text-white text-xs font-medium px-3 py-1 rounded-full">
        {teams} Teams Registered
      </span>
    </div>
    <button className="mt-3 sm:mt-0 w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer">
      Manage
    </button>
  </div>
);

const ProgressBar = ({ label, percentage, colorClass }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <span className="text-sm font-medium text-gray-700">{percentage}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${colorClass} h-2 rounded-full`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  </div>
);

const DashboardButton = ({ title, Icon, navigate, location }) => (
  <button className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer" onClick={() => navigate(location)}>
    <Icon className="h-4 w-4" />
    <span>{title}</span>
  </button>
);

function NitDashboard() {
  const { name } = useAuth();
  const navigate = useNavigate();
  const [isHost, setIsHost] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [myTeams, setMyTeams] = useState(0)
  const [mySports, setMySports] = useState(0)
  const [totalNits, setTotalNits] = useState(0)
  const [myEvents, setMyEvents] = useState(0);
  const [myEventsList, setMyEventsList] = useState([]);
  const [myEventsSubtitle, setMyEventsSubtitle] = useState('');
  const [registeredTeams, setRegisteredTeams] = useState(0);
  const [registeredTeamsSubtitle, setRegisteredTeamsSubtitle] = useState('');
  const [accCapacity, setAccCapacity] = useState(0);
  const [accOccupied, setAccOccupied] = useState(0);
  const [messCapacity, setMessCapacity] = useState(0);
  const [messOccupied, setMessOccupied] = useState(0);

  const handleRedirect = () => navigate('/nit-admin/create-event');

  const fetchDashboard = async () => {
    try {
      const res = await api.get('/dashboard/nit-admin');
      setIsHost(res.data.isHost);
      setRegisteredTeams(res.data.totalCount)
      setTotalNits(res.data.distinctValues)
      setMyEventsList(res.data.upcomingEvents)
      setMyTeams(res.data.myTeams)
      setMySports(res.data.mySports)
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAccommodationSummary = async () => {
  try {
    const res = await api.get("/accommodation/accommodation-summary");

    const acc = res.data.accommodation;
    const mess = res.data.mess;

    setAccCapacity(acc.totalCapacity);
    setAccOccupied(acc.totalOccupied);

    setMessCapacity(mess.totalCapacity);
    setMessOccupied(mess.totalOccupied);
  } catch (error) {
    console.error("Failed to load accommodation summary:", error);
  }
};

  useEffect(() => {
    fetchDashboard();
    fetchAccommodationSummary();
  }, []);

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <div className='flex items-center gap-4'>
          <h1 className="text-3xl font-bold text-gray-900 flex">Welcome, {name}</h1>
          {isHost && <p className='flex p-1 bg-blue-600 rounded-lg text-white'><Check /> HOST</p>}
        </div>
        <p className="text-gray-600">NIT Trichy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Teams" value={myTeams} subtitle={`Across ${mySports} sports`} Icon={Calendar} />
        <StatCard title="Registered Teams" value={registeredTeams} subtitle={`From ${totalNits} NITs`} Icon={Users} />
        <StatCard title="Accommodation" value={`${accOccupied}/${accCapacity}`} subtitle="Occupied / Total" Icon={MapPin}/>
        <StatCard title="Mess Bookings" value={`${messOccupied}/${messCapacity}`} subtitle="Occupied / Total" Icon={Utensils}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Events</h2>
              <p className="text-sm text-gray-500">Events scheduled for this week</p>
            </div>
            <button onClick={handleRedirect} className="mt-4 sm:mt-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer">
              <Plus className="h-4 w-4" />
              Add Event
            </button>
          </div>
          <div className="flex flex-col gap-4 p-4">
            {
              myEventsList.map((item, index) => {
                const dateObj = new Date(item.datetime);
                return <EventItem title={item.name} date={format(dateObj, 'MMM dd, yyyy')} loc={item.venue} teams={item.registeredTeams} />
              })
            }
            </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">Accommodation Overview</h2>
          <p className="text-sm text-gray-500 mb-6">Current accommodation and mess status</p>
          <div className="space-y-4">
            <ProgressBar
              label="Room Occupancy"
              percentage={
                accCapacity === 0 ? 0 : Math.round((accOccupied / accCapacity) * 100)
              }
              colorClass="bg-blue-600"
            />

            <ProgressBar
              label="Mess Capacity"
              percentage={
                messCapacity === 0 ? 0 : Math.round((messOccupied / messCapacity) * 100)
              }
              colorClass="bg-orange-500"
            />
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardButton title="Manage Rooms" Icon={Bed} navigate={navigate} location='/nit-admin/accomodation' />
            <DashboardButton title="Mess Details" Icon={Utensils} navigate={navigate} location='/nit-admin/accomodation' />
          </div>
        </div>
      </div>
    </div>
  );
}

export default NitDashboard;