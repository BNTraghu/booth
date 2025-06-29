import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, MapPin, Users, Calendar, DollarSign, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { mockSocieties } from '../data/mockData';

export const Societies: React.FC = () => {
  const [societies] = useState(mockSocieties);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredSocieties = societies.filter(society => {
    const matchesFilter = filter === 'all' || society.status === filter;
    const matchesSearch = searchTerm === '' || 
      society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Society Management</h1>
          <p className="text-gray-600">Manage society partnerships and accounts</p>
        </div>
        <Link to="/societies/add">
          <Button className="flex items-center space-x-2 w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            <span>Add Society</span>
          </Button>
        </Link>
      </div>

      {/* Society Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Societies</p>
                <p className="text-2xl font-bold text-gray-900">{societies.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-2xl font-bold text-gray-900">
                  {societies.reduce((sum, s) => sum + s.activeEvents, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Members</p>
                <p className="text-2xl font-bold text-gray-900">
                  {societies.reduce((sum, s) => sum + s.memberCount, 0).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(societies.reduce((sum, s) => sum + s.totalRevenue, 0) / 100000).toFixed(1)}L
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search societies by name, location, or contact person..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {['all', 'active', 'pending', 'inactive'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors duration-200 ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All Societies' : status}
            <span className="ml-1 sm:ml-2 text-xs">
              {status === 'all' ? societies.length : societies.filter(s => s.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Societies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSocieties.map((society) => (
          <Card key={society.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{society.name}</h3>
                <Badge variant={getStatusVariant(society.status)}>
                  {society.status}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{society.location}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{society.memberCount.toLocaleString()} members</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{society.activeEvents} active events</span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-1">
                  {society.facilities.slice(0, 3).map((facility, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                  {society.facilities.length > 3 && (
                    <Badge variant="default" className="text-xs">
                      +{society.facilities.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">₹{society.totalRevenue.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1 hidden sm:inline">revenue</span>
                </div>
                <div className="flex space-x-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Societies Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Societies Overview ({filteredSocieties.length})
            </h3>
            <Button size="sm" variant="outline">
              <Filter className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Advanced Filter</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Society</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead className="hidden md:table-cell">Members</TableHead>
                <TableHead className="hidden lg:table-cell">Active Events</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSocieties.map((society) => (
                <TableRow key={society.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">{society.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{society.location}</span>
                      </div>
                      <div className="text-sm text-gray-500 md:hidden">
                        {society.memberCount.toLocaleString()} members
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{society.contactPerson}</div>
                      <div className="text-sm text-gray-500 truncate">{society.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell font-medium">{society.memberCount.toLocaleString()}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                      {society.activeEvents}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">₹{society.totalRevenue.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(society.status)}>
                      {society.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="hidden sm:inline-flex">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};