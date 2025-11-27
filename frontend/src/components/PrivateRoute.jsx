import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // 1. While the context is loading, don't render anything yet
    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    // 2. Once loading is complete, check if there is a user
    if (!user) {
        // If no user, redirect them to the login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If there is a user, render the child component (the protected page)
    return children;
};

export default PrivateRoute;