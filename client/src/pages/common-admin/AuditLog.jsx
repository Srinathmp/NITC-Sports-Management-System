import React from 'react';
import { Search, ListFilter, Upload, Activity, User, Server, Calendar } from 'lucide-react';

const AuditLogItem = ({ icon, actor, status, actionTitle, actionDetails, timestamp, isHighlighted = false }) => {
  const statusBadgeMap = { success: 'bg-green-100 text-green-700', pending: 'bg-orange-100 text-orange-700', info: 'bg-blue-100 text-blue-700', };
  const statusBorderMap = { success: 'border-l-green-500', pending: 'border-l-orange-500', info: 'border-l-blue-500', };
  const badgeClass = statusBadgeMap[status] || 'bg-gray-100 text-gray-700';
  const borderClass = statusBorderMap[status] || 'border-l-gray-300';
  
  const backgroundClass = isHighlighted ? 'bg-blue-50' : 'bg-white hover:bg-gray-50';

  return (
    <div className={`p-5 rounded-lg border border-gray-200 shadow-sm transition-colors ${backgroundClass} border-l-4 ${borderClass}`} >
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-medium text-gray-700">{actor}</span>
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${badgeClass}`}>
          {status}
        </span>
      </div>
      
      <h3 className="text-md font-semibold text-gray-800 hover:underline cursor-pointer">
        {actionTitle}
      </h3>
      <p className="text-sm text-gray-600 mt-1">{actionDetails}</p>
      
      <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
        <Calendar className="h-4 w-4" />
        <span>{timestamp}</span>
      </div>
    </div>
  );
};

function AuditLogPage() {
  
  const logData = [
    { icon: <User className="h-5 w-5 text-gray-500" />, actor: 'Common Admin', status: 'success', actionTitle: 'Approved NIT Registration', actionDetails: 'Approved NIT Warangal registration for INSMS 2024', timestamp: '2024-01-16 14:32:05' },
    { icon: <User className="h-5 w-5 text-gray-500" />, actor: 'NIT Admin - Trichy', status: 'success', actionTitle: 'Created Event', actionDetails: 'Created Basketball Tournament with 8 teams', timestamp: '2024-01-16 13:45:12', isHighlighted: true },
    { icon: <User className="h-5 w-5 text-gray-500" />, actor: 'Coach - Team Alpha', status: 'success', actionTitle: 'Updated Team Roster', actionDetails: 'Added 2 new players to Basketball team roster', timestamp: '2024-01-16 12:05:08' },
    { icon: <User className="h-5 w-5 text-gray-500" />, actor: 'Common Admin', status: 'pending', actionTitle: 'Rejected NIT Registration', actionDetails: 'Rejected incomplete registration from NIT Patna', timestamp: '2024-01-15 11:15:45' },
    { icon: <User className="h-5 w-5 text-gray-500" />, actor: 'NIT Admin - Surathkal', status: 'success', actionTitle: 'Published Match Results', actionDetails: 'Updated Football semi-final results: Team A vs Team B', timestamp: '2024-01-15 10:22:01' },
    { icon: <Server className="h-5 w-5 text-gray-500" />, actor: 'System', status: 'info', actionTitle: 'Auto-Generated Fixtures', actionDetails: 'Generated Round 1 fixtures for Cricket tournament', timestamp: '2024-01-15 09:00:00' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Audit Log</h1>
          <p className="text-gray-600">Track all system activities and administrative actions</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
          <Upload className="h-4 w-4" />
          <span>Export Log</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative flex-grow">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search by user, action, or details..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors flex-shrink-0">
          <ListFilter className="h-4 w-4" />
          <span>All Actions</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="flex items-center gap-3 p-5 border-b border-gray-200">
          <Activity className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            <p className="text-sm text-gray-500">Showing 6 of 6 audit entries</p>
          </div>
        </div>
        
        <div className="p-5 space-y-4">
          {logData.map((item, index) => (
            <AuditLogItem key={index} icon={item.icon} actor={item.actor} status={item.status} actionTitle={item.actionTitle} actionDetails={item.actionDetails} timestamp={item.timestamp} isHighlighted={index === 1}  />
          ))}
        </div>
      </div>
      
    </div>
  );
}

export default AuditLogPage;