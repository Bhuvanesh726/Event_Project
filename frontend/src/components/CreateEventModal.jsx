import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Users, IndianRupee, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CreateEventModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        title: '', description: '', date: '', location: '',
        capacity: '', ticketPrice: '', category: 'conference', status: 'draft'
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData && isOpen) {
            const formattedDate = initialData.date ? new Date(initialData.date).toISOString().slice(0, 16) : '';
            setFormData({
                title: initialData.title || '',
                description: initialData.description || '',
                date: formattedDate,
                location: initialData.location || '',
                capacity: initialData.capacity || '',
                ticketPrice: initialData.ticketPrice || '',
                category: initialData.category || 'conference',
                status: initialData.status || 'draft'
            });
        } else {
            setFormData({
                title: '', description: '', date: '', location: '',
                capacity: '', ticketPrice: '', category: 'conference', status: 'draft'
            });
            setErrors({});
        }
    }, [initialData, isOpen]);

    const isEditing = !!initialData;

    const categories = [
        'conference', 'workshop', 'seminar', 'meetup', 'wedding', 'other'
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Event title is required';
        if (!formData.description.trim()) newErrors.description = 'Event description is required';
        if (!formData.date) newErrors.date = 'Event date is required';
        if (!formData.location.trim()) newErrors.location = 'Event location is required';
        // You can add validation for the other fields here if you want
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center p-6 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-black">
                                {isEditing ? 'Edit Event' : 'Create New Event'}
                            </h2>
                            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Event Title *</label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text" name="title" value={formData.title} onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md text-black ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter event title"
                                    />
                                </div>
                                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Description *</label>
                                <textarea
                                    name="description" value={formData.description} onChange={handleChange} rows={3}
                                    className={`w-full px-3 py-2 border rounded-md text-black ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
                                    placeholder="Describe your event"
                                />
                                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Date & Time *</label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="datetime-local" name="date" value={formData.date} onChange={handleChange}
                                            className={`w-full pl-10 pr-3 py-2 border rounded-md text-black ${errors.date ? 'border-red-500' : 'border-gray-300'}`}
                                        />
                                    </div>
                                    {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Category</label>
                                    <select
                                        name="category" value={formData.category} onChange={handleChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
                                    >
                                        {categories.map(category => (
                                            <option key={category} value={category}>{category.charAt(0).toUpperCase() + category.slice(1)}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Location *</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text" name="location" value={formData.location} onChange={handleChange}
                                        className={`w-full pl-10 pr-3 py-2 border rounded-md text-black ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                                        placeholder="Enter event location"
                                    />
                                </div>
                                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
                            </div>

                            {/* <-- RESTORED FIELDS SECTION --> */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Capacity</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number" name="capacity" value={formData.capacity} onChange={handleChange} min="1"
                                            className="w-full pl-10 pr-3 py-2 border rounded-md text-black"
                                            placeholder="Maximum attendees"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-black mb-2">Ticket Price (₹)</label>
                                    <div className="relative">
                                        <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} min="0" step="0.01"
                                            className="w-full pl-10 pr-3 py-2 border rounded-md text-black"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-2">Status</label>
                                <select
                                    name="status" value={formData.status} onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-black bg-white"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="active">Active</option>
                                </select>
                            </div>
                            {/* <-- END OF RESTORED FIELDS --> */}

                            <div className="flex justify-end space-x-4 pt-4">
                                <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 text-black rounded-md hover:bg-gray-50">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    {isEditing ? 'Update Event' : 'Create Event'}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreateEventModal;