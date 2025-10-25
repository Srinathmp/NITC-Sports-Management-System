import PublicLayout from "./components/layout/PublicLayout";
import "./index.css";
import Home from './pages/Home';
import { Leaderboard } from "./pages/Leaderboard";
import { Teams } from "./pages/Teams";
import Login from './pages/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/public" element={<PublicLayout/>} >
                    <Route path="leaderboard" element={<Leaderboard />} />
                    <Route path="teams" element={<Teams />} />
                </Route>
                <Route path="*" element={<div>404:NOT FOUND!!!</div>} />
            </Routes>
        </Router>
    )
}