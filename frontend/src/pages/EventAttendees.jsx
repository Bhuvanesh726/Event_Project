import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { ArrowLeft, Trash2, Download } from 'lucide-react'; // ADDED: Download icon

const EventAttendees = () => {
    const { id } = useParams();
    const [attendees, setAttendees] = useState([]);
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [eventRes, attendeesRes] = await Promise.all([
                    api.get(`/api/events/${id}`),
                    api.get(`/api/events/${id}/attendees`)
                ]);
                setEvent(eventRes.data);
                setAttendees(attendeesRes.data);
            } catch (error) {
                console.error('Failed to fetch attendee data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleDeleteAttendee = async (attendeeId) => {
        if (window.confirm('Are you sure you want to remove this attendee?')) {
            try {
                await api.delete(`/api/events/attendees/${attendeeId}`);
                setAttendees(currentAttendees => currentAttendees.filter(a => a.id !== attendeeId));
            } catch (error) {
                console.error('Failed to delete attendee:', error);
                alert('Failed to remove attendee. Please try again.');
            }
        }
    };

    // ADDED: Function to handle the PDF download
    const handleDownloadPdf = async () => {
        try {
            const response = await api.get(`/api/events/${id}/attendees/download`, {
                responseType: 'blob', // Crucial for file downloads
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            // The filename is set by the backend, but this provides a fallback
            link.setAttribute('download', `${event.title}_attendees.pdf`);
            document.body.appendChild(link);
            link.click();

            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

        } catch (err) {
            console.error("Failed to download PDF", err);
            alert("Failed to download PDF. Please try again.");
        }
    };

    if (isLoading) return <div className="text-center p-10">Loading attendees...</div>;
    if (!event) return <div className="text-center p-10">Event not found.</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to={`/event/${id}`} className="inline-flex items-center text-blue-600 hover:underline mb-6">
                <ArrowLeft size={18} className="mr-2" />
                Back to Event Details
            </Link>

            <div className="flex justify-between items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Attendees for "{event.title}"</h1>
                {/* ADDED: The download button */}
                <button
                    onClick={handleDownloadPdf}
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    <Download size={18} className="mr-2" />
                    Download PDF
                </button>
            </div>

            <p className="text-gray-600 mb-8">A total of {attendees.length} attendee(s) have registered.</p>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tickets</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendees.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No one has registered for this event yet.</td></tr>
                        ) : (
                            attendees.map((attendee) => (
                                <tr key={attendee.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attendee.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendee.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attendee.tickets}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                        <button onClick={() => handleDeleteAttendee(attendee.id)} className="text-red-600 hover:text-red-900" title="Remove Attendee">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EventAttendees;