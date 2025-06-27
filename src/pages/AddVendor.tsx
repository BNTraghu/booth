import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Star, 
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Upload,
  FileText,
  Camera,
  Award,
  Clock,
  Users,
  Shield
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  // Basic Information
  name: string;
  category: string;
  description: string;
  establishedYear: string;
  
  // Contact Information
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  alternatePhone: string;
  website: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  pincode: string;
  serviceAreas: string[];
  
  // Business Details
  businessType: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;
  
  // Service Information
  services: string[];
  priceRangeMin: string;
  priceRangeMax: string;
  priceUnit: string;
  minimumOrder: string;
  
  // Operational Details
  workingHours: string;
  workingDays: string[];
  advanceBookingDays: string;
  cancellationPolicy: string;
  
  // Quality & Compliance
  certifications: string[];
  insurance: boolean;
  insuranceAmount: string;
  safetyCompliance: boolean;
  
  // Status & Settings
  status: 'active' | 'inactive' | 'pending';
  featured: boolean;
  autoApproval: boolean;
  commissionRate: string;
}

interface FormErrors {
  [key: string]: string;
}

const vendorCategories = {
  sound_lights: {
    label: 'Sound & Lights',
    description: 'Audio visual equipment and lighting services',
    services: ['Sound System', 'DJ Services', 'Stage Lighting', 'LED Screens', 'Microphones', 'Speakers'],
    priceUnit: 'per event'
  },
  catering: {
    label: 'Catering',
    description: 'Food and beverage services',
    services: ['Buffet Catering', 'Live Counters', 'Snacks & Beverages', 'Traditional Cuisine', 'Continental Food', 'Desserts'],
    priceUnit: 'per person'
  },
  decoration: {
    label: 'Decoration',
    description: 'Event decoration and styling',
    services: ['Floral Decoration', 'Balloon Decoration', 'Stage Decoration', 'Entrance Decoration', 'Table Setting', 'Backdrop'],
    priceUnit: 'per event'
  },
  security: {
    label: 'Security',
    description: 'Security and safety services',
    services: ['Security Guards', 'Bouncer Services', 'CCTV Monitoring', 'Access Control', 'Crowd Management', 'Emergency Response'],
    priceUnit: 'per guard/day'
  },
  transportation: {
    label: 'Transportation',
    description: 'Vehicle and transport services',
    services: ['Bus Services', 'Car Rental', 'Luxury Vehicles', 'Logistics Support', 'Valet Parking', 'Shuttle Services'],
    priceUnit: 'per vehicle'
  },
  housekeeping: {
    label: 'Housekeeping',
    description: 'Cleaning and maintenance services',
    services: ['Event Cleaning', 'Pre-Event Setup', 'Post-Event Cleanup', 'Waste Management', 'Sanitization', 'Maintenance'],
    priceUnit: 'per hour'
  },
  photography: {
    label: 'Photography & Videography',
    description: 'Professional photography and video services',
    services: ['Event Photography', 'Videography', 'Live Streaming', 'Drone Photography', 'Photo Editing', 'Video Production'],
    priceUnit: 'per event'
  },
  entertainment: {
    label: 'Entertainment',
    description: 'Entertainment and performance services',
    services: ['Live Music', 'Dance Performances', 'Magic Shows', 'Stand-up Comedy', 'Cultural Programs', 'Games & Activities'],
    priceUnit: 'per performance'
  }
};

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'];
const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Gujarat', 'Rajasthan', 'Uttar Pradesh'];
const businessTypes = ['Sole Proprietorship', 'Partnership', 'Private Limited', 'Public Limited', 'LLP'];
const workingDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const AddVendor: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    // Basic Information
    name: '',
    category: '',
    description: '',
    establishedYear: '',
    
    // Contact Information
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    serviceAreas: [],
    
    // Business Details
    businessType: '',
    gstNumber: '',
    panNumber: '',
    registrationNumber: '',
    
    // Service Information
    services: [],
    priceRangeMin: '',
    priceRangeMax: '',
    priceUnit: '',
    minimumOrder: '',
    
    // Operational Details
    workingHours: '9:00 AM - 6:00 PM',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    advanceBookingDays: '7',
    cancellationPolicy: '',
    
    // Quality & Compliance
    certifications: [],
    insurance: false,
    insuranceAmount: '',
    safetyCompliance: false,
    
    // Status & Settings
    status: 'pending',
    featured: false,
    autoApproval: false,
    commissionRate: '10'
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Only super admins, admins, and logistics can access this page
  if (!hasRole(['super_admin', 'admin', 'logistics'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to add vendors.</p>
        </div>
      </div>
    );
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    switch (step) {
      case 1: // Basic Information
        if (!formData.name.trim()) newErrors.name = 'Vendor name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.establishedYear) newErrors.establishedYear = 'Established year is required';
        break;

      case 2: // Contact Information
        if (!formData.contactPerson.trim()) newErrors.contactPerson = 'Contact person is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email format';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        break;

      case 3: // Location & Business
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'State is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        if (!formData.businessType) newErrors.businessType = 'Business type is required';
        break;

      case 4: // Services & Pricing
        if (formData.services.length === 0) newErrors.services = 'At least one service is required';
        if (!formData.priceRangeMin) newErrors.priceRangeMin = 'Minimum price is required';
        if (!formData.priceRangeMax) newErrors.priceRangeMax = 'Maximum price is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }

    // Auto-set price unit based on category
    if (field === 'category' && typeof value === 'string') {
      const categoryData = vendorCategories[value as keyof typeof vendorCategories];
      if (categoryData) {
        setFormData(prev => ({ ...prev, priceUnit: categoryData.priceUnit }));
      }
    }
  };

  const handleArrayChange = (field: keyof FormData, value: string, checked: boolean) => {
    const currentArray = formData[field] as string[];
    if (checked) {
      handleInputChange(field, [...currentArray, value]);
    } else {
      handleInputChange(field, currentArray.filter(item => item !== value));
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(4)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating vendor:', formData);
      
      setSubmitSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/vendors');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating vendor:', error);
      setErrors({ submit: 'Failed to create vendor. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = formData.category ? vendorCategories[formData.category as keyof typeof vendorCategories] : null;

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vendor Added Successfully!</h2>
            <p className="text-gray-600 mb-6">
              The vendor has been created and is pending approval. They will be notified once approved.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/vendors')} className="w-full">
                Go to Vendor Management
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setFormData({
                    name: '', category: '', description: '', establishedYear: '',
                    contactPerson: '', designation: '', email: '', phone: '', alternatePhone: '', website: '',
                    address: '', city: '', state: '', pincode: '', serviceAreas: [],
                    businessType: '', gstNumber: '', panNumber: '', registrationNumber: '',
                    services: [], priceRangeMin: '', priceRangeMax: '', priceUnit: '', minimumOrder: '',
                    workingHours: '9:00 AM - 6:00 PM', workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                    advanceBookingDays: '7', cancellationPolicy: '',
                    certifications: [], insurance: false, insuranceAmount: '', safetyCompliance: false,
                    status: 'pending', featured: false, autoApproval: false, commissionRate: '10'
                  });
                }}
                className="w-full"
              >
                Add Another Vendor
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={() => navigate('/vendors')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Vendors</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Add New Vendor</h1>
            <p className="text-gray-600">Register a new service provider with comprehensive details</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, title: 'Basic Info', icon: Building },
              { step: 2, title: 'Contact', icon: Phone },
              { step: 3, title: 'Business', icon: MapPin },
              { step: 4, title: 'Services', icon: Star }
            ].map(({ step, title, icon: Icon }) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p className={`text-sm font-medium ${
                    currentStep >= step ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    Step {step}
                  </p>
                  <p className={`text-xs ${
                    currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                    {title}
                  </p>
                </div>
                {step < 4 && (
                  <div className={`w-12 sm:w-20 h-0.5 ml-4 ${
                    currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Basic Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vendor Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter vendor/company name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Category *
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.category ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select a category</option>
                        {Object.entries(vendorCategories).map(([key, category]) => (
                          <option key={key} value={key}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Established Year *
                      </label>
                      <select
                        value={formData.establishedYear}
                        onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.establishedYear ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select year</option>
                        {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                      {errors.establishedYear && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.establishedYear}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.description ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Describe your business, services, and expertise..."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Contact Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Phone className="h-5 w-5 mr-2" />
                    Contact Information
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person *
                      </label>
                      <input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.contactPerson ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Primary contact person name"
                      />
                      {errors.contactPerson && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.contactPerson}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Designation
                      </label>
                      <input
                        type="text"
                        value={formData.designation}
                        onChange={(e) => handleInputChange('designation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Owner, Manager, Director, etc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="business@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.website}
                        onChange={(e) => handleInputChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://www.example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Primary Phone *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.phone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+91-9876543210"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternate Phone
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={formData.alternatePhone}
                          onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="+91-9876543211"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Location & Business Details */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Location Details
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Complete business address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <select
                          value={formData.city}
                          onChange={(e) => handleInputChange('city', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.city ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select city</option>
                          {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                        {errors.city && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          value={formData.state}
                          onChange={(e) => handleInputChange('state', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.state ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select state</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Pincode *
                        </label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => handleInputChange('pincode', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.pincode ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="400001"
                        />
                        {errors.pincode && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.pincode}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Areas
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {cities.map(city => (
                          <label key={city} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.serviceAreas.includes(city)}
                              onChange={(e) => handleArrayChange('serviceAreas', city, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{city}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Business Registration
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.businessType ? 'border-red-300' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.businessType && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.businessType}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          GST Number
                        </label>
                        <input
                          type="text"
                          value={formData.gstNumber}
                          onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="27AAAAA0000A1Z5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          PAN Number
                        </label>
                        <input
                          type="text"
                          value={formData.panNumber}
                          onChange={(e) => handleInputChange('panNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="AAAAA0000A"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Registration Number
                        </label>
                        <input
                          type="text"
                          value={formData.registrationNumber}
                          onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Business registration number"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Step 4: Services & Pricing */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Star className="h-5 w-5 mr-2" />
                      Services & Pricing
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Services Offered *
                      </label>
                      {selectedCategory && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedCategory.services.map(service => (
                            <label key={service} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={formData.services.includes(service)}
                                onChange={(e) => handleArrayChange('services', service, e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700">{service}</span>
                            </label>
                          ))}
                        </div>
                      )}
                      {errors.services && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.services}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Price *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={formData.priceRangeMin}
                            onChange={(e) => handleInputChange('priceRangeMin', e.target.value)}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.priceRangeMin ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="5000"
                          />
                        </div>
                        {errors.priceRangeMin && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.priceRangeMin}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Price *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                          <input
                            type="number"
                            value={formData.priceRangeMax}
                            onChange={(e) => handleInputChange('priceRangeMax', e.target.value)}
                            className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                              errors.priceRangeMax ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="50000"
                          />
                        </div>
                        {errors.priceRangeMax && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.priceRangeMax}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price Unit
                        </label>
                        <input
                          type="text"
                          value={formData.priceUnit}
                          onChange={(e) => handleInputChange('priceUnit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="per event, per person, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Minimum Order Value
                        </label>
                        <input
                          type="number"
                          value={formData.minimumOrder}
                          onChange={(e) => handleInputChange('minimumOrder', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10000"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Commission Rate (%)
                        </label>
                        <input
                          type="number"
                          value={formData.commissionRate}
                          onChange={(e) => handleInputChange('commissionRate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="10"
                          min="0"
                          max="50"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Clock className="h-5 w-5 mr-2" />
                      Operational Details
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Working Hours
                        </label>
                        <input
                          type="text"
                          value={formData.workingHours}
                          onChange={(e) => handleInputChange('workingHours', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="9:00 AM - 6:00 PM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Advance Booking (Days)
                        </label>
                        <input
                          type="number"
                          value={formData.advanceBookingDays}
                          onChange={(e) => handleInputChange('advanceBookingDays', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="7"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Working Days
                      </label>
                      <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                        {workingDays.map(day => (
                          <label key={day} className="flex items-center">
                            <input
                              type="checkbox"
                              checked={formData.workingDays.includes(day)}
                              onChange={(e) => handleArrayChange('workingDays', day, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{day.slice(0, 3)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cancellation Policy
                      </label>
                      <textarea
                        value={formData.cancellationPolicy}
                        onChange={(e) => handleInputChange('cancellationPolicy', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Describe your cancellation and refund policy..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="insurance"
                          checked={formData.insurance}
                          onChange={(e) => handleInputChange('insurance', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="insurance" className="ml-2 block text-sm text-gray-700">
                          Business Insurance Coverage
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="safetyCompliance"
                          checked={formData.safetyCompliance}
                          onChange={(e) => handleInputChange('safetyCompliance', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="safetyCompliance" className="ml-2 block text-sm text-gray-700">
                          Safety Compliance Certified
                        </label>
                      </div>
                    </div>

                    {formData.insurance && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Insurance Coverage Amount
                        </label>
                        <input
                          type="number"
                          value={formData.insuranceAmount}
                          onChange={(e) => handleInputChange('insuranceAmount', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="1000000"
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Category Preview */}
            {selectedCategory && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Category Preview</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{selectedCategory.label}</h4>
                      <Badge variant="info">
                        {formData.category.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{selectedCategory.description}</p>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Common Services:</h5>
                      <ul className="space-y-1">
                        {selectedCategory.services.slice(0, 4).map((service, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {service}
                          </li>
                        ))}
                        {selectedCategory.services.length > 4 && (
                          <li className="text-sm text-gray-500">
                            +{selectedCategory.services.length - 4} more services
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress Summary */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900">Progress Summary</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Basic Information</span>
                    <div className="flex items-center">
                      {formData.name && formData.category && formData.description ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Contact Details</span>
                    <div className="flex items-center">
                      {formData.contactPerson && formData.email && formData.phone ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Business Info</span>
                    <div className="flex items-center">
                      {formData.address && formData.city && formData.businessType ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Services & Pricing</span>
                    <div className="flex items-center">
                      {formData.services.length > 0 && formData.priceRangeMin && formData.priceRangeMax ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <div className="h-4 w-4 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Help & Guidelines */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Info className="h-5 w-5 mr-2" />
                  Guidelines
                </h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Provide accurate business information for verification</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Select appropriate service category and offerings</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Set competitive pricing for your services</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Complete all steps for faster approval</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="space-y-3">
              {errors.submit && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    {errors.submit}
                  </p>
                </div>
              )}
              
              {currentStep < 4 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  <span>Continue</span>
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Creating Vendor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Vendor</span>
                    </>
                  )}
                </Button>
              )}
              
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="w-full flex items-center justify-center space-x-2"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>
              )}
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/vendors')}
                className="w-full"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};