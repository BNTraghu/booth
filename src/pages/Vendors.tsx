import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Phone, Mail } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { mockVendors } from '../data/mockData';

export const Vendors: React.FC = () => {
  const [vendors] = useState(mockVendors);
  const [filter, setFilter] = useState('all');

  const filteredVendors = vendors.filter(vendor => {
    if (filter === 'all') return true;
    return vendor.category === filter;
  });

  const getCategoryVariant = (category: string) => {
    switch (category) {
      case 'sound_lights': return 'info';
      case 'catering': return 'success';
      case 'decoration': return 'warning';
      case 'security': return 'error';
      case 'transportation': return 'default';
      default: return 'default';
    }
  };

  const categoryStats = {
    sound_lights: vendors.filter(v => v.category === 'sound_lights').length,
    catering: vendors.filter(v => v.category === 'catering').length,
    decoration: vendors.filter(v => v.category === 'decoration').length,
    security: vendors.filter(v => v.category === 'security').length,
    transportation: vendors.filter(v => v.category === 'transportation').length,
    housekeeping: vendors.filter(v => v.category === 'housekeeping').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage service providers and vendors</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Vendor</span>
        </Button>
      </div>

      {/* Vendor Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(categoryStats).map(([category, count]) => (
          <Card key={category}>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{category.replace('_', ' ')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {['all', 'sound_lights', 'catering', 'decoration', 'security', 'transportation', 'housekeeping'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Vendors' : category.replace('_', ' ')}
            <span className="ml-2 text-xs">
              {category === 'all' ? vendors.length : vendors.filter(v => v.category === category).length}
            </span>
          </button>
        ))}
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{vendor.name}</h3>
                <Badge variant={getCategoryVariant(vendor.category)}>
                  {vendor.category.replace('_', ' ')}
                </Badge>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="ml-2">({vendor.completedJobs} jobs)</span>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Contact:</strong> {vendor.contactPerson}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  {vendor.email}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {vendor.phone}
                </div>
                <div className="text-sm text-gray-600">
                  <strong>City:</strong> {vendor.city}
                </div>
              </div>

              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">Price Range:</p>
                <p className="text-sm text-gray-900">{vendor.priceRange}</p>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <Badge variant={vendor.status === 'active' ? 'success' : 'error'}>
                  {vendor.status}
                </Badge>
                <div className="flex space-x-2">
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

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900">Vendors Overview</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Jobs</TableHead>
                <TableHead>Price Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.city}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryVariant(vendor.category)}>
                      {vendor.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vendor.contactPerson}</div>
                      <div className="text-sm text-gray-500">{vendor.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span className="font-medium">{vendor.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{vendor.completedJobs}</TableCell>
                  <TableCell className="text-sm">{vendor.priceRange}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === 'active' ? 'success' : 'error'}>
                      {vendor.status}
                    </Badge>
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