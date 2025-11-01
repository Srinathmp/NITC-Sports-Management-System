import { useState } from 'react';
import {
  Bell, Calendar, Trophy, AlertCircle, CheckCircle, Clock, Search,
} from 'lucide-react';

const NotificationCard = ({
  notification,
  getPriorityStyles,
  getTypeStyles,
  formatTime,
}) => {
  const { id, title, message, type, priority, timestamp, read, icon: IconComponent } = notification;

  return (
    <div className={`p-4 sm:p-5 border rounded-lg transition-all hover:shadow-md ${!read ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white hover:bg-gray-50'}`}>
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-shrink-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
            <IconComponent className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <h4 className={`font-semibold text-base sm:text-lg ${!read ? 'text-blue-700' : 'text-gray-900'}`}>
              {title}
            </h4>
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getPriorityStyles(priority)}`}>
                {priority}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${getTypeStyles(type)}`}>
                {type}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            {message}
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatTime(timestamp)}
            </p>
            {!read && (
              <button className="px-3 py-1 text-xs font-medium rounded-md border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 w-full sm:w-auto">
                Mark as Read
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Notifications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const notifications = [
    { id: 1, title: 'Basketball Semi-Final Results Published', message: 'NIT Trichy defeats NIT Warangal 78-65 in the Basketball Semi-Final. Final match scheduled for tomorrow.', type: 'result', priority: 'high', timestamp: '2024-01-15 16:30:00', read: false, icon: Trophy },
    { id: 2, title: 'Accommodation Booking Reminder', message: 'Reminder: Accommodation booking deadline is approaching. Please confirm your bookings by Jan 20th.', type: 'reminder', priority: 'medium', timestamp: '2024-01-15 14:45:00', read: false, icon: Bell },
    { id: 3, title: 'New Event Created: Swimming Championships', message: 'Swimming Championships has been added to the tournament schedule. Registration opens tomorrow.', type: 'announcement', priority: 'medium', timestamp: '2024-01-15 13:20:00', read: true, icon: Calendar },
    { id: 4, title: 'Team Registration Approved', message: 'Your Cricket team registration has been approved. You can now view your match schedule.', type: 'approval', priority: 'high', timestamp: '2024-01-15 12:15:00', read: true, icon: CheckCircle },
    { id: 5, title: 'Match Schedule Updated', message: 'Football Quarter-Final match timing has been updated. New time: 3:00 PM tomorrow.', type: 'update', priority: 'high', timestamp: '2024-01-15 11:30:00', read: false, icon: Clock },
    { id: 6, title: 'System Maintenance Notice', message: 'Scheduled system maintenance tonight from 2:00 AM to 4:00 AM. Some features may be unavailable.', type: 'system', priority: 'low', timestamp: '2024-01-15 10:00:00', read: true, icon: AlertCircle },
  ];

  const getNotificationsByType = (type) => {
    if (type === 'all') return notifications;
    return notifications.filter((n) => n.type === type);
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case 'result': return 'bg-green-100 text-green-800 border-green-200';
      case 'announcement': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'approval': return 'bg-green-100 text-green-800 border-green-200';
      case 'update': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'reminder': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'system': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredNotifications = (type) => {
    const typeFiltered = getNotificationsByType(type);
    return typeFiltered.filter((n) =>
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const tabs = [
    { value: 'all', label: 'All' },
    { value: 'result', label: 'Results' },
    { value: 'announcement', label: 'News' },
    { value: 'reminder', label: 'Reminders' },
    { value: 'approval', label: 'Approvals' },
    { value: 'update', label: 'Updates' },
    { value: 'system', label: 'System' },
  ];

  return (
    <div className="space-y-6 p-8 w-full px-4 md:px-8">
      <div className="flex flex-col sm:flex-row flex-wrap w-full gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 text-gray-900">
            <Bell className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600" />
            Notifications
            {unreadCount > 0 && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600 text-white">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">
            Stay updated with tournament announcements and results
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-700 text-sm w-full sm:w-auto justify-center">
          <CheckCircle className="h-4 w-4" />
          Mark All Read
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search notifications..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-nowrap overflow-x-auto gap-2 border-b border-gray-200 scrollbar-hide">
          {tabs.map((tab) => (
            <button key={tab.value} onClick={() => setActiveTab(tab.value)} className={`px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === tab.value ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}>
              {tab.label}
              {activeTab === tab.value && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
              )}
            </button>
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                {activeTab === 'all'
                  ? 'All Notifications'
                  : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Notifications`}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200 w-fit">
                {filteredNotifications(activeTab).length} notifications
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-4">
              {filteredNotifications(activeTab).map((n) => (
                <NotificationCard
                  key={n.id}
                  notification={n}
                  getPriorityStyles={getPriorityStyles}
                  getTypeStyles={getTypeStyles}
                  formatTime={formatTime}
                />
              ))}

              {filteredNotifications(activeTab).length === 0 && (
                <div className="text-center py-12">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 text-lg">No notifications found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;