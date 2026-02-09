
import React from 'react';
import { storage } from '../services/storageService';
import { Users, Ticket, TrendingUp, Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard: React.FC = () => {
  const bookings = storage.getBookings();
  const users = storage.getUsers();
  const sites = storage.getSites();

  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.status === 'Confirmed' ? curr.totalAmount : 0), 0);
  
  // Create data for Visitor Flow Trend
  const visitorFlowData = [
    { slot: '08-10', visitors: bookings.filter(b => b.timeSlot.includes('08:00')).length },
    { slot: '10-12', visitors: bookings.filter(b => b.timeSlot.includes('10:00')).length },
    { slot: '12-14', visitors: bookings.filter(b => b.timeSlot.includes('12:00')).length },
    { slot: '14-16', visitors: bookings.filter(b => b.timeSlot.includes('02:00')).length },
    { slot: '16-18', visitors: bookings.filter(b => b.timeSlot.includes('04:00')).length },
  ];

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: "Today's Bookings", value: bookings.filter(b => b.status === 'Confirmed').length, icon: Ticket, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Managed Sites', value: sites.length, icon: Clock, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? user.username : 'Unknown User';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Manager Overview</h1>
        <p className="text-gray-500">Monitor system performance and real-time site analytics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center space-x-4">
            <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-7 h-7 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visitor Flow Trend Chart */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm mb-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Visitor Flow Trend</h3>
            <p className="text-sm text-gray-400">Peak hours and crowd density patterns</p>
          </div>
          <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full flex items-center">
            <span className="w-2 h-2 bg-amber-500 rounded-full mr-2 animate-pulse"></span>
            LIVE ANALYTICS
          </span>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visitorFlowData}>
              <defs>
                <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="slot" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
              />
              <Tooltip 
                contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
              />
              <Area 
                type="monotone" 
                dataKey="visitors" 
                stroke="#d97706" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorVisitors)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent User Bookings Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Recent User Bookings</h3>
          <button className="text-sm font-bold text-amber-600 hover:text-amber-700 transition-colors">View All Bookings</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Ref ID</th>
                <th className="px-8 py-5">User</th>
                <th className="px-8 py-5">Site</th>
                <th className="px-8 py-5">Slot</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium">
                    No bookings recorded yet
                  </td>
                </tr>
              ) : (
                bookings.slice().reverse().map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-5 font-mono text-xs text-gray-500">#{booking.id}</td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mr-3 text-amber-700 font-bold text-xs">
                          {getUserName(booking.userId).charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{getUserName(booking.userId)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-600 font-medium">{booking.siteName}</td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{booking.timeSlot.split(' ')[0]}</span>
                        <span className="text-[10px] text-gray-400 font-bold">{new Date(booking.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-gray-900 text-sm">₹{booking.totalAmount}</span>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                        booking.status === 'Confirmed' 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                      }`}>
                        {booking.status === 'Confirmed' ? (
                          <CheckCircle className="w-3 h-3 mr-1.5" />
                        ) : (
                          <XCircle className="w-3 h-3 mr-1.5" />
                        )}
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
