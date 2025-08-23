// =======================================================================
// /src/components/feed/Moments.jsx
// This component fetches live user data from the API to display the
// "Moments" reel.
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function Moments() {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchMomentsData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/api/users/');
        
        const currentUserMoment = {
          username: 'You',
          profile_pic: currentUser?.profile_pic || `https://placehold.co/64x64/556B2F/F5F3ED?text=You`,
        };

        const otherUsers = response.data.filter(u => u.username !== currentUser.username);

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
       <div className="bg-surface p-4 rounded-xl shadow-lg">
         <h3 className="font-bold text-md mb-3 text-gray-800 px-2">Moments</h3>
         <div className="h-[98px] flex items-center">
            <p className="text-sm text-gray-500 px-2">Loading moments...</p>
         </div>
       </div>
    );
  }

  return (
    <div className="bg-surface p-4 rounded-xl shadow-lg">
      <h3 className="font-bold text-md mb-3 text-gray-800 px-2">Moments</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {moments.map((moment, index) => (
          <div key={index} className="flex-shrink-0 text-center w-20 cursor-pointer group">
            <div className="w-16 h-16 mx-auto p-1 rounded-full ring-2 ring-offset-2 ring-accent group-hover:ring-primary transition-all">
              <img 
                src={moment.profile_pic} 
                alt={moment.username} 
                className="w-full h-full rounded-full border-2 border-surface object-cover"
                onError={(e) => { 
                  e.target.onerror = null; 
                  e.target.src = `https://placehold.co/64x64/A3B18A/FFFFFF?text=${moment.username.charAt(0).toUpperCase()}`; 
                }}
              />
            </div>
            <p className="text-xs mt-2 truncate text-gray-700">{moment.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
