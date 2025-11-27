import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, IndianRupee } from 'lucide-react';

// 1. Import all your new images
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
            <div className={`w-2.5 h-2.5 rounded-full animate-blink ${config.color}`}></div>
            <span className="text-xs font-medium text-gray-600">{config.text}</span>
        </div>
    );
};

// 2. Create a map to link category names to the imported images
const categoryImageMap = {
    conference: conferenceImage,
    meetup: meetupImage,
    other: otherImage,
    seminar: seminarImage,
    wedding: weddingImage,
    workshop: workshopImage,
};

const EventCard = ({ event }) => {
    if (!event) {
        return null;
    }

    const formattedDate = new Date(event.date).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

    // 3. Updated logic to select the image from the map
    const category = event.category?.toLowerCase();
    const imageUrl = categoryImageMap[category] || `https://picsum.photos/seed/${event.id}/400/200`;

    return (
        <div className="relative bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col">

            <img
                src={imageUrl}
                alt={event.title}
                className="w-full h-40 object-cover"
            />

            {event.category && (
                <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
            )}

            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-black mb-2 truncate">{event.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{event.description}</p>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <Calendar size={16} className="mr-2 text-gray-500" />
                        <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <MapPin size={16} className="mr-2 text-gray-500" />
                        <span>{event.location}</span>
                    </div>
                    {event.capacity && (
                        <div className="flex items-center text-sm text-gray-600">
                            <Users size={16} className="mr-2 text-gray-500" />
                            <span>{event.capacity} Capacity</span>
                        </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                        <IndianRupee size={16} className="mr-2 text-gray-500" />
                        <span>{event.ticketPrice > 0 ? `₹${event.ticketPrice}` : 'Free'}</span>
                    </div>
                </div>

                <div className="flex justify-end mb-4">
                    <EventStatusIndicator status={event.status} />
                </div>

                <Link
                    to={`/event/${event.id}`}
                    className="block w-full text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-semibold mt-auto"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default EventCard;