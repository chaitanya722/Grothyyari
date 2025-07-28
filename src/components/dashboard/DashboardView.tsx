import React from 'react';
import { Calendar, Users, Star, TrendingUp, Clock, DollarSign } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const stats = [
    { label: 'Total Sessions', value: '24', change: '+12%', icon: Calendar, color: 'bg-blue-500' },
    { label: 'Active Connections', value: '156', change: '+8%', icon: Users, color: 'bg-green-500' },
    { label: 'Average Rating', value: '4.8', change: '+0.2', icon: Star, color: 'bg-yellow-500' },
    { label: 'Total Earnings', value: '$1,240', change: '+15%', icon: DollarSign, color: 'bg-purple-500' }
  ];

  const recentActivities = [
    { type: 'session', message: 'Session with Sarah Johnson completed', time: '2 hours ago' },
    { type: 'review', message: 'New 5-star review from Mike Chen', time: '4 hours ago' },
    { type: 'booking', message: 'New session booking from Emily Rodriguez', time: '1 day ago' },
    { type: 'connection', message: 'Alex Thompson started following you', time: '2 days ago' }
  ];

  const upcomingSessions = [
    { expert: 'Sarah Johnson', topic: 'UX Design Review', time: 'Today, 2:00 PM', price: '$75' },
    { expert: 'Mike Chen', topic: 'Product Strategy', time: 'Tomorrow, 10:00 AM', price: 'Free' },
    { expert: 'Emily Rodriguez', topic: 'Marketing Strategy', time: 'Jan 23, 3:00 PM', price: '$50' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 sm:py-8">
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-sm sm:text-base text-gray-600">Welcome back! Here's what's happening with your professional network.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-3 sm:p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 sm:p-3 rounded-xl ${stat.color}`}>
                <stat.icon className="h-4 sm:h-6 w-4 sm:w-6 text-white" />
              </div>
              <span className="text-xs sm:text-sm font-medium text-green-600">{stat.change}</span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'session' ? 'bg-blue-500' :
                    activity.type === 'review' ? 'bg-yellow-500' :
                    activity.type === 'booking' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h3>
          <div className="space-y-4">
            {upcomingSessions.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Clock className="h-5 w-5 text-gray-500" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-medium text-gray-900">{session.topic}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">with {session.expert}</p>
                    <p className="text-xs text-gray-500">{session.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-medium text-gray-900">{session.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Chart Placeholder */}
      <div className="mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
        <div className="h-48 sm:h-64 bg-gray-50 rounded-xl flex items-center justify-center">
          <div className="text-center">
            <TrendingUp className="h-8 sm:h-12 w-8 sm:w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm sm:text-base text-gray-600">Performance charts will be displayed here</p>
          </div>
        </div>
      </div>
    </div>
  );
};