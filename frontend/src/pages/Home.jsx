import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, BarChart3, CreditCard, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const features = [
        { icon: Calendar, title: 'Event Creation', description: 'Create and manage events with ease' },
        { icon: Users, title: 'Attendee Management', description: 'Track registrations and manage attendees' },
        { icon: BarChart3, title: 'Analytics', description: 'Monitor event performance and success' },
        { icon: CreditCard, title: 'Payment Processing', description: 'Handle ticket sales and payments' }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* The local <nav> element has been removed. The global Navbar from App.jsx will be used instead. */}
            <main>
                <section className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                            <h1 className="text-4xl md:text-6xl font-bold text-black mb-6">
                                Welcome to EventManager
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                                The complete solution for managing events, tracking attendees, and processing payments.
                                Create memorable experiences with our comprehensive event management platform.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/signup" className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium flex items-center justify-center space-x-2">
                                    <span>Get Started</span>
                                    <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="border border-gray-300 text-black px-8 py-3 rounded-md hover:bg-gray-50 transition-colors font-medium">
                                    Sign In
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                <section className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-black mb-4">
                                Everything you need to manage events
                            </h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                From creation to analytics, our platform provides all the tools you need to run successful events.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.1 }} className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                                        <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                                            <Icon className="text-blue-600" size={24} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-black mb-2">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Home;