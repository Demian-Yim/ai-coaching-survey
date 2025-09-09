
import React from 'react';

const Spinner: React.FC = () => {
    return (
        <div className="flex justify-center items-center p-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <p className="ml-4 text-slate-300">AI가 분석 중입니다...</p>
        </div>
    );
};

export default Spinner;