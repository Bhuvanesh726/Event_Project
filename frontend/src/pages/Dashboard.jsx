import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Calendar } from 'lucide-react';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import { useAuth } from '../context/AuthContext';
import api from '../api'; // Import our API client

const Dashboard = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // This useEffect hook will fetch events from your backend API
    useEffect(() => {
        const fetchEvents = async () => {
            // This check prevents the error by waiting for the user object to exist
            if (!user) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const response = await api.get('/api/events');
                setEvents(response.data);
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvents();
    }, [user]); // The effect runs when the user object is available

    const handleCreateEvent = async (newEvent) => {
        try {
            const response = await api.post('/api/events', newEvent);
            setEvents(prevEvents => [response.data, ...prevEvents]);
            setIsCreateModalOpen(false);
        } catch (error) {
            console.error('Failed to create event:', error);
            alert('Failed to create event. Please try again.');
        }
    };

    const filteredEvents = useMemo(() => {
        if (!searchTerm) {
            return events;
        }
        return events.filter(event =>
            event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [events, searchTerm]);

    if (isLoading) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-black">Welcome back, {user?.name}!</h1>
                    <p className="text-gray-600">Manage and track your events</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
                >
                    <Plus size={18} />
                    <span>Create Event</span>
                </button>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-12">
                    <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-black mb-2">No events yet</h3>
                    <p className="text-gray-600 mb-4">Create your first event to get started</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Create Event
                    </button>
                </div>
            ) : (
                <>
                    <div className="relative mb-6">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-black"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                </>
            )}

            <CreateEventModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={handleCreateEvent}
            />
        </div>
    );
};

export default Dashboard;