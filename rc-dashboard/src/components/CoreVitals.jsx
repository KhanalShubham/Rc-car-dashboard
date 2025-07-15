import React from 'react';

const RevLight = ({ color }) => <div className={`w-8 h-4 rounded ${color}`} />;

const CoreVitals = ({ speed, gear, rpm }) => {
    const getRevColor = (step) => {
        const rpmPercent = (rpm / 8000) * 10;
        if (rpmPercent > 9) return 'bg-blue-500'; 
        if (rpmPercent > step) {
            return rpmPercent > 7.5 ? 'bg-red-500' : 'bg-green-500';
        }
        return 'bg-gray-700';
    };

    return (
        <div className="h-full bg-gray-800/50 p-4 rounded-lg flex flex-col justify-between items-center border border-white/10">
            {/* Rev Lights */}
            <div className="flex gap-2">
                {[...Array(10)].map((_, i) => <RevLight key={i} color={getRevColor(i)} />)}
            </div>

            {/* Gear and Speed */}
            <div className="flex items-end justify-center gap-8 w-full text-white">
                <div className="text-center">
                    <span className="font-mono text-9xl text-green-400">{gear}</span>
                    <p className="text-lg font-semibold text-gray-400 -mt-4">GEAR</p>
                </div>
                <div className="text-center">
                    <span className="font-mono text-9xl">{speed}</span>
                    <p className="text-lg font-semibold text-gray-400 -mt-4">KM/H</p>
                </div>
            </div>
            
            <div className="h-4" /> {/* Spacer */}
        </div>
    );
};

export default CoreVitals;