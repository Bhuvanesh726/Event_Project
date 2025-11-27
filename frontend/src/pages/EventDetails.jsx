import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { Calendar, MapPin, ArrowLeft, Pencil, Trash2, Users, IndianRupee } from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';
import CreateEventModal from '../components/CreateEventModal';
import conferenceImage from '../assets/conference.jpg';
import meetupImage from '../assets/meetup.jpg';
import otherImage from '../assets/other.jpg';
import seminarImage from '../assets/seminar.jpg';
import weddingImage from '../assets/wedding.jpg';
import workshopImage from '../assets/workshop.jpg';

// Helper component for the blinking status dot
const EventStatusIndicator = ({ status }) => {
    if (!status) return null;
    const statusConfig = {
        active: { color: 'bg-green-500', text: 'Active' },
        draft: { color: 'bg-yellow-500', text: 'Draft' },
    };
    const config = statusConfig[status.toLowerCase()] || { color: 'bg-gray-500', text: 'Unknown' };
    return (
        <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full animate-blink ${config.color}`}></div>
            <span className="text-sm font-medium text-gray-700">{config.text}</span>
        </div>
    );
};

const categoryImageMap = {
    conference: conferenceImage,
    meetup: meetupImage,
    other: otherImage,
    seminar: seminarImage,
    wedding: weddingImage,
    workshop: workshopImage,
};

const EventDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        const fetchEventDetails = async () => {
            try {
                setIsLoading(true);
                const response = await api.get(`/api/events/${id}`);
                setEvent(response.data);
            } catch (err) {
                console.error("Failed to fetch event details:", err);
                setError('Failed to load event details. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchEventDetails();
    }, [id]);

    // <-- UPDATED THIS FUNCTION TO MAKE A REAL API CALL -->
    const handleRegister = async (registrationData) => {
        try {
            const response = await api.post(`/api/events/${id}/attendees`, registrationData);
            console.log('Attendee registered:', response.data);
            alert(`Thank you, ${registrationData.name}, for registering for ${event.title}!`);
            setIsRegisterModalOpen(false);
        } catch (err) {
            console.error('Registration failed:', err);
            alert('Registration failed. Please try again.');
        }
    };

    const handleEditEvent = async (updatedEventData) => { try { const response = await api.put(`/api/events/${id}`, updatedEventData); setEvent(response.data); setIsEditModalOpen(false); alert('Event updated successfully!'); } catch (error) { console.error('Failed to update event:', error); alert('Failed to update event. Please try again.'); } };
    const handleDeleteEvent = async () => { if (window.confirm('Are you sure you want to delete this event?')) { try { await api.delete(`/api/events/${id}`); alert('Event deleted successfully.'); navigate('/dashboard'); } catch (error) { console.error('Failed to delete event:', error); alert('Failed to delete event. Please try again.'); } } };

    if (isLoading) return <div className="text-center p-10">Loading...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!event) return <div className="text-center p-10">Event not found.</div>;

    const category = event.category?.toLowerCase();
    const imageUrl = categoryImageMap[category] || `https://picsum.photos/seed/${event.id}/800/600`;

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/dashboard" className="inline-flex items-center text-blue-600 hover:underline mb-6">
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Dashboard
                </Link>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden md:grid md:grid-cols-5 md:gap-8">
                    <div className="md:col-span-3">
                        <img src={imageUrl} alt={event.title} className="w-full h-64 md:h-full object-cover" />
                    </div>

                    <div className="p-8 md:col-span-2 flex flex-col">
                        <div className="flex justify-between items-start">
                            <EventStatusIndicator status={event.status} />
                            <div className="flex space-x-2">
                                <button onClick={() => setIsEditModalOpen(true)} className="flex items-center bg-yellow-500 text-white px-3 py-2 rounded-md hover:bg-yellow-600 transition-colors font-semibold text-sm">
                                    <Pencil size={16} className="mr-2" /> Edit
                                </button>
                                <button onClick={handleDeleteEvent} className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors font-semibold text-sm">
                                    <Trash2 size={16} className="mr-2" /> Delete
                                </button>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mt-4 mb-4">{event.title}</h1>
                        <p className="text-gray-600 mb-6">{event.description}</p>

                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center text-gray-700"><Calendar size={18} className="mr-3 text-gray-500" /> <span>{new Date(event.date).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</span></div>
                            <div className="flex items-center text-gray-700"><MapPin size={18} className="mr-3 text-gray-500" /> <span>{event.location}</span></div>
                            {event.capacity != null && <div className="flex items-center text-gray-700"><Users size={18} className="mr-3 text-gray-500" /> <span>{event.capacity} Capacity</span></div>}
                            {event.ticketPrice != null && <div className="flex items-center text-gray-700"><IndianRupee size={18} className="mr-3 text-gray-500" /> <span>{event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}</span></div>}
                        </div>

                        <div className="mt-auto border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Actions</h3>
                            <div className="flex flex-wrap gap-4">
                                <button onClick={() => setIsRegisterModalOpen(true)} className="text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-semibold">Register</button>
                                <Link to={`/event/${event.id}/attendees`} className="text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold">View Attendees</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <RegistrationModal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} event={event} onRegister={handleRegister} />
            <CreateEventModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} onSubmit={handleEditEvent} initialData={event} />
        </>
    );
};

export default EventDetails;