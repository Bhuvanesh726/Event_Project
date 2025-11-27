import React from 'react';

const DonutChart = ({ percentage, label, color, title }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    // Ensure percentage is a number, default to 0 if not
    const safePercentage = typeof percentage === 'number' ? percentage : 0;
    const offset = circumference - (safePercentage / 100) * circumference;

    const colorClasses = {
        green: 'stroke-green-500',
        pink: 'stroke-pink-500',
        orange: 'stroke-orange-500', // <-- ADDED this line
    };

    return (
        <div className="flex flex-col items-center">
            <h4 className="font-semibold text-gray-600 mb-2 truncate max-w-full px-2 text-center">{title}</h4>
            <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 120 120">
                    {/* Background Circle */}
                    <circle
                        className="text-gray-200"
                        strokeWidth="10"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                    />
                    {/* Progress Circle */}
                    <circle
                        className={colorClasses[color] || 'stroke-gray-500'}
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        fill="transparent"
                        r={radius}
                        cx="60"
                        cy="60"
                        transform="rotate(-90 60 60)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                    {/* Center Text */}
                    <text
                        className="text-2xl font-bold text-gray-800"
                        x="50%"
                        y="50%"
                        dy=".3em"
                        textAnchor="middle"
                        fill="currentColor"
                    >
                        {label}
                    </text>
                </svg>
            </div>
        </div>
    );
};

export default DonutChart;