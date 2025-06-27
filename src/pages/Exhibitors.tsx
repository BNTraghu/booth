import React, { useState } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  Users,
  DollarSign,
  FileText,
  Send
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { mockExhibitors } from '../data/mockData';

interface ExhibitorFilters {
  status: string;
  paymentStatus: string;
  category: string;
  city: string;
  search: string;
}

export const Exhibitors: React.FC = () => {
  const [exhibitors] = useState(mockExhibitors);
  const [selectedExhibitors, setSelectedExhibitors] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState<any>(null);
  const [filters, setFilters] = useState<ExhibitorFilters>({
    status: 'all',
    paymentStatus: 'all',
    category: 'all',
    city: 'all',
    search: ''
  });

  const filteredExhibitors = exhibitors.filter(exhibitor => {
    const matchesStatus = filters.status === 'all' || exhibitor.status === filters.status;
    const matchesPayment = filters.paymentStatus === 'all' || exhibitor.paymentStatus === filters.paymentStatus;
    const matchesCategory = filters.category === 'all' || exhibitor.category === filters.category;
    const matchesCity = filters.city === 'all' || exhibitor.city === filters.city;
    const matchesSearch = filters.search === '' || 
      exhibitor.companyName.toLowerCase().includes(filters.search.toLowerCase()) ||
      exhibitor.contactPerson.toLowerCase().includes(filters.search.toLowerCase()) ||
      exhibitor.email.toLowerCase().includes(filters.search.toLowerCase());

    return matchesStatus && matchesPayment && matchesCategory && matchesCity && matchesSearch;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'registered': return 'info';
      case 'checked_in': return 'success';
      case 'cancelled': return 'error';
      default: return 'warning';
    }
  };

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'success';
      case 'pending': return 'warning';
      case 'refunded': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'registered': return <Clock className="h-4 w-4" />;
      case 'checked_in': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const stats = {
    total: exhibitors.length,
    confirmed: exhibitors.filter(e => e.status === 'confirmed').length,
    registered: exhibitors.filter(e => e.status === 'registered').length,
    checkedIn: exhibitors.filter(e => e.status === 'checked_in').length,
    cancelled: exhibitors.filter(e => e.status === 'cancelled').length,
    paidAmount: exhibitors.filter(e => e.paymentStatus === 'paid').length * 15000,
    pendingAmount: exhibitors.filter(e => e.paymentStatus === 'pending').length * 15000
  };

  const categories = [...new Set(exhibitors.map(e => e.category))];
  const cities = [...new Set(exhibitors.map(e => e.city))];

  const handleSelectExhibitor = (id: string) => {
    setSelectedExhibitors(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedExhibitors.length === filteredExhibitors.length) {
      setSelectedExhibitors([]);
    } else {
      setSelectedExhibitors(filteredExhibitors.map(e => e.id));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} for exhibitors:`, selectedExhibitors);
    // Implement bulk actions here
    setSelectedExhibitors([]);
  };

  const handleViewDetails = (exhibitor: any) => {
    setSelectedExhibitor(exhibitor);
    setShowDetailModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Exhibitor Management</h1>
          <p className="text-gray-600">Manage exhibitor registrations, booth assignments, and payments</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="flex items-center space-x-2" onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Exhibitor</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Building className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Exhibitors</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{stats.registered}</div>
            <div className="text-sm text-gray-600">Registered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{stats.checkedIn}</div>
            <div className="text-sm text-gray-600">Checked In</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">{stats.cancelled}</div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">₹{(stats.paidAmount / 100000).toFixed(1)}L</div>
            <div className="text-sm text-gray-600">Paid Amount</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-600">₹{(stats.pendingAmount / 100000).toFixed(1)}L</div>
            <div className="text-sm text-gray-600">Pending Amount</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search exhibitors..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="registered">Registered</option>
              <option value="confirmed">Confirmed</option>
              <option value="checked_in">Checked In</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filters.paymentStatus}
              onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={filters.city}
              onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Cities</option>
              {cities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedExhibitors.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedExhibitors.length} exhibitor(s) selected
                </span>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('confirm')}>
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('email')}>
                  <Mail className="h-4 w-4 mr-1" />
                  Send Email
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('export')}>
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelectedExhibitors([])}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exhibitors Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              Exhibitors ({filteredExhibitors.length})
            </h3>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-1" />
                Advanced Filters
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
                    checked={selectedExhibitors.length === filteredExhibitors.length && filteredExhibitors.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Booth</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExhibitors.map((exhibitor) => (
                <TableRow key={exhibitor.id}>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedExhibitors.includes(exhibitor.id)}
                      onChange={() => handleSelectExhibitor(exhibitor.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{exhibitor.companyName}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {exhibitor.city}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{exhibitor.contactPerson}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {exhibitor.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {exhibitor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{exhibitor.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building className="h-4 w-4 mr-2 text-blue-500" />
                      <span className="font-medium">{exhibitor.booth}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-gray-900">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(exhibitor.registrationDate).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {getStatusIcon(exhibitor.status)}
                      <Badge variant={getStatusVariant(exhibitor.status)} className="ml-2">
                        {exhibitor.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <CreditCard className="h-4 w-4 mr-1" />
                      <Badge variant={getPaymentStatusVariant(exhibitor.paymentStatus)}>
                        {exhibitor.paymentStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleViewDetails(exhibitor)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Mail className="h-4 w-4" />
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

      {/* Exhibitor Detail Modal */}
      {showDetailModal && selectedExhibitor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Exhibitor Details</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Company Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Company Name</label>
                      <p className="text-gray-900">{selectedExhibitor.companyName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Category</label>
                      <p className="text-gray-900">{selectedExhibitor.category}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">City</label>
                      <p className="text-gray-900">{selectedExhibitor.city}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Booth Number</label>
                      <p className="text-gray-900 font-medium">{selectedExhibitor.booth}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Contact Person</label>
                      <p className="text-gray-900">{selectedExhibitor.contactPerson}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedExhibitor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedExhibitor.phone}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Status and Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Registration Status</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Current Status</label>
                      <div className="flex items-center mt-1">
                        {getStatusIcon(selectedExhibitor.status)}
                        <Badge variant={getStatusVariant(selectedExhibitor.status)} className="ml-2">
                          {selectedExhibitor.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Registration Date</label>
                      <p className="text-gray-900">{new Date(selectedExhibitor.registrationDate).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Payment Status</label>
                      <div className="flex items-center mt-1">
                        <CreditCard className="h-4 w-4 mr-1" />
                        <Badge variant={getPaymentStatusVariant(selectedExhibitor.paymentStatus)}>
                          {selectedExhibitor.paymentStatus}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-gray-900 font-medium">₹15,000</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Invoice
                </Button>
                <Button variant="outline">
                  <Send className="h-4 w-4 mr-2" />
                  Send Email
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Exhibitor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Add New Exhibitor</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Person *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter contact person name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="">Select city</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Booth Preference
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter preferred booth number or area"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <Button variant="outline" onClick={() => setShowAddModal(false)}>
                    Cancel
                  </Button>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exhibitor
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};