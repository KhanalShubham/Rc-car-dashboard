import React from 'react';
import { motion } from 'framer-motion';

const Bar = ({ percentage, color }) => (
    <div className="w-full h-6 bg-gray-700 rounded overflow-hidden">
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
        <div className="h-full bg-gray-800/50 p-4 rounded-lg flex items-center justify-around gap-4 text-white border border-white/10">
            <div className="w-2/5 space-y-2 text-center">
                <h3 className="font-bold text-gray-400">ACCEL</h3>
                <Bar percentage={acceleration} color="bg-green-500" />
            </div>
            <div className="w-2/5 space-y-2 text-center">
                <h3 className="font-bold text-gray-400">BRAKE</h3>
                <Bar percentage={braking} color="bg-red-500" />
            </div>
        </div>
    );
};

export default InputDisplay;