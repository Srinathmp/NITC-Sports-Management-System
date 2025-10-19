import "./index.css";
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

export default function App(){
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="*" element={<div>404:NOT FOUND!!!</div>} />
            </Routes>
        </Router>
    )
}