import "./index.css";
import Home from './pages/Home';
import Events from "./pages/Events";
import Login from './pages/auth/Login';
import Teams from "./pages/Teams";
import Coach from "./pages/Coach/Coach";
import Matches from "./pages/Matches";
import Leaderboard from "./pages/Leaderboard";
import ManageTeams from "./pages/Coach/ManageTeams";
import Notifications from "./pages/Notifications";
import CoachDashboard from "./pages/Coach/CoachDashboard";
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from "./components/layout/PublicLayout";

export default function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/public" element={<PublicLayout />} >
                <Route index element={<Navigate to="leaderboard" replace />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="teams" element={<Teams />} />
                <Route path="matches" element={<Matches />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="events" element={<Events />} />
            </Route>
            <Route path="/coach" element={<Coach />} >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<CoachDashboard />} />
                <Route path="manage-teams" element={<ManageTeams />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="teams" element={<Teams />} />
                <Route path="matches" element={<Matches />} />
                <Route path="events" element={<Events />} />
            </Route>
            <Route path="*" element={<div>404:NOT FOUND!!!</div>} />
        </Routes>
    )
}