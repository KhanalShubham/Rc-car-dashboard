import React, { useState, useEffect, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

import CoreVitals from '../components/CoreVitals'; // Import your new component
import InputDisplay from '../components/InputDisplay';
import VideoFeed from '../components/VideoFeed';
import RacingScreen from '../pages/RacingScreen';

// --- Configuration ---
const WEBSOCKET_URL = 'ws://192.168.16.101:8765'; // CHANGE to your Pi's IP 
const VIDEO_SERVER_URL = 'http://192.168.16.101:8080'; // CHANGE to your Pi's IP
const MAX_SPEED_KMH = 80;
const IDLE_RPM = 800;
const MAX_RPM = 8000;
const PWM_NEUTRAL = 1500;
const PWM_MAX = 2000;

const Dashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [carData, setCarData] = useState({ gas: 0, brake: 0, gear: 'N', motor: PWM_NEUTRAL });

    const { lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
        onOpen: () => console.log('✅ WebSocket connected'),
        onClose: () => console.log('❌ WebSocket disconnected'),
        shouldReconnect: () => true,
    });

    useEffect(() => {
        if (lastJsonMessage) {
            setCarData(lastJsonMessage);
        }
    }, [lastJsonMessage]);

    const speed = useMemo(() => {
        if (carData.motor <= PWM_NEUTRAL) return 0;
        const speedRatio = (carData.motor - PWM_NEUTRAL) / (PWM_MAX - PWM_NEUTRAL);
        return Math.round(speedRatio * MAX_SPEED_KMH);
    }, [carData.motor]);

    const rpm = useMemo(() => {
        if (carData.motor <= PWM_NEUTRAL) return IDLE_RPM;
        const motorRatio = (carData.motor - PWM_NEUTRAL) / (PWM_MAX - PWM_NEUTRAL);
        return Math.round(IDLE_RPM + motorRatio * (MAX_RPM - IDLE_RPM));
    }, [carData.motor]);

    if (isLoading) {
        return <RacingScreen onComplete={() => setIsLoading(false)} />;
    }

    return (
        <div className="min-h-screen bg-black text-white p-4 grid grid-cols-3 grid-rows-3 gap-4 font-sans">
            <div className="col-span-2 row-span-3">
                <VideoFeed serverUrl={VIDEO_SERVER_URL} />
            </div>
            <div className="col-span-1 row-span-2">
                <CoreVitals speed={speed} gear={carData.gear} rpm={rpm} />
            </div>
            <div className="col-span-1 row-span-1">
                <InputDisplay acceleration={carData.gas} braking={carData.brake} />
            </div>
        </div>
    );
};

export default Dashboard;