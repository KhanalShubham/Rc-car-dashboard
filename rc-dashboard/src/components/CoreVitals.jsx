import React from 'react';

const RevLight = ({ color }) => <div className={`w-8 h-4 rounded ${color}`} />;

const CoreVitals = ({ speed, gear, rpm }) => {
  const getRevColor = (step) => {
    const rpmPercent = (rpm / 8000) * 10;
    if (rpmPercent > 9) return 'bg-safe'; // Blue
    if (rpmPercent > step) {
      return rpmPercent > 7.5 ? 'bg-danger' : 'bg-optimal';
    }
    return 'bg-dash-bg-light';
  };

  return (
    <div className="h-full bg-dash-bg-light p-4 rounded-lg flex flex-col justify-between items-center">
        {/* Rev Lights */}
      <div className="flex gap-2">
        {[...Array(5)].map((_, i) => <RevLight key={i} color={getRevColor(i + 3)} />)}
        <div className="w-4" />
        {[...Array(5)].map((_, i) => <RevLight key={i} color={getRevColor(i + 8)} />)}
      </div>

      {/* Gear and Speed */}
      <div className="flex items-center justify-center gap-8 w-full">
        <div className="flex flex-col items-center">
            <span className="font-mono text-9xl text-optimal">{gear}</span>
            <span className="text-lg font-semibold text-dash-text-muted -mt-2">GEAR</span>
        </div>
        <div className="flex flex-col items-center">
            <span className="font-mono text-9xl">{speed}</span>
            <span className="text-lg font-semibold text-dash-text-muted -mt-2">KM/H</span>
        </div>
      </div>
      
      <div className="h-4" /> {/* Spacer */}
    </div>
  );
};

export default CoreVitals;