import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import FullPageLoader from '../components/FullPageLoader';
import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [email, setEmail] = useState('')
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [nitId, setNitId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate();

    const validateToken = async () => {
        if (token) {
            try {
                const response = await api.get('/users/me');
                setUser(response.data.role)
                setName(response.data.name)
                setEmail(response.data.email)
                setNitId(response.data.nit_id)
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

    const login = (userToken, userData, userName, email, nit_id) => {
        localStorage.setItem('token', userToken);
        setEmail(email)
        setName(userName)
        api.defaults.headers.common['Authorization'] = `Bearer ${userToken}`;
        setToken(userToken);
        setUser(userData);
        setNitId(nit_id);
    };

    const logout = () => {
        localStorage.removeItem('token');
        // localStorage.removeItem('user');
        delete api.defaults.headers.common['Authorization'];
        setToken(null);
        setEmail('');
        setName('');
        setUser('');
        setNitId('');
        navigate('/');
    };

    const value = { name, email, user, token, isLoading, login, logout, isAuthenticated: !!user, validateToken, nitId };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    return useContext(AuthContext);
};