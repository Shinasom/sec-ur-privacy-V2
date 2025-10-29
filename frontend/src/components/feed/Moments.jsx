// =======================================================================
// /src/components/feed/Moments.jsx
// Cleaner moments/stories section with better styling
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Plus, Loader2 } from 'lucide-react';

export default function Moments() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchMomentsData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/users/');
        
        // Create "Your Story" moment
        const currentUserMoment = {
          id: 'you',
          username: 'You',
          profile_pic: currentUser?.profile_pic || `https://placehold.co/80x80/556B2F/F5F3ED?text=You`,
          isYou: true,
        };

        // Get other users
        const otherUsers = response.data
          .filter(u => u.username !== currentUser.username)
          .map(u => ({ ...u, isYou: false }));

        setMoments([currentUserMoment, ...otherUsers]);

      } catch (error) {
        console.error("Failed to fetch moments data:", error);
        setMoments([]);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchMomentsData();
    }
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-surface rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-2xl shadow-md border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-bold text-lg text-gray-900">Stories</h3>
      </div>

      {/* Moments Scroll Container */}
      <div className="px-4 py-5">
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {moments.map((moment, index) => (
            <MomentItem key={moment.id || index} moment={moment} />
          ))}
        </div>
      </div>
    </div>
  );
}

// Individual Moment Item Component
const MomentItem = ({ moment }) => {
  return (
    <button className="flex-shrink-0 text-center group">
      <div className="relative mb-2">
        {/* Ring/Border */}
        <div className={`w-20 h-20 rounded-full p-1 ${
          moment.isYou 
            ? 'bg-gradient-to-br from-accent to-primary' 
            : 'bg-gradient-to-br from-primary via-dark-accent to-accent'
        } group-hover:scale-105 transition-transform duration-300`}>
          {/* Image Container */}
          <div className="w-full h-full rounded-full bg-surface p-0.5">
            <img 
              src={moment.profile_pic} 
              alt={moment.username} 
              className="w-full h-full rounded-full object-cover"
              onError={(e) => { 
                e.target.onerror = null; 
                e.target.src = `https://placehold.co/80x80/A3B18A/FFFFFF?text=${moment.username.charAt(0).toUpperCase()}`; 
              }}
            />
          </div>
        </div>

        {/* Plus Icon for "You" */}
        {moment.isYou && (
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-primary to-dark-accent rounded-full flex items-center justify-center border-2 border-surface shadow-md">
            <Plus className="w-4 h-4 text-white" strokeWidth={3} />
          </div>
        )}
      </div>

      {/* Username */}
      <p className="text-xs font-medium text-gray-700 max-w-[80px] truncate group-hover:text-primary transition-colors">
        {moment.username}
      </p>
    </button>
  );
};