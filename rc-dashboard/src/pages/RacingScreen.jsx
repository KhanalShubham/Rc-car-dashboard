import React, { useEffect, useState } from 'react';

const RacingScreen = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const progressTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressTimer);
                    setTimeout(onComplete, 500); 
                    return 100;
                }
                return prev + 1;
            });
        }, 20);
        return () => clearInterval(progressTimer);
    }, [onComplete]);

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white relative">
            <h1 className="text-5xl font-bold mb-4">RC Dashboard</h1>
            <p className="text-xl text-gray-400 mb-8">Connecting to vehicle...</p>
            <div className="w-1/3 bg-gray-700 rounded-full h-4">
                <div
                    className="bg-blue-600 h-4 rounded-full transition-all duration-150 ease-linear"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <p className="mt-4 text-lg">{progress}%</p>
        </div>
    );
};

export default RacingScreen;