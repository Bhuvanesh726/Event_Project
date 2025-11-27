import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import EventDetails from './pages/EventDetails';
import Attendees from './pages/Attendees';
import EventAttendees from './pages/EventAttendees';
import Analytics from './pages/Analytics';
import ManageUsers from './pages/ManageUsers';
import ForgotPassword from './pages/ForgotPassword'; // ADDED

function App() {
    return (
        <AuthProvider>
            <Navbar />
            <main className="pt-16">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} /> {/* ADDED */}

                    {/* Protected Routes */}
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/attendees" element={<PrivateRoute><Attendees /></PrivateRoute>} />
                    <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
                    <Route path="/event/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
                    <Route path="/event/:id/attendees" element={<PrivateRoute><EventAttendees /></PrivateRoute>} />
                    <Route path="/manage-users" element={<PrivateRoute><ManageUsers /></PrivateRoute>} />
                </Routes>
            </main>
        </AuthProvider>
    );
}

export default App;