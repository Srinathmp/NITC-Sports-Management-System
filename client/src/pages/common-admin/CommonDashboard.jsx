import React from 'react';
import { Users, Award, Calendar, FileText, Check, X } from 'lucide-react';

const StatCard = ({ title, value, subtitle, Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-3xl font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

const PendingRegistrationItem = ({ nitName, registeredDate }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
    <div>
      <h4 className="font-semibold text-gray-800">{nitName}</h4>
      <p className="text-sm text-gray-500">Registered: {registeredDate}</p>
    </div>
    <div className="flex gap-2 mt-3 sm:mt-0 flex-shrink-0">
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer">
        <Check className="h-4 w-4" />
        <span>Approve</span>
      </button>
      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer">
        <X className="h-4 w-4" />
        <span>Reject</span>
      </button>
    </div>
  </div>
);

const RecentActivityItem = ({ text, time }) => (
  <li className="flex gap-3 items-start">
    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
    <div>
      <p className="text-sm text-gray-700">{text}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </li>
);

function CommonAdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Common Admin Dashboard</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total NITs" value="23" subtitle="+3 pending approval" Icon={Users} />
        <StatCard title="Active Events" value="12" subtitle="Across 8 sports" Icon={Award} />
        <StatCard title="Scheduled Matches" value="156" subtitle="Next: Tomorrow 9 AM" Icon={Calendar} />
        <StatCard title="Reports Generated" value="45" subtitle="This month" Icon={FileText} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">Pending NIT Registrations</h2>
          <p className="text-sm text-gray-500 mb-6">Review and approve new NIT registrations</p>          
          <div className="flex flex-col gap-4">
            <PendingRegistrationItem nitName="NIT Warangal" registeredDate="2024-01-15" />
            <PendingRegistrationItem nitName="NIT Surathkal" registeredDate="2024-01-16" />
            <PendingRegistrationItem nitName="NIT Rourkela" registeredDate="2024-01-17" />
          </div>
        </div>
        
        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-500 mb-6">Latest admin actions and system updates</p>
          
          <ul className="space-y-4">
            <RecentActivityItem text="Approved NIT Trichy registration" time="2 hours ago" />
            <RecentActivityItem text="Created Basketball tournament" time="4 hours ago" />
            <RecentActivityItem text="Published fixture schedule" time="1 day ago" />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommonAdminDashboard;