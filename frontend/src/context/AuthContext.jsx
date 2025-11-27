import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user from localStorage", error);
            localStorage.removeItem('user');
        }
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            const response = await api.post('/api/auth/register', userData);
            console.log('Registration successful:', response.data);
            navigate('/login');
        } catch (error) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            alert('Registration failed: ' + (error.response?.data?.message || 'Please try again.'));
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post('/api/auth/login', credentials);
            const userData = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            console.log('Login successful:', userData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            alert('Login failed: ' + (error.response?.data?.message || 'Invalid credentials.'));
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    // ADDED: A helper boolean to easily check if the user is an admin
    const isAdmin = user && user.role === 'ROLE_ADMIN';

    // ADDED: Pass the isAdmin flag in the context value
    const contextValue = { user, loading, signup, login, logout, isAuthenticated: !!user, isAdmin };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};