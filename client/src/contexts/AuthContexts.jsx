import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FullPageLoader from '../components/FullPageLoader';
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(localStorage.getItem('user'));
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const validateToken = async () => {
        if (token) {
            try {
                const response = await api.get('/users/me');
                console.log(response.data)
                
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

    const login = (userToken, userData) => {
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', userData);
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

    const value = { user, token, isLoading, login, logout, isAuthenticated: !!user, validateToken };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};