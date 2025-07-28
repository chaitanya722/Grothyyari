import React, { useState } from 'react';
import { useEffect } from 'react';
import { Users, UserPlus, Clock, Check, X, Calendar, MessageCircle } from 'lucide-react';
import { ConnectionRequest, Connection } from '../../types';
import { apiClient } from '../../config/api';

export const ConnectionsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'connections' | 'requests' | 'sent'>('connections');
  const [connections, setConnections] = useState<Connection[]>([]);
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (activeTab === 'connections') {
          const result = await apiClient.getConnections();
          if (result.success && result.data) {
            setConnections(result.data.connections);
          } else {
            setError(result.error || 'Failed to load connections');
          }
        } else if (activeTab === 'requests') {
          const result = await apiClient.getConnectionRequests('received');
          if (result.success && result.data) {
            setRequests(result.data.requests);
          } else {
            setError(result.error || 'Failed to load requests');
          }
        } else if (activeTab === 'sent') {
          const result = await apiClient.getConnectionRequests('sent');
          if (result.success && result.data) {
            setSentRequests(result.data.requests);
          } else {
            setError(result.error || 'Failed to load sent requests');
          }
        }
      } catch (error) {
        setError('Failed to load data');
        console.error('Connection data load error:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  const handleAcceptRequest = (requestId: string) => {
    const acceptRequest = async () => {
      try {
        const result = await apiClient.respondToConnectionRequest(requestId, 'accept');
        if (result.success) {
          // Remove from requests and reload connections
          setRequests(prev => prev.filter(req => req.id !== requestId));
          // Optionally reload connections tab
        } else {
          console.error('Failed to accept request:', result.error);
        }
      } catch (error) {
        console.error('Accept request error:', error);
      }
    };
    acceptRequest();
  };

  const handleDeclineRequest = (requestId: string) => {
    const declineRequest = async () => {
      try {
        const result = await apiClient.respondToConnectionRequest(requestId, 'decline');
        if (result.success) {
          setRequests(prev => prev.filter(req => req.id !== requestId));
        } else {
          console.error('Failed to decline request:', result.error);
        }
      } catch (error) {
        console.error('Decline request error:', error);
      }
    };
    declineRequest();
  };

  const handleScheduleFreeCall = (userId: string) => {
    console.log('Scheduling free call with:', userId);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Connections</h2>
        <p className="text-gray-600">Manage your professional network and connection requests</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('connections')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'connections'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>My Connections ({connections.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'requests'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <UserPlus className="h-4 w-4" />
            <span>Requests ({requests.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('sent')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'sent'
              ? 'bg-white text-indigo-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>Sent ({sentRequests.length})</span>
          </div>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {!loading && activeTab === 'connections' && (
          <>
            {connections.map((connection) => (
              <div key={connection.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={connection.user.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={connection.user.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{connection.user.name}</h3>
                      <p className="text-gray-600">{connection.user.profession}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{connection.user.rating}</span>
                        <span className="text-sm text-gray-500">({connection.user.reviewCount} reviews)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Connected on {new Date(connection.connected_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleScheduleFreeCall(connection.user.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <Calendar className="h-4 w-4" />
                      <span>Free Call</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors">
                      <MessageCircle className="h-4 w-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex flex-wrap gap-2">
                    {connection.user.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {connections.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Connections Yet</h3>
                <p className="text-gray-600">Start connecting with professionals to build your network.</p>
              </div>
            )}
          </>
        )}

        {!loading && activeTab === 'requests' && (
          <>
            {requests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={request.sender.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={request.sender.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{request.sender.name}</h3>
                      <p className="text-gray-600">{request.sender.profession}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-medium">{request.sender.rating}</span>
                        <span className="text-sm text-gray-500">({request.sender.reviewCount} reviews)</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Sent {new Date(request.created_at).toLocaleDateString()}
                      </p>
                      {request.message && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">{request.message}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleAcceptRequest(request.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleDeclineRequest(request.id)}
                      className="flex items-center space-x-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                      <span>Decline</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="text-center py-12">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Connection Requests</h3>
                <p className="text-gray-600">Connection requests will appear here when you receive them.</p>
              </div>
            )}
          </>
        )}

        {!loading && activeTab === 'sent' && (
          <>
            {sentRequests.map((request) => (
              <div key={request.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={request.receiver.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                      alt={request.receiver.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{request.receiver.name}</h3>
                      <p className="text-gray-600">{request.receiver.profession}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Sent {new Date(request.created_at).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {sentRequests.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Sent Requests</h3>
            <p className="text-gray-600">Requests you send will appear here.</p>
          </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};