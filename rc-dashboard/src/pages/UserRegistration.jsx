import React, { useState } from 'react';
import axios from 'axios';

const RacingBackground = () => (
  <div className="absolute inset-0 overflow-hidden z-0">
    {/* Animated racing lines */}
    {[...Array(18)].map((_, i) => (
      <div
        key={i}
        className="absolute w-1 h-full bg-gradient-to-b from-blue-500/60 to-purple-700/0 animate-race-line"
        style={{
          left: `${(i * 6) + 5}%`,
          animationDelay: `${i * 0.2}s`,
          animationDuration: `${2 + (i % 3) * 0.5}s`
        }}
      />
    ))}
    {/* Neon glow at the bottom */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80vw] h-32 bg-gradient-to-t from-purple-700/60 to-transparent rounded-full blur-2xl opacity-80" />
    {/* Racing flag icon */}
    <svg className="absolute top-8 right-8 w-16 h-16 opacity-60 animate-spin-slow" viewBox="0 0 64 64" fill="none">
      <rect x="2" y="2" width="60" height="60" rx="12" fill="#fff" fillOpacity="0.05" />
      <path d="M16 16h8v8h-8zM32 16h8v8h-8zM16 32h8v8h-8zM32 32h8v8h-8z" fill="#fff" fillOpacity="0.2" />
    </svg>
  </div>
);

const UserRegistration = ({ onUserRegistered }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    sex: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3001/api/users', formData);
      const result = response.data;
      if (result.success) {
        localStorage.setItem('currentUser', JSON.stringify(result.data));
        onUserRegistered(result.data);
      } else {
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative bg-gradient-to-br from-[#0f1021] via-[#1a1446] to-[#2d0b4e] overflow-hidden">
      <RacingBackground />
      <div className="relative z-10 w-full max-w-md p-10 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl animate-fade-in" style={{boxShadow: '0 0 40px 10px #7f5cff55, 0 0 0 2px #fff2'}}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-widest drop-shadow-[0_2px_16px_rgba(127,92,255,0.7)] animate-pulse-glow">RC Car Dashboard</h1>
          <p className="text-lg text-purple-200 font-medium tracking-wide">Enter your details to start racing</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-white text-sm font-bold mb-2 tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-inner"
              placeholder="Enter your full name"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2 tracking-wide">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-inner"
              placeholder="Enter your email"
              autoComplete="off"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2 tracking-wide">
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="1"
              max="120"
              className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-inner"
              placeholder="Enter your age"
            />
          </div>
          <div>
            <label className="block text-white text-sm font-bold mb-2 tracking-wide">
              Sex
            </label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-3 bg-white/10 border border-white/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg shadow-inner"
            >
              <option value="" style={{ color: 'black' }}>Select your sex</option>
              <option value="male" style={{ color: 'black' }}>Male</option>
              <option value="female" style={{ color: 'black' }}>Female</option>
            </select>
          </div>
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 animate-fade-in">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 text-white font-extrabold py-3 px-6 rounded-xl text-lg tracking-widest shadow-lg hover:from-blue-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 animate-pulse-glow"
            style={{letterSpacing: '0.15em'}}
          >
            {loading ? 'Starting Your Engine...' : 'Start Racing'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <span className="inline-block text-xs text-purple-300/60 tracking-widest font-mono animate-fade-in">Feel the adrenaline. Race to the top!</span>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;