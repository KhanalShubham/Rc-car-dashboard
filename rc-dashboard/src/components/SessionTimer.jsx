import React, { useState, useEffect } from 'react';

const SessionTimer = ({ onSessionEnd }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, startTime]);

  const startSession = () => {
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const stopSession = () => {
    setIsRunning(false);
    const sessionDuration = Math.floor((Date.now() - startTime) / 1000);
    onSessionEnd(sessionDuration);
  };

  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="text-center">
        <div className="text-3xl font-mono font-bold text-white mb-2">
          {formatTime(time)}
        </div>
        <div className="text-sm text-gray-400 mb-4">
          Session Timer
        </div>
        
        <div className="flex space-x-4">
          {!isRunning ? (
            <button
              onClick={startSession}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={stopSession}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              End Session
            </button>
          )}
        </div>
        
        {isRunning && (
          <div className="mt-4">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.min((time / (60 * 1000)) * 100, 100)}%` 
                }}
              ></div>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Session in progress...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionTimer; 