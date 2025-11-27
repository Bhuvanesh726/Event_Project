import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, UserCog } from 'lucide-react'; // ADDED: UserCog icon

const Navbar = () => {
    const { user, logout, isAdmin } = useAuth(); // CHANGED: Get isAdmin from context

    const firstName = user?.name?.split(' ')[0] || '';

    return (
        <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0">
                        <Link to={user ? "/dashboard" : "/"} className="text-xl font-bold text-black">
                            EventManager
                        </Link>
                    </div>

                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {user && (
                            <>
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Dashboard</NavLink>
                                <NavLink to="/attendees" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Attendees</NavLink>
                                <NavLink to="/analytics" className={({ isActive }) => isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}>Analytics</NavLink>

                                {/* ADDED: Admin-only link */}
                                {isAdmin && (
                                    <NavLink to="/manage-users" className={({ isActive }) => `inline-flex items-center ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"}`}>
                                        <UserCog size={16} className="mr-2" />
                                        Manage Users
                                    </NavLink>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-gray-800 hidden sm:block">Welcome, {firstName}</span>
                                <button
                                    onClick={logout}
                                    className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-medium flex items-center space-x-2"
                                    title="Logout"
                                >
                                    <LogOut size={16} />
                                    <span className="hidden md:inline">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-black hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;