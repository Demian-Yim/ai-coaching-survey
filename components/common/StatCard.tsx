
import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
    return (
        <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg text-center border border-slate-700/50">
            <h3 className="text-lg text-slate-400 mb-2">{title}</h3>
            <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">{value}</p>
        </div>
    );
};

export default StatCard;