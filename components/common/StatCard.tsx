
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-lg text-slate-500 mb-2">{title}</h3>
            <p className="text-4xl font-bold text-blue-600">{value}</p>
        </div>
    );
};

export default StatCard;
