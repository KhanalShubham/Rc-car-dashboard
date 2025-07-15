import React, { useState, useEffect, useMemo } from 'react';
import useWebSocket from 'react-use-websocket';

// Import your page components
import UserRegistration from './pages/UserRegistration';
import RacingScreen from './pages/RacingScreen';
import DashboardPage from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackForm from './components/FeedbackForm';

// --- Configuration ---
const WEBSOCKET_URL = 'ws://192.168.16.101:8765'; // IMPORTANT: Use your Pi's IP
const MAX_SPEED_KMH = 80;
const IDLE_RPM = 800;
const MAX_RPM = 8000;
const PWM_NEUTRAL = 1500;
const PWM_MAX = 2000;

function App() {
  const [currentView, setCurrentView] = useState('registration'); // registration, racing, dashboard, admin, feedback
  const [user, setUser] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);

  // The carData state now has a simpler structure, fed by the websocket
  const [carData, setCarData] = useState({
    speed: 0,
    gear: 'N',
    rpm: IDLE_RPM,
    gas: 0,       // Renamed from 'acceleration' to match incoming data
    brake: 0,     // Renamed from 'braking' to match incoming data
    isTurboActive: false,
    // Tire data is no longer simulated here, you can add that logic back if needed
  });

  // --- WebSocket Connection ---
  // This hook receives the live data from the Raspberry Pi
  const { lastJsonMessage } = useWebSocket(WEBSOCKET_URL, {
    onOpen: () => console.log('✅ WebSocket connected to RC Car'),
    onClose: () => console.log('❌ WebSocket disconnected'),
    shouldReconnect: (closeEvent) => true, // Automatically try to reconnect
  });

  // This effect runs whenever a new message is received from the WebSocket
  useEffect(() => {
    if (lastJsonMessage) {
      // Update the state with the real data from the car
      setCarData(prevData => ({
        ...prevData, // Keep other state properties like isTurboActive
        gas: lastJsonMessage.gas,
        brake: lastJsonMessage.brake,
        gear: lastJsonMessage.gear,
        // We will calculate speed and rpm from the 'motor' value below
        motor: lastJsonMessage.motor 
      }));
    }
  }, [lastJsonMessage]);

  // --- Derived State Calculation ---
  // These memos calculate speed and rpm from the raw 'motor' PWM value
  const speed = useMemo(() => {
    if (!carData.motor || carData.motor <= PWM_NEUTRAL) return 0;
    const speedRatio = (carData.motor - PWM_NEUTRAL) / (PWM_MAX - PWM_NEUTRAL);
    return Math.floor(speedRatio * MAX_SPEED_KMH);
  }, [carData.motor]);

  const rpm = useMemo(() => {
    if (!carData.motor || carData.motor <= PWM_NEUTRAL) return IDLE_RPM;
    const motorRatio = (carData.motor - PWM_NEUTRAL) / (PWM_MAX - PWM_NEUTRAL);
    return Math.floor(IDLE_RPM + motorRatio * (MAX_RPM - IDLE_RPM));
  }, [carData.motor]);

  // Check for existing user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);
  
  // NOTE: The entire "Data Simulation Engine" useEffect has been removed.

  // --- View Handlers (No changes needed here) ---
  const handleUserRegistered = (userData) => {
    setUser(userData);
    setCurrentView('racing');
  };

  const handleRacingComplete = () => {
    setCurrentView('dashboard');
  };

  const handleShowAdmin = () => {
    setCurrentView('admin');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setCurrentView('registration');
  };

  const handleSessionEnd = (duration) => {
    setSessionDuration(duration);
    setCurrentView('feedback');
  };

  const handleFeedbackComplete = () => {
    setCurrentView('dashboard');
  };

  const handleFeedbackSkip = () => {
    setCurrentView('dashboard');
  };

  const renderCurrentView = () => {
    // Combine live data with calculated data for the dashboard
    const displayData = {
      ...carData,
      speed: speed,
      rpm: rpm,
      acceleration: carData.gas, // map gas back to acceleration for the component
      braking: carData.brake,
      isTurboActive: carData.gas > 0.9 // Simple turbo simulation
    };

    switch (currentView) {
      case 'registration':
        return <UserRegistration onUserRegistered={handleUserRegistered} />;
      case 'racing':
        return <RacingScreen onComplete={handleRacingComplete} />;
      case 'dashboard':
        return (
          <DashboardPage 
            data={displayData} 
            user={user}
            onShowAdmin={handleShowAdmin}
            onLogout={handleLogout}
            onSessionEnd={handleSessionEnd}
          />
        );
      case 'admin':
        return <AdminDashboard onBack={handleBackToDashboard} />;
      case 'feedback':
        return (
          <FeedbackForm 
            user={user}
            sessionDuration={sessionDuration}
            onSubmit={handleFeedbackComplete}
            onCancel={handleFeedbackSkip}
          />
        );
      default:
        return <UserRegistration onUserRegistered={handleUserRegistered} />;
    }
  };

  return (
    <div className="w-screen h-screen bg-black">
      <main className="w-full h-full">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;