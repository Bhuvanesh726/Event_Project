import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RegistrationModal = ({ isOpen, onClose, event, onRegister }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', tickets: 1,
    });
    const [step, setStep] = useState(1);

    useEffect(() => {
        // Reset form and step when the modal is opened
        if (isOpen) {
            setFormData({ name: '', email: '', phone: '', tickets: 1 });
            setStep(1);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 1) {
            // If the event is free, register immediately. Otherwise, go to the mock payment step.
            if ((event.ticketPrice || 0) === 0) {
                onRegister(formData);
            } else {
                setStep(2);
            }
        } else {
            // This is the final "payment" step.
            // In a real app, you'd handle payment here. We just call onRegister.
            console.log('Simulating successful payment and registering attendee...');
            onRegister(formData);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    if (!isOpen || !event) return null;

    const totalAmount = (event.ticketPrice || 0) * formData.tickets;
    const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white rounded-lg max-w-md w-full"
                    >
                        <div className="flex justify-between items-center p-6 border-b">
                            <h2 className="text-xl font-semibold text-black">
                                {step === 1 ? 'Register for Event' : 'Payment Details'}
                            </h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-black"><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="mb-4">
                                <h3 className="font-semibold text-black">{event.title}</h3>
                            </div>
                            {step === 1 ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Tickets</label>
                                        <select name="tickets" value={formData.tickets} onChange={handleChange} className="w-full p-2 border rounded bg-white">
                                            {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num}</option>)}
                                        </select>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-md">
                                        <div className="flex justify-between font-semibold text-black">
                                            <span>Total Amount:</span>
                                            <span>{formatCurrency(totalAmount)}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-black mb-2">Card Details (Simulation)</label>
                                        <div className="relative">
                                            <CreditCard size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input type="text" placeholder="4242 4242 4242 4242" className="w-full pl-10 p-2 border rounded" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center pt-6 text-lg font-semibold text-gray-800 bg-gray-50 -mx-6 -mb-6 px-6 py-4 mt-6 rounded-b-lg">
                                <span>Total: {formatCurrency(totalAmount)}</span>
                                <div className="flex space-x-2">
                                    <button type="button" onClick={step === 1 ? onClose : () => setStep(1)} className="px-4 py-2 border rounded font-semibold hover:bg-gray-100">
                                        {step === 1 ? 'Cancel' : 'Back'}
                                    </button>
                                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700">
                                        {step === 1 ? 'Continue' : 'Complete Registration'}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default RegistrationModal;