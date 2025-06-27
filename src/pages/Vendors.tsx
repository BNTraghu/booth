import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, Phone, Mail, Search, Filter, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { mockVendors } from '../data/mockData';

export const Vendors: React.FC = () => {
  const [vendors] = useState(mockVendors);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);

  const filteredVendors = vendors.filter(vendor => {
    const matchesFilter = filter === 'all' || vendor.category === filter;
    const matchesSearch = searchTerm === '' || 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.city.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
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

  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  const handleSelectAll = () => {
    if (selectedVendors.length === filteredVendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(filteredVendors.map(v => v.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for vendors:`, selectedVendors);
    // Implement bulk actions here
    setSelectedVendors([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600">Manage service providers and vendors</p>
        </div>
        <Link to="/vendors/add">
          <Button className="flex items-center space-x-2 w-full sm:w-auto justify-center">
            <Plus className="h-4 w-4" />
            <span>Add Vendor</span>
          </Button>
        </Link>
      </div>

      {/* Vendor Category Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(categoryStats).map(([category, count]) => (
          <Card key={category}>
            <CardContent className="p-4 text-center">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{count}</div>
              <div className="text-xs sm:text-sm text-gray-600 capitalize">{category.replace('_', ' ')}</div>
            </CardContent>
          </Card>
        ))}
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
                  placeholder="Search vendors by name, contact person, or city..."
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
              <option value="all">All Categories</option>
              <option value="sound_lights">Sound & Lights</option>
              <option value="catering">Catering</option>
              <option value="decoration">Decoration</option>
              <option value="security">Security</option>
              <option value="transportation">Transportation</option>
              <option value="housekeeping">Housekeeping</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {['all', 'sound_lights', 'catering', 'decoration', 'security', 'transportation', 'housekeeping'].map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium capitalize transition-colors duration-200 ${
              filter === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category === 'all' ? 'All Vendors' : category.replace('_', ' ')}
            <span className="ml-1 sm:ml-2 text-xs">
              {category === 'all' ? vendors.length : vendors.filter(v => v.category === category).length}
            </span>
          </button>
        ))}
      </div>

      {/* Bulk Actions */}
      {selectedVendors.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedVendors.length} vendor(s) selected
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('activate')}>
                  Activate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('deactivate')}>
                  Deactivate
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('email')}>
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedVendors([])}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.map((vendor) => (
          <Card key={vendor.id} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{vendor.name}</h3>
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
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{vendor.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{vendor.phone}</span>
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

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Vendors Overview ({filteredVendors.length})
            </h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Advanced Filter</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={selectedVendors.length === filteredVendors.length && filteredVendors.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="hidden md:table-cell">Contact</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="hidden lg:table-cell">Jobs</TableHead>
                <TableHead className="hidden xl:table-cell">Price Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleSelectVendor(vendor.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900 line-clamp-1">{vendor.name}</div>
                      <div className="text-sm text-gray-500">{vendor.city}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getCategoryVariant(vendor.category)}>
                      <span className="hidden sm:inline">{vendor.category.replace('_', ' ')}</span>
                      <span className="sm:hidden">{vendor.category.split('_')[0]}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vendor.contactPerson}</div>
                      <div className="text-sm text-gray-500 truncate">{vendor.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 text-yellow-400 fill-current" />
                      <span className="font-medium">{vendor.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell font-medium">{vendor.completedJobs}</TableCell>
                  <TableCell className="hidden xl:table-cell text-sm">{vendor.priceRange}</TableCell>
                  <TableCell>
                    <Badge variant={vendor.status === 'active' ? 'success' : 'error'}>
                      {vendor.status}
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