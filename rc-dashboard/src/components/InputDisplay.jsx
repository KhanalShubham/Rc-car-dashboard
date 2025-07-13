import React from 'react';
import { motion } from 'framer-motion';

const Bar = ({ percentage, color }) => (
  <div className="w-full h-6 bg-dash-bg rounded overflow-hidden">
    <motion.div
      className={`h-full ${color}`}
      initial={{ width: 0 }}
      animate={{ width: `${percentage * 100}%` }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    />
  </div>
);

const InputDisplay = ({ acceleration, braking }) => {
  return (
    <div className="h-full bg-dash-bg-light p-4 rounded-lg flex items-center justify-around gap-4">
        <div className="w-1/3 space-y-2">
            <h3 className="font-bold text-center text-dash-text-muted">ACCEL</h3>
            <Bar percentage={acceleration} color="bg-optimal" />
        </div>
        <div className="w-1/3 space-y-2">
            <h3 className="font-bold text-center text-dash-text-muted">BRAKE</h3>
            <Bar percentage={braking} color="bg-danger" />
        </div>
    </div>
  );
};

export default InputDisplay;