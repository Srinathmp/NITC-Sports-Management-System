import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FullPageLoader from '../components/FullPageLoader';
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [email, setEmail] = useState('')
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [name, setName] = useState(localStorage.getItem('name'));
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const validateToken = async () => {
        if (token) {
            try {
                const response = await api.get('/users/me');
                setUser(response.data.role)
                setUser(response.data.name)
            } catch (error) {
                alert("Auth Error: Invalid token. Redirecting....");
                logout();
            }
        }
        setIsLoading(false);
    };

    useEffect(() => {
        validateToken();
    }, [])

    const login = (userToken, userData, userName, email) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', userData);
        localStorage.setItem('name', userName);
        setEmail(email)
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        setToken(userToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setUser(null);
        navigate('/');
    };

    const value = { name, email, user, token, isLoading, login, logout, isAuthenticated: !!user, validateToken };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};