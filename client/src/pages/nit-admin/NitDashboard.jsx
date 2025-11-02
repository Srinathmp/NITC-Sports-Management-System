import React from 'react';
import { Calendar, Users, MapPin, Utensils, Plus, Bed,Settings} from 'lucide-react';
import { useNavigate } from "react-router-dom";

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

const EventItem = ({ title, details, tagText }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-[#ababab98] rounded-xl hover:shadow-md transition-all">
    <div>
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-500 mb-2 sm:mb-0">{details}</p>
      <span className="bg-orange-400 text-white text-xs font-medium px-3 py-1 rounded-full">
        {tagText}
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

const DashboardButton = ({ title, Icon }) => (
  <button className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-300 transition-colors cursor-pointer">
    <Icon className="h-4 w-4" />
    <span>{title}</span>
  </button>
);

function NitDashboard() {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/nit-admin/create-event");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">NIT Admin Dashboard</h1>
        <p className="text-gray-600">NIT Trichy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="My Events" 
          value="8" 
          subtitle="5 ongoing, 3 completed" 
          Icon={Calendar} 
        />
        <StatCard 
          title="Registered Teams" 
          value="45" 
          subtitle="From 23 NITs" 
          Icon={Users} 
        />
        <StatCard 
          title="Accommodation" 
          value="98" 
          subtitle="of 150 rooms occupied" 
          Icon={MapPin} 
        />
        <StatCard 
          title="Mess Bookings" 
          value="320" 
          subtitle="of 500 capacity" 
          Icon={Utensils} 
        />
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
            <EventItem 
              title="Basketball"
              details="2024-02-15 • Main Court"
              tagText="8 teams registered"
            />
            <EventItem 
              title="Football"
              details="2024-02-16 • Sports Ground"
              tagText="12 teams registered"
            />
            <EventItem 
              title="Cricket"
              details="2024-02-17 • Cricket Field"
              tagText="16 teams registered"
            />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">Accommodation Overview</h2>
          <p className="text-sm text-gray-500 mb-6">Current accommodation and mess status</p>
          
          <div className="space-y-4">
            <ProgressBar 
              label="Room Occupancy"
              percentage={85}
              colorClass="bg-blue-600"
            />
            <ProgressBar 
              label="Mess Capacity"
              percentage={64}
              colorClass="bg-orange-500"
            />
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DashboardButton title="Manage Rooms" Icon={Bed} />
            <DashboardButton title="Mess Details" Icon={Utensils} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default NitDashboard;