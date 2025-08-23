// =======================================================================
// /src/app/consent/page.jsx
// This is the final, efficient version. It makes a single API call
// and relies on the backend to provide all necessary nested data.
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Check, X, ShieldCheck, Loader2 } from 'lucide-react';

export default function ConsentPage() {
  const [activeTab, setActiveTab] = useState('PENDING');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      setLoading(true);
      try {
        // 1. Fetch all consent requests with a SINGLE API call.
        // The backend now provides all the photo and uploader data we need.
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

  // Handles updating the status of a request via a PATCH request
  const handleUpdateRequest = async (id, status) => {
    try {
      const originalRequests = requests;
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
      await api.patch(`/api/consent-requests/${id}/`, { status });
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} request:`, error);
      setRequests(originalRequests); 
    }
  };

  const filteredRequests = requests.filter(r => r.status === activeTab);
  const pendingCount = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-surface p-6 rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <ShieldCheck className="w-8 h-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Manage Your Consent</h1>
        </div>

        <div className="flex border-b border-gray-200 mb-6">
          <TabButton name="PENDING" activeTab={activeTab} onClick={setActiveTab} count={pendingCount} />
          <TabButton name="APPROVED" activeTab={activeTab} onClick={setActiveTab} />
          <TabButton name="DENIED" activeTab={activeTab} onClick={setActiveTab} />
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredRequests.length > 0 ? (
            filteredRequests.map(request => (
              <ConsentRequestCard 
                key={request.id} 
                request={request}
                onApprove={() => handleUpdateRequest(request.id, 'APPROVED')}
                onDeny={() => handleUpdateRequest(request.id, 'DENIED')}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 py-8">No {activeTab.toLowerCase()} requests.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

const TabButton = ({ name, activeTab, onClick, count }) => (
  <button
    onClick={() => onClick(name)}
    className={`py-2 px-4 text-sm font-semibold transition-colors relative ${
      activeTab === name
        ? 'text-primary border-b-2 border-primary'
        : 'text-gray-500 hover:text-primary'
    }`}
  >
    {name.charAt(0) + name.slice(1).toLowerCase()}
    {name === 'PENDING' && count > 0 && (
      <span className="absolute top-1 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
        {count}
      </span>
    )}
  </button>
);

const ConsentRequestCard = ({ request, onApprove, onDeny }) => {
  // 2. Access the nested data provided by our new, smarter API.
  const imageUrl = request.photo?.public_image;
  const uploader = request.photo?.uploader;

  return (
    <div className="bg-gray-50 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <img 
        src={imageUrl} 
        alt="Photo preview" 
        className="w-full sm:w-32 h-32 object-cover rounded-md bg-gray-200" 
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x128/eee/ccc?text=Image'; }}
      />
      
      <div className="flex-1">
        <div className="flex items-center mb-2">
          <img 
            src={uploader?.profile_pic} 
            alt={uploader?.username} 
            className="w-8 h-8 rounded-full mr-2 bg-gray-300" 
            onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/32x32/ccc/999?text=${uploader?.username?.charAt(0).toUpperCase() || '?'}`; }}
          />
          <p className="text-sm">
            <span className="font-bold text-gray-800">{uploader?.username || 'Someone'}</span>
            <span className="text-gray-600"> has tagged you in a photo.</span>
          </p>
        </div>
        <p className="text-xs text-gray-500">
          Requested on: {new Date(request.created_at).toLocaleDateString()}
        </p>
      </div>

      {request.status === 'PENDING' && (
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button onClick={onDeny} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg transition-colors">
            <X className="w-4 h-4" /> Deny
          </button>
          <button onClick={onApprove} className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-opacity-90 rounded-lg transition-colors">
            <Check className="w-4 h-4" /> Approve
          </button>
        </div>
      )}
    </div>
  );
};
