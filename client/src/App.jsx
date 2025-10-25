import PublicLayout from "./components/layout/PublicLayout";
import "./index.css";
import Home from './pages/Home';
import Login from './pages/auth/Login';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/public" element={<PublicLayout/>} >
                </Route>
                <Route path="*" element={<div>404:NOT FOUND!!!</div>} />
            </Routes>
        </Router>
    )
}