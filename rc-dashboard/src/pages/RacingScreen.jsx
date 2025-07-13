import React, { useEffect, useState } from 'react';

const RacingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    // Start the animation sequence
    const timer = setTimeout(() => {
      setShowText(true);
    }, 500);

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          setTimeout(() => {
            onComplete();
          }, 1000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900 via-purple-900 to-black"></div>
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-1 bg-white/20 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 2 + 1}s`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="text-6xl font-bold text-white mb-4 animate-pulse">
            🏎️
          </div>
          {showText && (
            <div className="space-y-4 animate-fade-in">
              <h1 className="text-4xl font-bold text-white mb-2">
                Ready to Race!
              </h1>
              <p className="text-xl text-gray-300">
                Preparing your dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-80 mx-auto">
          <div className="bg-gray-700 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-white font-semibold">{progress}%</p>
        </div>

        {/* Racing animation */}
        <div className="mt-8 flex justify-center space-x-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Speed lines effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute h-0.5 bg-white/30 animate-ping"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 200 + 100}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 2 + 1}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default RacingScreen; 