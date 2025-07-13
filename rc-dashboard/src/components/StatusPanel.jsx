import React from 'react';

const StatusItem = ({ label, value, unit }) => (
    <div className="flex flex-col items-center p-3 w-40 rounded-2xl bg-[rgba(30,39,73,0.5)] transition-transform hover:-translate-y-1 hover:bg-[rgba(77,208,225,0.1)]">
        <div className="text-2xl font-bold text-primary shadow-glow-primary">{value}</div>
        <div className="mt-1 text-xs tracking-wider uppercase text-text-secondary">{label}{unit && ` (${unit})`}</div>
    </div>
);

const StatusPanel = ({ speed, acceleration, isBraking }) => (
    <div className="flex justify-around p-4 rounded-2xl border border-white/10 bg-gradient-to-b from-bg-light to-[#151b33] shadow-lg">
        <StatusItem label="Speed" value={speed.toFixed(0)} unit="km/h" />
        <StatusItem label="Accel" value={acceleration.toFixed(1)} unit="m/s²" />
        <StatusItem label="Brake" value={isBraking ? 'ON' : 'OFF'} />
    </div>
);

export default StatusPanel;