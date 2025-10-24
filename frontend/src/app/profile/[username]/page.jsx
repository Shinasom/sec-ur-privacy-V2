// =======================================================================
// /src/app/profile/[username]/page.jsx
// Fixed version with image URL correction
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Settings, LayoutGrid, List, Loader2, ImageIcon } from 'lucide-react';
import Post from '@/components/feed/Post';

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('grid');
  const params = useParams();
  const { username } = params;
  const { user: loggedInUser } = useAuth();

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!username) return;
      setLoading(true);
      try {
        const response = await api.get(`/api/users/profile/${username}/`);
        setUserProfile(response.data.user);
        setPhotos(response.data.photos);
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
        setUserProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center py-16">User not found.</div>;
  }

  const isOwnProfile = loggedInUser?.username === userProfile.username;

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Profile Header */}
      <header className="bg-surface p-6 rounded-t-xl shadow-lg flex flex-col sm:flex-row items-center gap-6">
        <img src={userProfile.profile_pic} alt={userProfile.username} className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background object-cover" />
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-4">
            <h1 className="text-2xl font-bold text-gray-800">{userProfile.username}</h1>
            {isOwnProfile && (
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
                <Settings className="w-4 h-4" /> Edit Profile
              </button>
            )}
          </div>
          <div className="flex justify-center sm:justify-start gap-6 my-4 text-gray-700">
            <span><span className="font-bold">{photos.length}</span> posts</span>
          </div>
          <p className="text-sm text-gray-600 max-w-md">{userProfile.bio}</p>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <div className="flex justify-center border-b border-gray-200 bg-surface shadow-lg">
        <TabButton Icon={LayoutGrid} active={activeTab === 'grid'} onClick={() => setActiveTab('grid')} />
        <TabButton Icon={List} active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} />
      </div>

      {/* Photo Content */}
      <div className="bg-surface p-4 rounded-b-xl shadow-lg">
        {activeTab === 'grid' ? <PhotoGrid photos={photos} /> : <PhotoFeed photos={photos} userProfile={userProfile} />}
      </div>
    </div>
  );
}

// --- Sub-components ---

const TabButton = ({ Icon, active, onClick }) => (
  <button
    onClick={onClick}
    className={`p-4 transition-colors ${active ? 'border-t-2 border-primary text-primary' : 'text-gray-400 hover:text-primary'}`}
  >
    <Icon className="w-5 h-5" />
  </button>
);

const PhotoGrid = ({ photos }) => {
  // Helper function to fix malformed image URLs
  const fixImageUrl = (url) => {
    if (!url) return 'https://placehold.co/400x400/eee/999?text=No+Image';
    
    let imageUrl = url;
    
    // If it's a relative URL, prepend the backend base
    if (!imageUrl.startsWith('http')) {
      imageUrl = `http://localhost:8000${imageUrl}`;
    }
    
    // Fix duplicate path issue: /photos/public/.../photos/originals/... → /photos/public/...
    imageUrl = imageUrl.replace(
      /photos\/public\/(\d{4}\/\d{2}\/\d{2})\/photos\/originals\/\d{4}\/\d{2}\/\d{2}\//,
      'photos/public/$1/'
    );
    
    return imageUrl;
  };

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-semibold">No posts yet</p>
        <p className="text-sm mt-2">Photos will appear here once uploaded</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-1">
      {photos.map(photo => {
        const imageUrl = fixImageUrl(photo.public_image || photo.original_image);
        
        return (
          <div key={photo.id} className="aspect-square bg-gray-100 relative overflow-hidden group cursor-pointer">
            <img 
              src={imageUrl}
              alt={photo.caption || 'User post'} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                console.error('Failed to load image:', imageUrl);
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/400x400/eee/999?text=Image+Error';
              }}
            />
            {/* Optional: Hover overlay with likes/comments count */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="text-white text-sm font-semibold">
                {photo.likes?.length || 0} ❤️ {photo.comments?.length || 0} 💬
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const PhotoFeed = ({ photos, userProfile }) => {
  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
        <p className="text-lg font-semibold">No posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {photos.map(photo => (
        <Post key={photo.id} post={photo} uploader={userProfile} />
      ))}
    </div>
  );
};