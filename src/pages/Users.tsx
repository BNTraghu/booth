import React, { useState } from 'react';
import { Plus, Edit, Trash2, UserPlus, Mail, Phone } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { useAuth } from '../contexts/AuthContext';

// Mock users data
const mockUsers = [
  {
    id: '1',
    name: 'Super Admin',
    email: 'admin@admin.com',
    role: 'super_admin',
    city: 'All Cities',
    phone: '+91-9876543210',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Mumbai Admin',
    email: 'mumbai@admin.com',
    role: 'admin',
    city: 'Mumbai',
    phone: '+91-9876543211',
    status: 'active',
    lastLogin: '2024-01-14T15:45:00Z',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'Delhi Admin',
    email: 'delhi@admin.com',
    role: 'admin',
    city: 'Delhi',
    phone: '+91-9876543212',
    status: 'active',
    lastLogin: '2024-01-13T09:20:00Z',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Support Team Lead',
    email: 'support@admin.com',
    role: 'support_tech',
    city: 'Mumbai',
    phone: '+91-9876543213',
    status: 'active',
    lastLogin: '2024-01-14T14:10:00Z',
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Sales Manager',
    email: 'sales@admin.com',
    role: 'sales_marketing',
    city: 'Delhi',
    phone: '+91-9876543214',
    status: 'active',
    lastLogin: '2024-01-12T11:30:00Z',
    createdAt: '2024-01-05T00:00:00Z'
  }
];

export const Users: React.FC = () => {
  const [users] = useState(mockUsers);
  const [filter, setFilter] = useState('all');
  const { hasRole } = useAuth();

  // Only super admins can access this page
  if (!hasRole(['super_admin'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to view this page.</p>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(user => {
    if (filter === 'all') return true;
    return user.role === filter;
  });

  const getRoleVariant = (role: string) => {
    switch (role) {
      case 'super_admin': return 'error';
      case 'admin': return 'warning';
      case 'support_tech': return 'info';
      case 'sales_marketing': return 'success';
      default: return 'default';
    }
  };

  const roleStats = {
    super_admin: users.filter(u => u.role === 'super_admin').length,
    admin: users.filter(u => u.role === 'admin').length,
    support_tech: users.filter(u => u.role === 'support_tech').length,
    sales_marketing: users.filter(u => u.role === 'sales_marketing').length,
    other: users.filter(u => !['super_admin', 'admin', 'support_tech', 'sales_marketing'].includes(u.role)).length
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
        <Button className="flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add User</span>
        </Button>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-red-600">{roleStats.super_admin}</div>
            <div className="text-sm text-gray-600">Super Admins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-yellow-600">{roleStats.admin}</div>
            <div className="text-sm text-gray-600">City Admins</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{roleStats.support_tech}</div>
            <div className="text-sm text-gray-600">Support Staff</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600">{roleStats.sales_marketing}</div>
            <div className="text-sm text-gray-600">Sales & Marketing</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <div className="flex space-x-4">
        {['all', 'super_admin', 'admin', 'support_tech', 'sales_marketing', 'accounting'].map((role) => (
          <button
            key={role}
            onClick={() => setFilter(role)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${
              filter === role
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {role === 'all' ? 'All Users' : role.replace('_', ' ')}
            <span className="ml-2 text-xs">
              {role === 'all' ? users.length : users.filter(u => u.role === role).length}
            </span>
          </button>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">System Users</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                        <span className="text-sm font-medium text-gray-700">
                          {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleVariant(user.role)}>
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.city}</TableCell>
                  <TableCell>
                    <div className="text-sm flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      {user.phone}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'success' : 'error'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-900">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(user.lastLogin).toLocaleTimeString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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