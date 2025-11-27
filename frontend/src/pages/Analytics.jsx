import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { BarChart3 } from 'lucide-react';
import DonutChart from '../components/DonutChart';

const Analytics = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [attendees, setAttendees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
                console.error('Failed to fetch analytics data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const analyticsData = useMemo(() => {
        if (events.length === 0) return null;

        const enrichedEvents = events.map(event => {
            const eventAttendees = attendees.filter(a => a.eventId === event.id);
            const registrations = eventAttendees.reduce((sum, a) => sum + (a.tickets || 0), 0);
            const revenue = registrations * (event.ticketPrice || 0);
            const fillPercentage = event.capacity > 0 ? (registrations / event.capacity) * 100 : 0;
            return { ...event, registrations, revenue, fillPercentage };
        });

        const totalRegistrations = attendees.reduce((sum, a) => sum + (a.tickets || 0), 0);
        const totalRevenue = enrichedEvents.reduce((sum, e) => sum + e.revenue, 0);

        // <-- UPDATED to get Top 3 -->
        const topPerformers = [...enrichedEvents].sort((a, b) => b.fillPercentage - a.fillPercentage).slice(0, 3);
        const topGrowth = [...enrichedEvents].sort((a, b) => b.revenue - a.revenue);

        return {
            totalEvents: events.length,
            totalRegistrations,
            totalRevenue,
            topPerformers,
            topGrowth,
        };
    }, [events, attendees]);

    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

    if (isLoading) return <div className="text-center p-8">Loading analytics...</div>;

    if (!analyticsData) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
                <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data available</h3>
                <p className="text-gray-600">Create events and register attendees to see analytics.</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-gray-500">Total Events</h3><p className="text-3xl font-bold text-gray-900">{analyticsData.totalEvents}</p></div>
                    <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-gray-500">Total Registrations</h3><p className="text-3xl font-bold text-gray-900">{analyticsData.totalRegistrations}</p></div>
                    <div className="bg-white p-6 rounded-lg shadow-md"><h3 className="text-gray-500">Total Revenue</h3><p className="text-3xl font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</p></div>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Performers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-white p-6 rounded-lg shadow-md">
                    {analyticsData.topPerformers.map((event, index) => (
                        <DonutChart
                            key={event.id}
                            title={event.title}
                            percentage={event.fillPercentage}
                            label={`${event.registrations}/${event.capacity}`}
                            // <-- UPDATED color logic -->
                            color={['green', 'pink', 'orange'][index]}
                        />
                    ))}
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Growth (by Revenue)</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets Sold</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {analyticsData.topGrowth.map((event) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                                    <td className="px-6 py-4 text-gray-700">{event.registrations}</td>
                                    <td className="px-6 py-4 text-gray-700">{formatCurrency(event.revenue)}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-100">
                            <tr>
                                <td colSpan="2" className="px-6 py-4 text-right font-bold text-gray-800">Total Revenue</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{formatCurrency(analyticsData.totalRevenue)}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Analytics;