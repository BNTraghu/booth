import React, { useState } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  TrendingUp, 
  Download, 
  Eye, 
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Filter,
  Search,
  FileText,
  Send,
  Edit
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  maxEvents: number;
  maxAttendees: number;
  support: string;
  popular?: boolean;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  societyName: string;
  planName: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  paymentMethod?: string;
}

interface Subscription {
  id: string;
  societyName: string;
  planName: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  autoRenew: boolean;
  monthlyAmount: number;
}

const plans: Plan[] = [
  {
    id: '1',
    name: 'Basic',
    description: 'Perfect for small societies',
    price: 2999,
    features: [
      'Up to 5 events per month',
      'Basic event management',
      'Email support',
      'Standard reporting',
      'Mobile app access'
    ],
    maxEvents: 5,
    maxAttendees: 200,
    support: 'Email'
  },
  {
    id: '2',
    name: 'Professional',
    description: 'Ideal for growing communities',
    price: 5999,
    features: [
      'Up to 15 events per month',
      'Advanced event management',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'Vendor management'
    ],
    maxEvents: 15,
    maxAttendees: 500,
    support: 'Phone & Email',
    popular: true
  },
  {
    id: '3',
    name: 'Enterprise',
    description: 'For large societies and organizations',
    price: 12999,
    features: [
      'Unlimited events',
      'Full platform access',
      '24/7 dedicated support',
      'Custom integrations',
      'White-label solution',
      'Advanced security',
      'API access'
    ],
    maxEvents: -1,
    maxAttendees: -1,
    support: '24/7 Dedicated'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    societyName: 'Sunset Heights Society',
    planName: 'Professional',
    amount: 5999,
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    status: 'paid',
    paymentMethod: 'Credit Card'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    societyName: 'Green Valley Residency',
    planName: 'Enterprise',
    amount: 12999,
    issueDate: '2024-01-05',
    dueDate: '2024-01-20',
    status: 'pending'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    societyName: 'Royal Gardens Complex',
    planName: 'Basic',
    amount: 2999,
    issueDate: '2023-12-15',
    dueDate: '2023-12-30',
    status: 'overdue'
  }
];

const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    societyName: 'Sunset Heights Society',
    planName: 'Professional',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    autoRenew: true,
    monthlyAmount: 5999
  },
  {
    id: '2',
    societyName: 'Green Valley Residency',
    planName: 'Enterprise',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    autoRenew: true,
    monthlyAmount: 12999
  },
  {
    id: '3',
    societyName: 'Royal Gardens Complex',
    planName: 'Basic',
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    status: 'expired',
    autoRenew: false,
    monthlyAmount: 2999
  }
];

export const Billing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'plans' | 'invoices' | 'subscriptions'>('plans');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid': case 'active': return 'success';
      case 'pending': return 'warning';
      case 'overdue': case 'expired': return 'error';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': case 'active': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'overdue': case 'expired': return <AlertTriangle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const totalRevenue = mockInvoices.reduce((sum, inv) => sum + (inv.status === 'paid' ? inv.amount : 0), 0);
  const pendingAmount = mockInvoices.reduce((sum, inv) => sum + (inv.status === 'pending' ? inv.amount : 0), 0);
  const overdueAmount = mockInvoices.reduce((sum, inv) => sum + (inv.status === 'overdue' ? inv.amount : 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Plans & Billing</h1>
          <p className="text-gray-600">Manage subscription plans and billing information</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button variant="outline" className="flex items-center space-x-2 w-full sm:w-auto justify-center">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Link to="/billing/plans/create">
            <Button className="flex items-center space-x-2 w-full sm:w-auto justify-center">
              <Plus className="h-4 w-4" />
              <span>New Plan</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{pendingAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{mockInvoices.filter(i => i.status === 'pending').length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Amount</p>
                <p className="text-2xl font-bold text-gray-900">₹{overdueAmount.toLocaleString()}</p>
                <p className="text-sm text-gray-500">{mockInvoices.filter(i => i.status === 'overdue').length} invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-full">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{mockSubscriptions.filter(s => s.status === 'active').length}</p>
                <p className="text-sm text-gray-500">Monthly recurring</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'plans', label: 'Subscription Plans', count: plans.length },
            { id: 'invoices', label: 'Invoices', count: mockInvoices.length },
            { id: 'subscriptions', label: 'Active Subscriptions', count: mockSubscriptions.filter(s => s.status === 'active').length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>

      {/* Plans Tab */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Available Plans</h3>
            <Link to="/billing/plans/create">
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create New Plan</span>
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className={`relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="text-gray-600 mt-2">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">₹{plan.price.toLocaleString()}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Max Events:</span>
                        <span className="font-medium text-gray-900 ml-2">
                          {plan.maxEvents === -1 ? 'Unlimited' : plan.maxEvents}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Max Attendees:</span>
                        <span className="font-medium text-gray-900 ml-2">
                          {plan.maxAttendees === -1 ? 'Unlimited' : plan.maxAttendees}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Support:</span>
                      <span className="font-medium text-gray-900 ml-2">{plan.support}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex space-x-2">
                    <Button 
                      className="flex-1" 
                      variant={plan.popular ? 'primary' : 'outline'}
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowPlanModal(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {activeTab === 'invoices' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Recent Invoices</h3>
              <div className="flex space-x-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search invoices..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <Button size="sm" variant="outline">
                  <Filter className="h-4 w-4 mr-1" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Society</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Issue Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      {invoice.paymentMethod && (
                        <div className="text-sm text-gray-500">{invoice.paymentMethod}</div>
                      )}
                    </TableCell>
                    <TableCell>{invoice.societyName}</TableCell>
                    <TableCell>
                      <Badge variant="default">{invoice.planName}</Badge>
                    </TableCell>
                    <TableCell className="font-medium">₹{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(invoice.status)}
                        <Badge variant={getStatusVariant(invoice.status)} className="ml-2">
                          {invoice.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Subscriptions Tab */}
      {activeTab === 'subscriptions' && (
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Active Subscriptions</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Society</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Monthly Amount</TableHead>
                  <TableHead>Auto Renew</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium">{subscription.societyName}</TableCell>
                    <TableCell>
                      <Badge variant="default">{subscription.planName}</Badge>
                    </TableCell>
                    <TableCell>{new Date(subscription.startDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(subscription.endDate).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">₹{subscription.monthlyAmount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={subscription.autoRenew ? 'success' : 'warning'}>
                        {subscription.autoRenew ? 'Yes' : 'No'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {getStatusIcon(subscription.status)}
                        <Badge variant={getStatusVariant(subscription.status)} className="ml-2">
                          {subscription.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Plan Detail Modal */}
      {showPlanModal && selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPlan.name} Plan</h2>
                <button
                  onClick={() => setShowPlanModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  ₹{selectedPlan.price.toLocaleString()}<span className="text-lg text-gray-600">/month</span>
                </div>
                <p className="text-gray-600">{selectedPlan.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Plan Limits</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Events:</span>
                      <span className="font-medium">
                        {selectedPlan.maxEvents === -1 ? 'Unlimited' : selectedPlan.maxEvents}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max Attendees:</span>
                      <span className="font-medium">
                        {selectedPlan.maxAttendees === -1 ? 'Unlimited' : selectedPlan.maxAttendees}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Support:</span>
                      <span className="font-medium">{selectedPlan.support}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Features Included</h4>
                  <ul className="space-y-2">
                    {selectedPlan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowPlanModal(false)}>
                  Close
                </Button>
                <Button>
                  Assign to Society
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};