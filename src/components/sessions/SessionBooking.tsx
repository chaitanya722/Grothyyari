import React, { useState } from 'react';
import { useEffect } from 'react';
import { Calendar, Clock, DollarSign, Video, X } from 'lucide-react';
import { User, BookingSlot } from '../../types';
import { apiClient } from '../../config/api';

interface SessionBookingProps {
  expert: User;
  onClose: () => void;
  onBookSession: (expertId: string, slotId: string, sessionType: 'free' | 'paid') => void;
}

export const SessionBooking: React.FC<SessionBookingProps> = ({ expert, onClose, onBookSession }) => {
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [sessionType, setSessionType] = useState<'free' | 'paid'>('free');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Mock booking slots
  const mockSlots: BookingSlot[] = [
    {
      id: '1',
      expertId: expert.id,
      date: new Date('2024-01-20'),
      startTime: '10:00',
      endTime: '11:00',
      isBooked: false,
      price: 0
    },
    {
      id: '2',
      expertId: expert.id,
      date: new Date('2024-01-20'),
      startTime: '14:00',
      endTime: '15:00',
      isBooked: false,
      price: 50
    },
    {
      id: '3',
      expertId: expert.id,
      date: new Date('2024-01-21'),
      startTime: '09:00',
      endTime: '10:00',
      isBooked: false,
      price: 0
    },
    {
      id: '4',
      expertId: expert.id,
      date: new Date('2024-01-21'),
      startTime: '16:00',
      endTime: '17:00',
      isBooked: false,
      price: 75
    }
  ];

  const handleBooking = async () => {
    if (selectedSlot) {
      try {
        setLoading(true);
        setError(null);
        
        const sessionData = {
          expert_id: expert.id,
          title: topic,
          description: description || `${sessionType === 'free' ? 'Free' : 'Paid'} session with ${expert.name}`,
          duration: sessionType === 'free' ? 30 : 60,
          price: selectedSlot.price,
          scheduled_at: new Date(`${selectedSlot.date.toDateString()} ${selectedSlot.startTime}`).toISOString()
        };
        
        const result = await apiClient.bookSession(sessionData);
        if (result.success) {
          onBookSession(expert.id, selectedSlot.id, sessionType);
          onClose();
        } else {
          setError(result.error || 'Failed to book session');
        }
      } catch (error) {
        setError('Failed to book session');
        console.error('Booking error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Book a Session</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Expert info */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img
              src={expert.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&dpr=1'}
              alt={expert.name}
              className="w-12 sm:w-16 h-12 sm:h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">{expert.name}</h3>
              <p className="text-sm sm:text-base text-gray-600">{expert.profession}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-yellow-500">★</span>
                <span className="text-sm font-medium">{expert.rating}</span>
                <span className="text-sm text-gray-500">({expert.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm sm:text-base text-gray-600 mb-2">{expert.bio}</p>
            <div className="flex flex-wrap gap-2">
              {expert.expertise.map((skill, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs sm:text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Session type selection */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Session Type</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => setSessionType('free')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                sessionType === 'free'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <Video className="h-5 w-5 text-indigo-600" />
                <span className="text-sm sm:text-base font-medium">Free Session</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">30-minute introductory call</p>
            </button>
            <button
              onClick={() => setSessionType('paid')}
              className={`p-4 rounded-lg border-2 transition-colors ${
                sessionType === 'paid'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                <span className="text-sm sm:text-base font-medium">Paid Session</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-600">60-minute deep dive session</p>
            </button>
          </div>
        </div>

        {/* Available slots */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Available Time Slots</h4>
          <div className="space-y-4">
            {mockSlots
              .filter(slot => sessionType === 'free' ? slot.price === 0 : slot.price > 0)
              .map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => setSelectedSlot(slot)}
                  className={`w-full p-3 sm:p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedSlot?.id === slot.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm sm:text-base font-medium">{formatDate(slot.date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{slot.startTime} - {slot.endTime}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-base sm:text-lg font-semibold text-gray-900">
                        {slot.price === 0 ? 'Free' : `$${slot.price}`}
                      </div>
                      <div className="text-sm text-gray-500">60 min</div>
                    </div>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {/* Session details */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Session Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic/Focus Area
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="What would you like to discuss?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Provide more details about what you'd like to learn or discuss..."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedSlot && (
                <span className="hidden sm:inline">
                  Selected: {formatDate(selectedSlot.date)} at {selectedSlot.startTime}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={onClose}
                className="px-4 sm:px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleBooking}
                disabled={!selectedSlot || !topic}
                disabled={!selectedSlot || !topic || loading}
                className="px-4 sm:px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base"
              >
                {loading ? 'Booking...' : 'Book Session'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};