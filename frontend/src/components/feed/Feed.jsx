// =======================================================================
// /src/components/feed/Feed.jsx
// This is the final, corrected version. It makes a single, efficient
// API call to fetch posts, which now include all necessary uploader data.
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Post from './Post';
import Moments from './Moments';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // 1. Fetch photos with a SINGLE API call.
        // The backend now provides the uploader data nested inside each post.
        const photosResponse = await api.get('/api/photos/');
        setPosts(photosResponse.data);

      } catch (error) {
        console.error("Failed to fetch feed data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) {
    return <div className="text-center py-16 text-gray-500">Loading feed...</div>;
  }

  return (
    <div className="w-full space-y-8 pb-20 lg:pb-0">
      <Moments />
      {posts.length > 0 ? (
        posts.map((post) => {
          // 2. The uploader object is now directly available on the post.
          // No need for a separate 'users' map or lookup.
          return (
            <Post
              key={post.id}
              post={post}
              uploader={post.uploader} // 3. Pass the nested uploader object directly.
            />
          );
        })
      ) : (
        <div className="text-center py-16 text-gray-500 bg-surface rounded-xl shadow-lg">
          <p className="text-lg">Your feed is empty.</p>
          <p className="text-sm mt-2">Upload a photo to see it here!</p>
        </div>
      )}
    </div>
  );
}