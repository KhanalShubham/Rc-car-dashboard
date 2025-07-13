import React, { useState, useEffect } from 'react';
import UserRegistration from './pages/UserRegistration';
import RacingScreen from './pages/RacingScreen';
import DashboardPage from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import FeedbackForm from './components/FeedbackForm';

function App() {
  const [currentView, setCurrentView] = useState('registration'); // registration, racing, dashboard, admin, feedback
  const [user, setUser] = useState(null);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [carData, setCarData] = useState({
    speed: 0,
    gear: 'N',
    rpm: 800,
    acceleration: 0,
    braking: 0,
    isTurboActive: false,
    tires: [
      { temp: 70, pressure: 25.0 }, { temp: 70, pressure: 25.0 },
      { temp: 70, pressure: 25.0 }, { temp: 70, pressure: 25.0 },
    ],
  });

  // Check for existing user on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
  }, []);

  // Data Simulation Engine
  useEffect(() => {
    const gearRatios = [0, 2.97, 2.04, 1.45, 1.0, 0.75]; 
    const maxRpm = 8000;
    const idleRpm = 800;

    const interval = setInterval(() => {
      setCarData(prev => {
        let { speed, rpm, gear } = prev;
        const gas_input = Math.random();
        const brake_input = speed > 5 && Math.random() > 0.95 ? Math.random() : 0;

        if (brake_input > 0.1) {
          speed -= speed * 0.05 * brake_input;
          rpm -= (rpm - idleRpm) * 0.1;
        } else {
          if (gear === 'N') {
            rpm = idleRpm + (maxRpm - idleRpm) * gas_input;
          } else {
            const gearIndex = parseInt(gear);
            rpm += (gas_input * 200) - (rpm / maxRpm * 100) - 50;
            if (rpm < idleRpm) rpm = idleRpm;
            speed = (rpm / gearRatios[gearIndex]) * 0.035;
            if (rpm > maxRpm * 0.8 && gearIndex < 5) {
              gear = (gearIndex + 1).toString();
              rpm *= 0.7;
            }
          }
        }
        
        const gearIndex = parseInt(gear);
        if (speed < (rpm / gearRatios[gearIndex]) * 0.025 && gearIndex > 1) {
            gear = (gearIndex - 1).toString();
        }

        if (speed < 5 && brake_input === 0) gear = 'N';
        if (speed < 1) speed = 0;

        const newTires = prev.tires.map(tire => ({
            ...tire,
            temp: 70 + (speed / 300) * 30 + (Math.random() - 0.5) * 2
        }));

        const isTurboActive = gear !== 'N' && gas_input > 0.8 && brake_input < 0.1;
        
        return {
          ...prev,
          speed: Math.floor(speed),
          rpm: Math.floor(rpm),
          gear,
          acceleration: Math.max(0, gas_input - brake_input),
          braking: brake_input,
          isTurboActive,
          tires: newTires,
        };
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

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
    switch (currentView) {
      case 'registration':
        return <UserRegistration onUserRegistered={handleUserRegistered} />;
      
      case 'racing':
        return <RacingScreen onComplete={handleRacingComplete} />;
      
      case 'dashboard':
        return (
          <DashboardPage 
            data={carData} 
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