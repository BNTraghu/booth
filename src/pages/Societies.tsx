import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, MapPin, Users, Calendar, DollarSign } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { mockSocieties } from '../data/mockData';

export const Societies: React.FC = () => {
  const [societies] = useState(mockSocieties);
  const [filter, setFilter] = useState('all');

  const filteredSocieties = societies.filter(society => {
    if (filter === 'all') return true;
    return society.status === filter;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Society Management</h1>
          <p className="text-gray-600">Manage society partnerships and accounts</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Society</span>
        </Button>
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

      {/* Filter Bar */}
      <div className="flex space-x-4">
        {['all', 'active', 'inactive', 'pending'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status === 'all' ? 'All Societies' : status}
            <span className="ml-2 text-xs">
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
                <h3 className="text-lg font-semibold text-gray-900">{society.name}</h3>
                <Badge variant={getStatusVariant(society.status)}>
                  {society.status}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  {society.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  {society.memberCount.toLocaleString()} members
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  {society.activeEvents} active events
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Facilities:</p>
                <div className="flex flex-wrap gap-1">
                  {society.facilities.map((facility, index) => (
                    <Badge key={index} variant="default" className="text-xs">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">₹{society.totalRevenue.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">revenue</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="ghost">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
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
          <h3 className="text-lg font-semibold text-gray-900">Societies Overview</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Society</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Active Events</TableHead>
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
                      <div className="font-medium text-gray-900">{society.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {society.location}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{society.contactPerson}</div>
                      <div className="text-sm text-gray-500">{society.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{society.memberCount.toLocaleString()}</TableCell>
                  <TableCell>
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
                    <div className="flex space-x-2">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
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