// frontend/src/app/consent/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Check, X, ShieldCheck, Loader2, Clock, CheckCircle, XCircle, AlertCircle, MapPin } from 'lucide-react';

export default function ConsentPage() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const requestsRes = await api.get('/api/consent-requests/');
        setRequests(requestsRes.data);
      } catch (error) {
        console.error("Failed to fetch consent data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleUpdateRequest = async (id, status) => {
    setActionLoading(id);
    try {
      const originalRequests = requests;
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      await api.patch(`/api/consent-requests/${id}/`, { status });
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} request:`, error);
      setRequests(originalRequests); 
    } finally {
      setActionLoading(null);
    }
  };

  const filteredRequests = requests.filter(r => r.status === activeTab);
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;
  const approvedCount = requests.filter(r => r.status === 'APPROVED').length;
  const deniedCount = requests.filter(r => r.status === 'DENIED').length;

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading consent requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto pb-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-primary to-dark-accent rounded-2xl shadow-lg">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Your Consent</h1>
            <p className="text-gray-600 mt-1">Control who can use photos with you in them</p>
          </div>
        </div>

        {/* Privacy Tip Banner */}
        <div className="bg-gradient-to-r from-accent/20 to-primary/20 border border-accent/30 rounded-xl p-4 flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-1">Privacy Tip</h3>
            <p className="text-sm text-gray-700">
              Always review consent requests carefully. You have full control over your image rights.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Pending</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
          <p className="text-xs text-gray-500 mt-1">Need your action</p>
        </div>
        
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Approved</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{approvedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Photos shared</p>
        </div>
        
        <div className="bg-surface rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Denied</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{deniedCount}</p>
          <p className="text-xs text-gray-500 mt-1">Requests blocked</p>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="bg-surface rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50/50">
          <div className="flex space-x-1 px-2">
            <TabButton name="PENDING" activeTab={activeTab} onClick={setActiveTab} count={pendingCount} icon={Clock} />
            <TabButton name="APPROVED" activeTab={activeTab} onClick={setActiveTab} count={approvedCount} icon={CheckCircle} />
            <TabButton name="DENIED" activeTab={activeTab} onClick={setActiveTab} count={deniedCount} icon={XCircle} />
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map(request => (
                <ConsentRequestCard 
                  key={request.id} 
                  request={request}
                  onApprove={() => handleUpdateRequest(request.id, 'APPROVED')}
                  onDeny={() => handleUpdateRequest(request.id, 'DENIED')}
                  isLoading={actionLoading === request.id}
                />
              ))}
            </div>
          ) : (
            <EmptyState status={activeTab} />
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Your privacy is protected. Only you can approve or deny photo sharing requests.</p>
      </div>
    </div>
  );
}

// --- Sub-components ---

const TabButton = ({ name, activeTab, onClick, count, icon: Icon }) => (
  <button
    onClick={() => onClick(name)}
    className={`relative flex items-center space-x-2 px-6 py-3 font-semibold text-sm transition-all ${
      activeTab === name
        ? 'text-primary border-b-2 border-primary'
        : 'text-gray-500 hover:text-primary'
    }`}
  >
    <Icon className="w-4 h-4" />
    <span>{name.charAt(0) + name.slice(1).toLowerCase()}</span>
    {count > 0 && (
      <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
        activeTab === name 
          ? 'bg-primary text-white' 
          : 'bg-gray-200 text-gray-600'
      }`}>
        {count}
      </span>
    )}
  </button>
);

const ConsentRequestCard = ({ request, onApprove, onDeny, isLoading }) => {
  const imageUrl = request.photo?.public_image;
  const uploader = request.photo?.uploader;

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="flex flex-col sm:flex-row">
        {/* Image Section */}
        <div className="relative w-full sm:w-48 h-48 sm:h-auto bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          <img 
            src={imageUrl} 
            alt="Tagged photo"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/400x400/eee/ccc?text=Image'; 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={uploader?.profile_pic} 
                alt={uploader?.username}
                className="w-12 h-12 rounded-full border-2 border-accent object-cover"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = `https://placehold.co/48x48/A3B18A/FFFFFF?text=${uploader?.username?.charAt(0).toUpperCase() || '?'}`; 
                }}
              />
              <div>
                <h3 className="font-semibold text-gray-900">{uploader?.username || 'Someone'}</h3>
                <p className="text-sm text-gray-500">@{uploader?.username || 'user'}</p>
              </div>
            </div>
            {request.status === 'PENDING' && (
              <div className="flex items-center space-x-1 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-xs font-medium">
                <Clock className="w-3 h-3" />
                <span>Pending</span>
              </div>
            )}
            {request.status === 'APPROVED' && (
              <div className="flex items-center space-x-1 text-green-600 bg-green-50 px-3 py-1 rounded-full text-xs font-medium">
                <CheckCircle className="w-3 h-3" />
                <span>Approved</span>
              </div>
            )}
            {request.status === 'DENIED' && (
              <div className="flex items-center space-x-1 text-red-600 bg-red-50 px-3 py-1 rounded-full text-xs font-medium">
                <XCircle className="w-3 h-3" />
                <span>Denied</span>
              </div>
            )}
          </div>

          <p className="text-gray-600 text-sm mb-4">
            <span className="font-semibold text-gray-900">{uploader?.username || 'Someone'}</span> has tagged you in a photo
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400">
              {new Date(request.created_at).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            
            {request.status === 'PENDING' && (
              <div className="flex space-x-2">
                <button 
                  onClick={onDeny}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>Deny</span>
                </button>
                <button 
                  onClick={onApprove}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-white hover:bg-dark-accent rounded-lg font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>Approve</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ status }) => {
  const states = {
    PENDING: {
      icon: Clock,
      title: 'No pending requests',
      description: 'When someone tags you in a photo, you\'ll see it here',
      color: 'text-amber-500'
    },
    APPROVED: {
      icon: CheckCircle,
      title: 'No approved requests yet',
      description: 'Photos you\'ve approved will appear here',
      color: 'text-green-500'
    },
    DENIED: {
      icon: XCircle,
      title: 'No denied requests',
      description: 'Photos you\'ve denied will appear here',
      color: 'text-red-500'
    }
  };

  const state = states[status];
  const Icon = state.icon;

  return (
    <div className="text-center py-16">
      <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 mb-4 ${state.color}`}>
        <Icon className="w-10 h-10" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{state.title}</h3>
      <p className="text-gray-500 max-w-sm mx-auto">{state.description}</p>
    </div>
  );
};