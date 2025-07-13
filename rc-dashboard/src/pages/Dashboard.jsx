import React, { useRef, useState } from 'react';
import CoreVitals from '../components/CoreVitals';
import SessionInfo from '../components/SessionInfo';
import InputDisplay from '../components/InputDisplay';
import Odometer from '../components/Odometer';
import VideoFeed from '../components/VideoFeed';
import SessionTimer from '../components/SessionTimer';

const RacingDashboardBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
    {/* Animated racing lines */}
    {[...Array(16)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-full bg-gradient-to-b from-pink-500/40 to-blue-500/0 animate-race-line"
        style={{
          left: `${(i * 6) + 3}%`,
          animationDelay: `${i * 0.18}s`,
          animationDuration: `${2.2 + (i % 4) * 0.4}s`
        }}
      />
    ))}
    {/* Neon glow at the bottom */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[90vw] h-40 bg-gradient-to-t from-blue-700/60 to-transparent rounded-full blur-2xl opacity-80" />
    {/* Racing car SVG */}
    <svg className="absolute bottom-8 right-8 w-24 h-12 opacity-70 animate-slide-in" viewBox="0 0 80 32" fill="none">
      <rect x="10" y="18" width="60" height="8" rx="4" fill="#7f5cff" fillOpacity="0.3" />
      <ellipse cx="20" cy="28" rx="6" ry="4" fill="#fff" fillOpacity="0.2" />
      <ellipse cx="60" cy="28" rx="6" ry="4" fill="#fff" fillOpacity="0.2" />
      <rect x="30" y="10" width="20" height="10" rx="4" fill="#f472b6" fillOpacity="0.4" />
    </svg>
  </div>
);

const DashboardPage = ({ data, user, onShowAdmin, onLogout, onSessionEnd }) => {
  const MAX_SPEED = 280;
  const dashboardRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFullscreen = () => {
    const elem = dashboardRef.current;
    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen change to update state
  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  return (
    <div ref={dashboardRef} className="w-full h-full bg-dash-bg relative overflow-hidden">
      <RacingDashboardBackground />
      {/* Header with user info and navigation */}
      <div className="bg-gray-800/80 border-b border-blue-700/40 p-4 relative z-10 shadow-lg">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest drop-shadow-[0_2px_16px_rgba(127,92,255,0.7)] animate-pulse-glow">RC Car Dashboard</h1>
              <p className="text-blue-200 text-sm font-semibold tracking-wide">Welcome, <span className="text-pink-300 font-bold">{user?.username}</span></p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleFullscreen}
              className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white rounded-lg font-bold shadow-lg hover:from-yellow-500 hover:to-pink-600 transition-colors flex items-center"
              title={isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l-2-2m0 0V7a2 2 0 012-2h2m-4 4l4-4m6 6l2 2m0 0v2a2 2 0 01-2 2h-2m4-4l-4 4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 mr-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m0 8v2a2 2 0 01-2 2h-2m-8 0H6a2 2 0 01-2-2v-2" />
                </svg>
              )}
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            </button>
            <button
              onClick={onShowAdmin}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-bold shadow-lg hover:from-blue-600 hover:to-purple-700 transition-colors animate-pulse-glow"
            >
              Admin Panel
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-red-600 text-white rounded-lg font-bold shadow-lg hover:from-pink-600 hover:to-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      {/* Main dashboard content */}
      <div className="p-4 grid grid-cols-[1fr_3fr_1fr] grid-rows-[2fr_1fr] gap-4 text-dash-text relative z-10">
        {/* --- LEFT COLUMN --- */}
        <div className="col-span-1 row-span-2 flex flex-col gap-4">
          <InputDisplay acceleration={data.acceleration} braking={data.braking} />
          <SessionTimer onSessionEnd={onSessionEnd} />
        </div>
        {/* --- CENTER COLUMN (TOP) --- */}
        <div className="col-start-2 row-start-1 flex items-center justify-center">
          <div className="rounded-2xl shadow-2xl bg-gradient-to-br from-blue-900/60 to-purple-900/40 p-2 animate-pulse-glow">
            <VideoFeed />
          </div>
        </div>
        {/* --- CENTER COLUMN (BOTTOM) --- */}
        <div className="col-start-2 row-start-2 flex items-center justify-center">
          <div className="rounded-2xl shadow-xl bg-gradient-to-br from-pink-900/40 to-blue-900/20 p-2 animate-fade-in">
            <CoreVitals speed={data.speed} gear={data.gear} rpm={data.rpm} />
          </div>
        </div>
        {/* --- RIGHT COLUMN --- */}
        <div className="col-span-1 row-span-2 flex flex-col gap-4">
          <Odometer speed={data.speed} maxSpeed={MAX_SPEED} />
          <SessionInfo isTurboActive={data.isTurboActive} />
        </div>
      </div>
      {/* Funky racing footer */}
      <div className="absolute bottom-0 left-0 w-full text-center py-2 z-10 pointer-events-none">
        <span className="text-xs text-blue-200/70 tracking-widest font-mono animate-fade-in">Feel the speed. Race your best lap!</span>
      </div>
    </div>
  );
};

export default DashboardPage;