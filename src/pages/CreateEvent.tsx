import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Save, 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  DollarSign,
  FileText,
  Building2,
  Truck,
  AlertCircle,
  CheckCircle,
  Info,
  Plus,
  X,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { useAuth } from '../contexts/AuthContext';

interface FormData {
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  maxCapacity: number;
  ticketPrice: number;
  planType: 'Plan A' | 'Plan B' | 'Plan C' | 'Custom';
  category: string;
  status: 'draft' | 'published';
  societyId: string;
  tags: string[];
  requirements: string[];
  amenities: string[];
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  registrationDeadline: string;
  isPublic: boolean;
  allowWaitlist: boolean;
  requireApproval: boolean;
  sendReminders: boolean;
  customFields: { label: string; type: string; required: boolean }[];
}

interface FormErrors {
  [key: string]: string;
}

const eventCategories = [
  'Cultural Festival',
  'Sports Event',
  'Educational Workshop',
  'Corporate Meeting',
  'Community Gathering',
  'Health & Wellness',
  'Technology Summit',
  'Food Festival',
  'Art Exhibition',
  'Music Concert',
  'Religious Ceremony',
  'Charity Event'
];

const planTypes = {
  'Plan A': {
    label: 'Basic Plan',
    description: 'Essential features for small events',
    features: ['Basic registration', 'Email notifications', 'Attendee list'],
    price: 2999
  },
  'Plan B': {
    label: 'Professional Plan',
    description: 'Advanced features for medium events',
    features: ['Advanced registration', 'SMS notifications', 'Analytics', 'Custom branding'],
    price: 5999
  },
  'Plan C': {
    label: 'Enterprise Plan',
    description: 'Full features for large events',
    features: ['All features', 'Priority support', 'Custom integrations', 'White-label'],
    price: 12999
  },
  'Custom': {
    label: 'Custom Plan',
    description: 'Tailored solution for specific needs',
    features: ['Custom features', 'Dedicated support', 'Custom pricing'],
    price: 0
  }
};

const mockSocieties = [
  { id: '1', name: 'Sunset Heights Society', location: 'Bandra, Mumbai' },
  { id: '2', name: 'Green Valley Residency', location: 'Gurgaon, Delhi' },
  { id: '3', name: 'Royal Gardens Complex', location: 'Whitefield, Bangalore' },
  { id: '4', name: 'Paradise Towers', location: 'Andheri, Mumbai' },
  { id: '5', name: 'Silver Oak Apartments', location: 'Koramangala, Bangalore' }
];

const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Hyderabad', 'Kolkata', 'Ahmedabad'];

const commonAmenities = [
  'Parking Available',
  'Air Conditioning',
  'Sound System',
  'Projector/Screen',
  'WiFi Access',
  'Catering Facility',
  'Photography Allowed',
  'Wheelchair Accessible',
  'Security Available',
  'Restrooms Available'
];

export const CreateEvent: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [newTag, setNewTag] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    date: '',
    time: '',
    endTime: '',
    venue: '',
    address: '',
    city: user?.city || '',
    maxCapacity: 100,
    ticketPrice: 0,
    planType: 'Plan A',
    category: '',
    status: 'draft',
    societyId: '',
    tags: [],
    requirements: [],
    amenities: [],
    contactPerson: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: '',
    registrationDeadline: '',
    isPublic: true,
    allowWaitlist: false,
    requireApproval: false,
    sendReminders: true,
    customFields: []
  });

  const [errors, setErrors] = useState<FormErrors>({});

  // Check permissions
  if (!hasRole(['super_admin', 'admin', 'support_tech', 'society'])) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to create events.</p>
        </div>
      </div>
    );
  }

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      // Basic Information validation
      if (!formData.title.trim()) {
        newErrors.title = 'Event title is required';
      }
      if (!formData.description.trim()) {
        newErrors.description = 'Event description is required';
      }
      if (!formData.category) {
        newErrors.category = 'Event category is required';
      }
      if (!formData.societyId) {
        newErrors.societyId = 'Society selection is required';
      }
    }

    if (step === 2) {
      // Date & Venue validation
      if (!formData.date) {
        newErrors.date = 'Event date is required';
      }
      if (!formData.time) {
        newErrors.time = 'Start time is required';
      }
      if (!formData.endTime) {
        newErrors.endTime = 'End time is required';
      }
      if (!formData.venue.trim()) {
        newErrors.venue = 'Venue is required';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Address is required';
      }
      if (!formData.city) {
        newErrors.city = 'City is required';
      }
      if (formData.maxCapacity < 1) {
        newErrors.maxCapacity = 'Capacity must be at least 1';
      }
    }

    if (step === 3) {
      // Contact validation
      if (!formData.contactPerson.trim()) {
        newErrors.contactPerson = 'Contact person is required';
      }
      if (!formData.contactEmail.trim()) {
        newErrors.contactEmail = 'Contact email is required';
      }
      if (!formData.contactPhone.trim()) {
        newErrors.contactPhone = 'Contact phone is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleInputChange('tags', [...formData.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  const addRequirement = () => {
    if (newRequirement.trim() && !formData.requirements.includes(newRequirement.trim())) {
      handleInputChange('requirements', [...formData.requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const removeRequirement = (reqToRemove: string) => {
    handleInputChange('requirements', formData.requirements.filter(req => req !== reqToRemove));
  };

  const toggleAmenity = (amenity: string) => {
    const amenities = formData.amenities.includes(amenity)
      ? formData.amenities.filter(a => a !== amenity)
      : [...formData.amenities, amenity];
    handleInputChange('amenities', amenities);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Creating event:', formData);
      
      setSubmitSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/events');
      }, 2000);
      
    } catch (error) {
      console.error('Error creating event:', error);
      setErrors({ submit: 'Failed to create event. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPlan = planTypes[formData.planType];

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Created Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your event "{formData.title}" has been created and is now {formData.status === 'published' ? 'live' : 'saved as draft'}.
            </p>
            <div className="space-y-2">
              <Button onClick={() => navigate('/events')} className="w-full">
                Go to Events
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSubmitSuccess(false);
                  setCurrentStep(1);
                  setFormData({
                    title: '',
                    description: '',
                    date: '',
                    time: '',
                    endTime: '',
                    venue: '',
                    address: '',
                    city: user?.city || '',
                    maxCapacity: 100,
                    ticketPrice: 0,
                    planType: 'Plan A',
                    category: '',
                    status: 'draft',
                    societyId: '',
                    tags: [],
                    requirements: [],
                    amenities: [],
                    contactPerson: user?.name || '',
                    contactEmail: user?.email || '',
                    contactPhone: '',
                    registrationDeadline: '',
                    isPublic: true,
                    allowWaitlist: false,
                    requireApproval: false,
                    sendReminders: true,
                    customFields: []
                  });
                }}
                className="w-full"
              >
                Create Another Event
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
            onClick={() => navigate('/events')}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Events</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Create New Event</h1>
            <p className="text-gray-600">Set up a new event with all the details</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: 'Basic Info', icon: FileText },
              { step: 2, label: 'Date & Venue', icon: MapPin },
              { step: 3, label: 'Settings', icon: Users },
              { step: 4, label: 'Review', icon: CheckCircle }
            ].map(({ step, label, icon: Icon }) => (
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
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {label}
                </span>
                {step < 4 && (
                  <div className={`w-16 h-0.5 ml-4 ${
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
              <>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Basic Information
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.title ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter event title"
                      />
                      {errors.title && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Description *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.description ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Describe your event..."
                      />
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.description}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Category *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleInputChange('category', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.category ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select category</option>
                          {eventCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
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
                          Society *
                        </label>
                        <select
                          value={formData.societyId}
                          onChange={(e) => handleInputChange('societyId', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.societyId ? 'border-red-300' : 'border-gray-300'
                          }`}
                        >
                          <option value="">Select society</option>
                          {mockSocieties.map((society) => (
                            <option key={society.id} value={society.id}>
                              {society.name} - {society.location}
                            </option>
                          ))}
                        </select>
                        {errors.societyId && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.societyId}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Tags
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.tags.map((tag) => (
                          <Badge key={tag} variant="default" className="flex items-center space-x-1">
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a tag"
                        />
                        <Button type="button" onClick={addTag} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 2: Date & Venue */}
            {currentStep === 2 && (
              <>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Date & Time
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Date *
                        </label>
                        <input
                          type="date"
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          min={new Date().toISOString().split('T')[0]}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.date ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.date && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.date}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time *
                        </label>
                        <input
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleInputChange('time', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.time ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.time && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.time}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time *
                        </label>
                        <input
                          type="time"
                          value={formData.endTime}
                          onChange={(e) => handleInputChange('endTime', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.endTime ? 'border-red-300' : 'border-gray-300'
                          }`}
                        />
                        {errors.endTime && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.endTime}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Registration Deadline
                      </label>
                      <input
                        type="date"
                        value={formData.registrationDeadline}
                        onChange={(e) => handleInputChange('registrationDeadline', e.target.value)}
                        max={formData.date}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <MapPin className="h-5 w-5 mr-2" />
                      Venue Details
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Venue Name *
                      </label>
                      <input
                        type="text"
                        value={formData.venue}
                        onChange={(e) => handleInputChange('venue', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.venue ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter venue name"
                      />
                      {errors.venue && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.venue}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="Enter complete address"
                      />
                      {errors.address && (
                        <p className="mt-1 text-sm text-red-600 flex items-center">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
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
                          Maximum Capacity *
                        </label>
                        <input
                          type="number"
                          value={formData.maxCapacity}
                          onChange={(e) => handleInputChange('maxCapacity', parseInt(e.target.value) || 0)}
                          min="1"
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.maxCapacity ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Enter capacity"
                        />
                        {errors.maxCapacity && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.maxCapacity}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Available Amenities
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {commonAmenities.map((amenity) => (
                          <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.amenities.includes(amenity)}
                              onChange={() => toggleAmenity(amenity)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700">{amenity}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 3: Settings */}
            {currentStep === 3 && (
              <>
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Pricing & Plan
                    </h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ticket Price (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.ticketPrice}
                          onChange={(e) => handleInputChange('ticketPrice', parseFloat(e.target.value) || 0)}
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          Set to 0 for free events
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Plan
                        </label>
                        <select
                          value={formData.planType}
                          onChange={(e) => handleInputChange('planType', e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          {Object.entries(planTypes).map(([key, plan]) => (
                            <option key={key} value={key}>
                              {plan.label} - ₹{plan.price.toLocaleString()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          placeholder="Contact person name"
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
                          Contact Email *
                        </label>
                        <input
                          type="email"
                          value={formData.contactEmail}
                          onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.contactEmail ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="contact@example.com"
                        />
                        {errors.contactEmail && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.contactEmail}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contact Phone *
                        </label>
                        <input
                          type="tel"
                          value={formData.contactPhone}
                          onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.contactPhone ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="+91-9876543210"
                        />
                        {errors.contactPhone && (
                          <p className="mt-1 text-sm text-red-600 flex items-center">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            {errors.contactPhone}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-semibold text-gray-900">Event Settings</h3>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.isPublic}
                            onChange={(e) => handleInputChange('isPublic', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Public Event</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.allowWaitlist}
                            onChange={(e) => handleInputChange('allowWaitlist', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Allow Waitlist</span>
                        </label>
                      </div>

                      <div className="space-y-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.requireApproval}
                            onChange={(e) => handleInputChange('requireApproval', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Require Approval</span>
                        </label>

                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.sendReminders}
                            onChange={(e) => handleInputChange('sendReminders', e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Send Reminders</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Special Requirements
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {formData.requirements.map((req) => (
                          <Badge key={req} variant="default" className="flex items-center space-x-1">
                            <span>{req}</span>
                            <button
                              type="button"
                              onClick={() => removeRequirement(req)}
                              className="ml-1 hover:text-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={newRequirement}
                          onChange={(e) => setNewRequirement(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement())}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Add a requirement"
                        />
                        <Button type="button" onClick={addRequirement} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Review Event Details
                  </h3>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Title:</strong> {formData.title}</div>
                        <div><strong>Category:</strong> {formData.category}</div>
                        <div><strong>Description:</strong> {formData.description.substring(0, 100)}...</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Date & Venue</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Date:</strong> {new Date(formData.date).toLocaleDateString()}</div>
                        <div><strong>Time:</strong> {formData.time} - {formData.endTime}</div>
                        <div><strong>Venue:</strong> {formData.venue}</div>
                        <div><strong>City:</strong> {formData.city}</div>
                        <div><strong>Capacity:</strong> {formData.maxCapacity} people</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Pricing & Plan</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Ticket Price:</strong> ₹{formData.ticketPrice}</div>
                        <div><strong>Plan:</strong> {selectedPlan.label}</div>
                        <div><strong>Plan Cost:</strong> ₹{selectedPlan.price.toLocaleString()}</div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Contact</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Person:</strong> {formData.contactPerson}</div>
                        <div><strong>Email:</strong> {formData.contactEmail}</div>
                        <div><strong>Phone:</strong> {formData.contactPhone}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Event Status</h4>
                    <div className="flex items-center space-x-4">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="draft"
                          checked={formData.status === 'draft'}
                          onChange={(e) => handleInputChange('status', e.target.value as any)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Save as Draft</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value="published"
                          checked={formData.status === 'published'}
                          onChange={(e) => handleInputChange('status', e.target.value as any)}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Publish Event</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Plan Preview */}
            {selectedPlan && (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-gray-900">Selected Plan</h3>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{selectedPlan.label}</h4>
                      <Badge variant="info">
                        ₹{selectedPlan.price.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-gray-600">{selectedPlan.description}</p>
                    
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">Features:</h5>
                      <ul className="space-y-1">
                        {selectedPlan.features.map((feature, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-center">
                            <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

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
                    <p>Fill all required fields to proceed to the next step</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Choose appropriate plan based on event size and features needed</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Set registration deadline before event date</p>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <p>Review all details before publishing</p>
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
                  onClick={handleNextStep}
                  className="w-full"
                >
                  Next Step
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
                      <span>Creating Event...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Create Event</span>
                    </>
                  )}
                </Button>
              )}
              
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevStep}
                  className="w-full"
                  disabled={isSubmitting}
                >
                  Previous Step
                </Button>
              )}
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate('/events')}
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