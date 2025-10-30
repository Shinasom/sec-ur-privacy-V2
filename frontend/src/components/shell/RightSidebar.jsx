// frontend/src/components/shell/RightSidebar.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Check, X, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import ConsentModal from '@/components/consent/ConsentModal';

export default function RightSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [consentRequests, setConsentRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConsentModalOpen, setConsentModalOpen] = useState(false);

  useEffect(() => {
    const fetchSidebarData = async () => {
      if (!user) return;
      
      try {
        // Fetch consent requests
        const consentRes = await api.get('/api/consent-requests/');
        const pending = consentRes.data.filter(r => r.status === 'PENDING');
        setConsentRequests(pending.slice(0, 3));

        // Fetch user suggestions
        const usersRes = await api.get('/api/users/');
        const otherUsers = usersRes.data.filter(u => u.username !== user.username);
        setSuggestions(otherUsers.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, [user]);

  const handleConsentAction = async (id, status) => {
    try {
      await api.patch(`/api/consent-requests/${id}/`, { status });
      setConsentRequests(consentRequests.filter(r => r.id !== id));
    } catch (error) {
      console.error(`Failed to ${status.toLowerCase()} request:`, error);
    }
  };

  return (
    <>
      <aside className="bg-surface border-l border-gray-200 w-80 fixed top-0 right-0 h-full z-30 hidden lg:flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
          <div className="flex items-center space-x-2 p-2 rounded-lg hover:bg-background cursor-pointer transition-colors">
            <img
              src={user?.profile_pic || 'https://placehold.co/32x32/556B2F/F5F3ED?text=U'}
              alt="Your Profile"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="font-semibold text-sm text-gray-700">
              {user?.username || 'loading...'}
            </span>
          </div>
          
          {/* Bell Icon - Opens Modal */}
          <button 
            onClick={() => setConsentModalOpen(true)}
            className="relative p-2 rounded-full hover:bg-background transition-colors group"
          >
            <Bell className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            {consentRequests.length > 0 && (
              <>
                <span className="absolute top-1 right-1 block h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {consentRequests.length}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Consent Requests Preview */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-gray-700">Consent Requests</h3>
              </div>
              {consentRequests.length > 0 && (
                <button 
                  onClick={() => setConsentModalOpen(true)}
                  className="text-xs font-bold text-primary hover:text-dark-accent transition-colors"
                >
                  View All ({consentRequests.length})
                </button>
              )}
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : consentRequests.length > 0 ? (
              <>
                {consentRequests.slice(0, 2).map(request => (
                  <ConsentRequestPreview 
                    key={request.id}
                    request={request}
                    onClick={() => setConsentModalOpen(true)}
                  />
                ))}
                {consentRequests.length > 2 && (
                  <button 
                    onClick={() => setConsentModalOpen(true)}
                    className="w-full py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                  >
                    + {consentRequests.length - 2} more request{consentRequests.length - 2 !== 1 ? 's' : ''}
                  </button>
                )}
              </>
            ) : (
              <div className="text-center py-6 bg-background rounded-lg">
                <ShieldCheck className="w-8 h-8 text-accent mx-auto mb-2" />
                <p className="text-xs text-gray-500">No pending requests</p>
              </div>
            )}
          </div>

          <hr className="border-gray-200" />

          {/* Privacy Tip */}
          <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-4 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1">Privacy Tip</h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Always review consent requests before approving. You control who can use your photos!
                </p>
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Suggestions Section */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4 text-primary" />
                <h3 className="font-semibold text-sm text-gray-700">Suggestions For You</h3>
              </div>
              <button 
                onClick={() => router.push('/discover')}
                className="text-xs font-bold text-primary hover:text-dark-accent transition-colors"
              >
                See All
              </button>
            </div>

            {loading ? (
              <div className="text-center py-4">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
              </div>
            ) : (
              suggestions.map(suggestedUser => (
                <SuggestionItem 
                  key={suggestedUser.id}
                  user={suggestedUser}
                />
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-4 text-center text-xs text-gray-400 border-t border-gray-200">
          <p className="mb-1">&copy; 2025 Unmask</p>
          <p className="text-[10px]">Reveal on Your Terms</p>
        </footer>
      </aside>

      {/* Consent Modal */}
      <ConsentModal 
        isOpen={isConsentModalOpen} 
        onClose={() => setConsentModalOpen(false)} 
      />
    </>
  );
}

// Sub-components

const ConsentRequestPreview = ({ request, onClick }) => {
  const uploader = request.photo?.uploader;
  
  return (
    <div 
      onClick={onClick}
      className="bg-background p-3 rounded-lg border border-gray-200 hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex-shrink-0">
          <img 
            src={request.photo?.public_image} 
            alt="Request preview" 
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => { 
              e.target.onerror = null; 
              e.target.src = 'https://placehold.co/48x48/eee/ccc?text=Photo'; 
            }}
          />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-tr from-amber-400 to-orange-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1 mb-1">
            <img 
              src={uploader?.profile_pic} 
              alt={uploader?.username} 
              className="w-5 h-5 rounded-full"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = `https://placehold.co/20x20/ccc/999?text=${uploader?.username?.charAt(0) || '?'}`; 
              }}
            />
            <p className="text-xs font-semibold text-gray-800 truncate">
              {uploader?.username || 'Someone'}
            </p>
          </div>
          <p className="text-[11px] text-gray-600">Tagged you in a photo</p>
        </div>
        <div className="text-primary group-hover:translate-x-1 transition-transform">
          →
        </div>
      </div>
    </div>
  );
};

const SuggestionItem = ({ user }) => {
  const router = useRouter();
  
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-background transition-colors">
      <div 
        className="flex items-center space-x-3 flex-1 cursor-pointer"
        onClick={() => router.push(`/profile/${user.username}`)}
      >
        <img 
          src={user.profile_pic} 
          alt={user.username} 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/40x40/A3B18A/FFFFFF?text=${user.username?.charAt(0) || '?'}`; 
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-gray-800 truncate">{user.username}</p>
          <p className="text-xs text-gray-500 truncate">
            {user.bio || 'New to SEC-UR Privacy'}
          </p>
        </div>
      </div>
      <button className="text-xs font-bold text-primary hover:text-dark-accent px-3 py-1 rounded-md hover:bg-primary/5 transition-colors">
        Follow
      </button>
    </div>
  );
};