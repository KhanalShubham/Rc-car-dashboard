import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';

const racingColors = ['#7f5cff', '#3b82f6', '#f472b6', '#22d3ee', '#facc15'];

const AdminDashboard = ({ onBack }) => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users?page=${currentPage}&limit=100`);
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
        setTotalPages(result.pagination.totalPages);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/users/stats');
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const response = await fetch(`http://localhost:3001/api/users/${userId}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (result.success) {
        fetchUsers();
        fetchStats();
      }
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // --- Chart Data Processing ---
  // Age distribution (grouped by 5-year bins)
  const ageBins = Array.from({ length: 12 }, (_, i) => ({
    name: `${i * 5 + 10}-${i * 5 + 14}`,
    count: 0
  }));
  users.forEach(u => {
    const bin = Math.floor((u.age - 10) / 5);
    if (bin >= 0 && bin < ageBins.length) ageBins[bin].count++;
  });

  // Gender split
  const genderData = [
    { name: 'Male', value: users.filter(u => u.sex === 'male').length },
    { name: 'Female', value: users.filter(u => u.sex === 'female').length }
  ];

  // Average rating over time (by registration date)
  const ratingByDate = {};
  users.forEach(u => {
    const date = formatDate(u.createdAt);
    if (!ratingByDate[date]) ratingByDate[date] = { date, total: 0, count: 0 };
    ratingByDate[date].total += u.rating || 0;
    ratingByDate[date].count++;
  });
  const ratingLineData = Object.values(ratingByDate).map(d => ({
    date: d.date,
    avg: d.count ? (d.total / d.count).toFixed(2) : 0
  })).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Sort users by drivingDuration ascending (lowest first)
  const sortedUsers = [...users].sort((a, b) => (a.drivingDuration || 0) - (b.drivingDuration || 0));

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 overflow-y-auto" style={{ maxHeight: '100vh' }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-widest text-white drop-shadow-[0_2px_16px_rgba(127,92,255,0.7)]">Admin Dashboard</h1>
        <button
          onClick={onBack}
          className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-lg"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Racing-Themed Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Age Distribution */}
        <div className="bg-gradient-to-br from-[#1a1446] to-[#7f5cff33] rounded-2xl p-6 shadow-xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 text-blue-300 tracking-wide">Age Distribution</h3>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={ageBins} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#fff" fontSize={14} tickLine={false} axisLine={false} />
              <YAxis stroke="#fff" fontSize={14} tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#1a1446', border: 'none', color: '#fff' }} />
              <Bar dataKey="count" fill="#7f5cff" radius={[8, 8, 0, 0]}>
                {ageBins.map((_, i) => (
                  <Cell key={i} fill={racingColors[i % racingColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        {/* Gender Split */}
        <div className="bg-gradient-to-br from-[#1a1446] to-[#3b82f633] rounded-2xl p-6 shadow-xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 text-pink-300 tracking-wide">Gender Split</h3>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={genderData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={60} label>
                {genderData.map((entry, i) => (
                  <Cell key={i} fill={racingColors[i % racingColors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1446', border: 'none', color: '#fff' }} />
              <Legend iconType="circle" wrapperStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {/* Average Rating Over Time */}
        <div className="bg-gradient-to-br from-[#1a1446] to-[#f472b633] rounded-2xl p-6 shadow-xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 text-yellow-300 tracking-wide">Avg. Rating Over Time</h3>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={ratingLineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis dataKey="date" stroke="#fff" fontSize={14} tickLine={false} axisLine={false} />
              <YAxis stroke="#fff" fontSize={14} tickLine={false} axisLine={false} domain={[1, 5]} allowDecimals={true} />
              <Tooltip contentStyle={{ background: '#1a1446', border: 'none', color: '#fff' }} />
              <Line type="monotone" dataKey="avg" stroke="#facc15" strokeWidth={4} dot={{ r: 6, fill: '#facc15' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Total Users</h3>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Average Age</h3>
            <p className="text-3xl font-bold">{Math.round(stats.averageAge || 0)}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Average Rating</h3>
            <p className="text-3xl font-bold">{stats.averageRating?.toFixed(1) || '0.0'}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Male Users</h3>
            <p className="text-3xl font-bold">{stats.maleCount}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-gray-400 text-sm">Female Users</h3>
            <p className="text-3xl font-bold">{stats.femaleCount}</p>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
            <thead style={{ display: 'table', width: '100%', tableLayout: 'fixed' }} className="bg-gray-700">
              <tr style={{ display: 'table', width: '100%', tableLayout: 'fixed' }}>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Age</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Sex</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody
              style={{
                display: 'block',
                maxHeight: '320px',
                overflowY: 'auto',
                width: '100%'
              }}
              className="divide-y divide-gray-700 custom-scrollbar"
            >
              {sortedUsers.map((user) => (
                <tr key={user._id} style={{ display: 'table', width: '100%', tableLayout: 'fixed' }} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{user.username}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{user.age}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.sex === 'male' ? 'bg-blue-500/20 text-blue-300' : 'bg-pink-500/20 text-pink-300'
                    }`}>
                      {user.sex}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-yellow-400 mr-1">★</span>
                      <span className="text-sm">{user.rating || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{formatDuration(user.drivingDuration)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">{formatDate(user.createdAt)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 