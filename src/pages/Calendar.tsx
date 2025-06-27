import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Button } from '../components/UI/Button';
import { mockEvents } from '../data/mockData';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  status: string;
  attendees: number;
  color: string;
}

export const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Convert mock events to calendar events
  const calendarEvents: CalendarEvent[] = mockEvents.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    venue: event.venue,
    status: event.status,
    attendees: event.attendees,
    color: getEventColor(event.status)
  }));

  function getEventColor(status: string): string {
    switch (status) {
      case 'published': return 'bg-green-500';
      case 'ongoing': return 'bg-blue-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  }

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return calendarEvents.filter(event => 
      isSameDay(new Date(event.date), date)
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const events = getEventsForDate(date);
    if (events.length === 1) {
      setSelectedEvent(events[0]);
      setShowEventModal(true);
    }
  };

  const upcomingEvents = calendarEvents
    .filter(event => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Calendar</h1>
          <p className="text-gray-600">Manage and view all scheduled events</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Event</span>
          </Button>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900 min-w-[200px] text-center">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <Button variant="outline" size="sm" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
            Today
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['month', 'week', 'day'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode as any)}
                className={`px-3 py-1 text-sm font-medium rounded-md capitalize transition-colors duration-200 ${
                  viewMode === mode
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-6">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Body */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date) => {
                  const events = getEventsForDate(date);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);
                  const isCurrentMonth = isSameMonth(date, currentDate);
                  
                  return (
                    <div
                      key={date.toISOString()}
                      onClick={() => handleDateClick(date)}
                      className={`min-h-[100px] p-2 border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                        !isCurrentMonth ? 'bg-gray-50 text-gray-400' : ''
                      } ${isSelected ? 'bg-blue-50 border-blue-300' : ''} ${
                        isToday(date) ? 'bg-blue-100 border-blue-400' : ''
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(date) ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {format(date, 'd')}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded text-white truncate ${event.color}`}
                            title={event.title}
                          >
                            {event.title}
                          </div>
                        ))}
                        {events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {format(new Date(event.date), 'MMM d')}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-xs text-gray-600 mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        {event.venue}
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${event.color}`}></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Event Legend */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Event Status</h3>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { status: 'published', color: 'bg-green-500', label: 'Published' },
                { status: 'ongoing', color: 'bg-blue-500', label: 'Ongoing' },
                { status: 'draft', color: 'bg-yellow-500', label: 'Draft' },
                { status: 'completed', color: 'bg-gray-500', label: 'Completed' },
                { status: 'cancelled', color: 'bg-red-500', label: 'Cancelled' }
              ].map((item) => (
                <div key={item.status} className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded ${item.color}`}></div>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">This Month</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="font-semibold text-gray-900">{calendarEvents.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Published</span>
                <span className="font-semibold text-green-600">
                  {calendarEvents.filter(e => e.status === 'published').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Ongoing</span>
                <span className="font-semibold text-blue-600">
                  {calendarEvents.filter(e => e.status === 'ongoing').length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Attendees</span>
                <span className="font-semibold text-gray-900">
                  {calendarEvents.reduce((sum, e) => sum + e.attendees, 0)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      {showEventModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <p className="text-gray-900">{format(new Date(selectedEvent.date), 'MMMM d, yyyy')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <p className="text-gray-900">{selectedEvent.time}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Venue</label>
                <p className="text-gray-900">{selectedEvent.venue}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="mt-1">
                    <Badge variant={selectedEvent.status === 'published' ? 'success' : 'info'}>
                      {selectedEvent.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Attendees</label>
                  <p className="text-gray-900">{selectedEvent.attendees}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <Button variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Event
                </Button>
                <Button>
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};