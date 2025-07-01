import React from 'react';
import { TrendingUp, TrendingDown, Users, Calendar, Building2, Truck, UserCheck, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { mockDashboardStats, mockEvents, mockSocieties } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ComponentType<any>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon }) => {
  const isPositive = change >= 0;
  
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center mt-1 sm:mt-2">
              {isPositive ? (
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 mr-1" />
              )}
              <span className={`text-xs sm:text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(change)}%
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1 hidden sm:inline">vs last month</span>
            </div>
          </div>
          <div className="p-2 sm:p-3 bg-blue-50 rounded-full flex-shrink-0 ml-4">
            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const stats = mockDashboardStats;

  const getWelcomeMessage = () => {
    const role = user?.role.replace('_', ' ');
    return `Welcome back, ${user?.name}!`;
  };

  const getStatsForRole = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { title: 'Total Events', value: stats.totalEvents, change: 15.2, icon: Calendar },
          { title: 'Active Events', value: stats.activeEvents, change: 8.1, icon: Calendar },
          { title: 'Societies', value: stats.totalSocieties, change: 12.5, icon: Building2 },
          { title: 'Vendors', value: stats.totalVendors, change: 6.7, icon: Truck },
          { title: 'Exhibitors', value: stats.totalExhibitors, change: 18.3, icon: UserCheck },
          { title: 'Monthly Revenue', value: `₹${(stats.monthlyRevenue / 100000).toFixed(1)}L`, change: stats.revenueGrowth, icon: DollarSign },
        ];
      case 'admin':
        return [
          { title: 'City Events', value: 23, change: 12.5, icon: Calendar },
          { title: 'Active Events', value: 8, change: 8.1, icon: Calendar },
          { title: 'City Societies', value: 12, change: 6.7, icon: Building2 },
          { title: 'City Revenue', value: '₹3.2L', change: 15.2, icon: DollarSign },
        ];
      default:
        return [
          { title: 'My Events', value: 5, change: 10.0, icon: Calendar },
          { title: 'Active Tasks', value: 12, change: 5.5, icon: Users },
          { title: 'Completed', value: 28, change: 20.1, icon: UserCheck },
          { title: 'Revenue', value: '₹85K', change: 8.3, icon: DollarSign },
        ];
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{getWelcomeMessage()}</h1>
          <p className="text-sm sm:text-base text-gray-600 capitalize">
            {user?.role.replace('_', ' ')} Dashboard
            {user?.city && ` - ${user.city}`}
          </p>
        </div>
        <div className="text-xs sm:text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {getStatsForRole().map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Events */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Events</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {mockEvents.slice(0, 3).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{event.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-600">{event.date} • {event.venue}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">{event.attendees} attendees</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'published' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Societies */}
        <Card>
          <CardHeader>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Top Performing Societies</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {mockSocieties.slice(0, 3).map((society) => (
                <div key={society.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-gray-900 text-sm sm:text-base truncate">{society.name}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">{society.location}</p>
                  </div>
                  <div className="text-right ml-4 flex-shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900">₹{(society.totalRevenue / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-gray-600">{society.activeEvents} active events</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link to="/events/create" className="block">
              <div className="p-3 sm:p-4 text-center bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200 cursor-pointer">
                <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600 mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-medium text-blue-900">Create Event</span>
              </div>
            </Link>
            
            <Link to="/societies/add" className="block">
              <div className="p-3 sm:p-4 text-center bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 cursor-pointer">
                <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-medium text-green-900">Add Society</span>
              </div>
            </Link>
            
            <Link to="/vendors" className="block">
              <div className="p-3 sm:p-4 text-center bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 cursor-pointer">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600 mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-medium text-purple-900">Manage Vendors</span>
              </div>
            </Link>
            
            <Link to="/reports" className="block">
              <div className="p-3 sm:p-4 text-center bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors duration-200 cursor-pointer">
                <UserCheck className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600 mx-auto mb-2" />
                <span className="text-xs sm:text-sm font-medium text-orange-900">View Reports</span>
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};