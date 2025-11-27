import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { Search, Filter } from 'lucide-react';

const Attendees = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEvent, setSelectedEvent] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            if (!user) return;
            try {
                setIsLoading(true);
                const [eventsRes, attendeesRes] = await Promise.all([
                    api.get('/api/events'),
                    api.get('/api/events/all/attendees')
                ]);
                setEvents(eventsRes.data);
                setAttendees(attendeesRes.data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const filteredAttendees = useMemo(() => {
        return attendees.filter(attendee => {
            const matchesEvent = selectedEvent === 'all' || attendee.eventId === parseInt(selectedEvent);
            const matchesSearch = searchTerm
                ? attendee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                attendee.email?.toLowerCase().includes(searchTerm.toLowerCase())
                : true;
            return matchesEvent && matchesSearch;
        });
    }, [attendees, searchTerm, selectedEvent]);

    if (isLoading) return <div className="text-center p-8">Loading attendees...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">All Attendees</h1>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search by name or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="relative">
                    <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)} className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-md bg-white">
                        <option value="all">All Events</option>
                        {events.map(event => (<option key={event.id} value={event.id}>{event.title}</option>))}
                    </select>
                </div>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendee</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAttendees.length > 0 ? (
                            filteredAttendees.map((attendee) => (
                                <tr key={attendee.id}>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{attendee.name}</div>
                                        <div className="text-sm text-gray-500">{attendee.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{attendee.eventTitle}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{attendee.tickets}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="text-center py-12 text-gray-500">No attendees found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Attendees;