import React, { useMemo } from 'react';

const Odometer = ({ speed, maxSpeed }) => {
    // The total arc of the speedometer gauge in degrees.
    const ODOMETER_ARC_DEGREES = 270;

    const needleRotation = useMemo(() => {
        // Calculate the angle based on the speed percentage of the total arc.
        // We subtract 135 degrees to offset the start position to the bottom-left.
        const angle = (speed / maxSpeed) * ODOMETER_ARC_DEGREES - 135;

        // Clamp the angle to ensure the needle doesn't go beyond the scale.
        // The valid range is from -135deg to +135deg.
        return Math.max(-135, Math.min(angle, 135));
    }, [speed, maxSpeed]);

    return (
        // Main container for the odometer, styled to be a square with a dark background.
        <div className="relative w-full aspect-square bg-dash-bg-light rounded-lg p-4 flex items-center justify-center">

            {/* A decorative inner border to create the gauge's circular track */}
            <div className="absolute w-[90%] h-[90%] rounded-full border-4 border-dash-bg" />

            {/* The needle element. Its rotation is controlled by an inline style. */}
            <div
                className="absolute w-1 h-1/2 bg-danger origin-bottom z-10 transition-transform duration-200 ease-linear"
                style={{ transform: `rotate(${needleRotation}deg)` }}
            />
            
            {/* The center pivot point for the needle */}
            <div className="absolute w-6 h-6 bg-dash-text rounded-full z-20 border-4 border-dash-bg" />

            {/* The digital speed readout in the center of the gauge */}
            <div className="absolute bottom-1/4 text-center z-10">
                <span className="font-mono text-5xl font-bold text-white">{speed}</span>
                <p className="text-sm font-bold text-dash-text-muted">KM/H</p>
            </div>
        </div>
    );
};

export default Odometer;