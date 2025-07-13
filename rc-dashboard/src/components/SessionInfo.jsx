import React from 'react';

const InfoRow = ({ label, value, valueClass = 'text-white' }) => (
    <div className="flex justify-between items-baseline border-b border-dash-bg pb-1">
        <span className="text-sm font-semibold text-dash-text-muted">{label}</span>
        <span className={`font-mono text-xl font-bold ${valueClass}`}>{value}</span>
    </div>
);

// This component now receives the turbo status as a prop
const SessionInfo = ({ isTurboActive }) => {
  return (
    <div className="h-full bg-dash-bg-light p-4 rounded-lg flex flex-col gap-4">
        <InfoRow label="LAP / LOSS" value="+0.00" valueClass="text-optimal" />
        <InfoRow label="ACTUAL TIME" value="01:35.02" />
        
        {/* New Turbo Status Row */}
        <InfoRow 
          label="TURBO" 
          value={isTurboActive ? 'ACTIVE' : 'INACTIVE'} 
          valueClass={isTurboActive ? 'text-danger animate-pulse' : 'text-dash-text-muted'} 
        />
        
        <div className="flex-grow"></div>
        <div className="text-center text-dash-text-muted font-bold">SESSION TIME: 01:23:45</div>
    </div>
  );
};

export default SessionInfo;