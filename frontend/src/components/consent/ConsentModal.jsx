// frontend/src/components/consent/ConsentModal.jsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Check, X, ShieldCheck, Loader2, Clock, CheckCircle, XCircle, Sparkles, ChevronDown } from 'lucide-react';

export default function ConsentModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!isOpen) return;
    
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
  }, [user, isOpen]);

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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-fadeIn"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-slideUp max-h-[90vh] flex flex-col">
        <div className="bg-white rounded-t-3xl shadow-2xl flex flex-col max-h-[90vh] mx-auto w-full max-w-2xl">
          {/* Handle Bar */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="px-6 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-primary to-dark-accent rounded-xl">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Consent Requests</h2>
                  <p className="text-xs text-gray-500">Manage your photo tags</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronDown className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-full p-1">
              <TabButton 
                name="PENDING" 
                activeTab={activeTab} 
                onClick={setActiveTab} 
                count={pendingCount}
                emoji="⏳"
              />
              <TabButton 
                name="APPROVED" 
                activeTab={activeTab} 
                onClick={setActiveTab} 
                count={approvedCount}
                emoji="✅"
              />
              <TabButton 
                name="DENIED" 
                activeTab={activeTab} 
                onClick={setActiveTab} 
                count={deniedCount}
                emoji="❌"
              />
            </div>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
                  <p className="text-sm text-gray-500">Loading requests...</p>
                </div>
              </div>
            ) : filteredRequests.length > 0 ? (
              <div className="space-y-3">
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
      </div>
    </>
  );
}

// --- Sub-components ---

const TabButton = ({ name, activeTab, onClick, count, emoji }) => (
  <button
    onClick={() => onClick(name)}
    className={`flex-1 py-2 px-3 rounded-full font-semibold text-xs transition-all ${
      activeTab === name
        ? 'bg-gradient-to-r from-primary to-dark-accent text-white shadow-md'
        : 'text-gray-600 hover:text-gray-900'
    }`}
  >
    <span className="flex items-center justify-center space-x-1.5">
      <span>{emoji}</span>
      <span className="hidden sm:inline">{name.charAt(0) + name.slice(1).toLowerCase()}</span>
      {count > 0 && activeTab !== name && (
        <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
          {count}
        </span>
      )}
    </span>
  </button>
);

const ConsentRequestCard = ({ request, onApprove, onDeny, isLoading }) => {
  const imageUrl = request.photo?.public_image;
  const uploader = request.photo?.uploader;
  const timeAgo = getTimeAgo(request.created_at);

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden hover:bg-gray-100 transition-all border border-gray-200">
      <div className="flex items-start p-3 space-x-3">
        {/* Image Thumbnail */}
        <div className="relative flex-shrink-0">
          <img 
            src={imageUrl} 
            alt="Tagged photo"
            className="w-20 h-20 rounded-xl object-cover"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/80x80/eee/ccc?text=Photo'; 
            }}
          />
          {request.status === 'PENDING' && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full flex items-center justify-center border-2 border-white">
              <Clock className="w-3 h-3 text-white" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <img 
              src={uploader?.profile_pic} 
              alt={uploader?.username}
              className="w-8 h-8 rounded-full object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = `https://placehold.co/32x32/A3B18A/FFF?text=${uploader?.username?.charAt(0) || '?'}`; 
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">
                {uploader?.username || 'Someone'}
              </p>
              <p className="text-xs text-gray-500">{timeAgo}</p>
            </div>
            {request.status === 'APPROVED' && (
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            )}
            {request.status === 'DENIED' && (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
          </div>

          <p className="text-xs text-gray-600 mb-2">
            Tagged you in a photo
          </p>

          {/* Action Buttons */}
          {request.status === 'PENDING' && (
            <div className="flex gap-2">
              <button 
                onClick={onDeny}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-white hover:bg-red-50 text-gray-700 hover:text-red-600 rounded-lg font-semibold text-xs transition-all disabled:opacity-50 border border-gray-300 hover:border-red-300"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <X className="w-3.5 h-3.5" />
                    <span>Deny</span>
                  </>
                )}
              </button>
              <button 
                onClick={onApprove}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-primary to-dark-accent text-white rounded-lg font-semibold text-xs transition-all shadow-sm hover:shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ status }) => {
  const states = {
    PENDING: { emoji: '⏳', title: 'All caught up!', description: 'No pending requests' },
    APPROVED: { emoji: '✅', title: 'No approved photos', description: 'Approved photos appear here' },
    DENIED: { emoji: '❌', title: 'No denied requests', description: 'Denied requests appear here' }
  };

  const state = states[status];

  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-3">{state.emoji}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-1">{state.title}</h3>
      <p className="text-sm text-gray-500">{state.description}</p>
    </div>
  );
};

function getTimeAgo(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1${unit[0]}` : `${interval}${unit[0]}`;
    }
  }
  return 'now';
}