import React, { useEffect, useState } from 'react';
import { Users, Award, Calendar, FileText, Check, X, ClipboardCheck } from 'lucide-react';
import api from '../../api/axios';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContexts';

// Reusable Stat Card
const StatCard = ({ title, value, Icon, subtitle }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <Icon className="h-5 w-5 text-gray-400" />
    </div>
    <p className="text-3xl font-semibold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500">{subtitle}</p>
  </div>
);

const PendingRegistrationItem = ({ nitName, registeredDate, code, fetchData }) => {
  const [isHost, setIsHost] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const approveReq = async () => {
    setIsLoading(true)
    await api.patch(`/nits/${code}/status`, { status: "Approved", isHost: isHost })
    fetchData()
  }
  const rejectReq = async () => {
    setIsLoading(true)
    await api.patch(`/nits/${code}/status`, { status: "Rejected", isHost: isHost })
    fetchData()
  }
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-all">
      <div>
        <h4 className="font-semibold text-gray-800">{nitName}</h4>
        <p className="text-sm text-gray-500">Applied: {registeredDate}</p>
      </div>
      <button className={`flex items-center justify-center gap-2 px-4 py-2 ${isHost ? 'bg-blue-600' : 'bg-blue-400'} text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors cursor-pointer`} onClick={() => setIsHost(!isHost)}>
        {isHost && <Check className="h-4 w-4" />}
        {!isHost && <X className="h-4 w-4" />}
        <span>Set Host</span>
      </button>
      <div className="flex gap-2 mt-3 sm:mt-0 flex-shrink-0 justify-between">
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-green-400" onClick={approveReq} disabled={isLoading}>
          <Check className="h-4 w-4" />
          <span>Approve</span>
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:bg-red-400" onClick={rejectReq} disabled={isLoading}>
          <X className="h-4 w-4" />
          <span>Reject</span>
        </button>
      </div>
    </div>
  );
}

const RecentActivityItem = ({ text, time }) => (
  <li className="flex gap-3 items-start">
    <span className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500"></span>
    <div>
      <p className="text-sm text-gray-700">{text}</p>
      <p className="text-xs text-gray-500">{time}</p>
    </div>
  </li>
);

function FullPageLoader() {
  return (
    <div className="flex h-screen w-full items-center justify-center flex-col">
      <div className="mx-auto mb-6 h-12 w-12 animate-spin rounded-full border-4 border-white/30 border-t-blue-500" />
      <div className="text-center text-black">
        <h2 className="text-2xl font-semibold">Loading...</h2>
        <p className="text-slate-400">Please wait while we fetch the data.</p>
      </div>
    </div>
  );
}

function CommonAdminDashboard() {
  const { name } = useAuth();
  const [isLoading, setIsLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState([])
  const [nit, setNit] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [nitPending, setNitPending] = useState(0)
  const [eventsCount, setEventsCount] = useState(0)
  const [sportsCount, setSportsCount] = useState(0)
  const [scheduledMatches, setScheduledMatches] = useState(0)
  const [completedMatches, setCompletedMatches] = useState(0)
  const [pendingList, setPendingList] = useState([])

  const handleNextPage = () => { setCurrentPage(currentPage + 1); }
  const handlePrevPage = () => { setCurrentPage(currentPage - 1); }

  const fetchDashboard = async () => {
    const res = await api.get(`/dashboard/common-admin?page=${currentPage}`)
    console.log(res)
    setNit(res.data.approved)
    setNitPending(res.data.pending)
    setEventsCount(res.data.eventsCount)
    setSportsCount(res.data.sportsCount)
    setScheduledMatches(res.data.scheduledMatches)
    setCompletedMatches(res.data.completedMatches)
    setPendingList(res.data.pendingList)
    setTotalPage(res.data.pending ? Math.ceil(res.data.pending / 3) : 0)
    setRecentActivities(res.data.logs)
    setIsLoading(false)
  }

  useEffect(() => {
    fetchDashboard()
  }, [currentPage])

  if (isLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome, {name}</h1>
        <p className="text-md text-gray-500">COMMON ADMIN</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total NITs" value={`${nit}`} subtitle={`+${nitPending} pending approval`} Icon={Users} />
        <StatCard title="Active Events" value={`${eventsCount}`} subtitle={`Across ${sportsCount} sports`} Icon={Award} />
        <StatCard title="Scheduled Matches" value={`${scheduledMatches}`} subtitle={`Completed: ${completedMatches}`} Icon={Calendar} />
        <StatCard title="Pending Result" value="45" subtitle="This month" Icon={ClipboardCheck} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">Pending NIT Registrations</h2>
          <p className="text-sm text-gray-500 mb-6">Review and approve new NIT registrations</p>
          <div className={`min-h-60 ${totalPage != 0 ? 'hidden' : ''} items-center justify-center flex border border-[#aeaeae69] rounded-lg text-xl`}>
            Nothing to show...
          </div>
          <div className={`flex flex-col gap-4 min-h-60 ${totalPage == 0 ? 'hidden' : ''}`}>
            {
              pendingList.map((curr, index) => {
                const dateObj = new Date(curr.createdAt);
                return <PendingRegistrationItem key={curr.code} nitName={curr.name} registeredDate={format(dateObj, 'MMM dd, yyyy')} code={curr.code} fetchData={fetchDashboard} />
              })
            }
          </div>
          <div className={`flex items-center justify-between mt-5 md:px-30 [&_button]:border [&_button]:border-[#7b7b7b5a] [&_button]:p-2 [&_button]:rounded-xl [&_button]:cursor-pointer [&_button]:hover:bg-blue-400 [&_button]:hover:text-white [&_button]:w-20 [&_button]:disabled:cursor-not-allowed ${totalPage == 0 ? 'hidden' : ''}`}>
            <button onClick={handlePrevPage} disabled={currentPage === 1}> Previous </button>
            Page {currentPage} of {totalPage}
            <button onClick={handleNextPage} disabled={currentPage === totalPage}> Next </button>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activities</h2>
          <p className="text-sm text-gray-500 mb-6">Latest Common-Admin actions and system updates</p>

          <ul className="space-y-4 min-h-30">
            {
              recentActivities.map((activity, index) => {
                return <RecentActivityItem key={index} text={activity.details} time={activity.createdAt} />
              })
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default CommonAdminDashboard;
