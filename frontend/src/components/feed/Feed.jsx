// =======================================================================
// /src/components/feed/Feed.jsx
// This updated version fetches both photos and users, then combines
// the data before rendering the posts.
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Post from './Post';
import Moments from './Moments';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState(new Map()); // Use a Map for efficient lookups
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
        // 1. Fetch both photos and users at the same time.
        const [photosResponse, usersResponse] = await Promise.all([
          api.get('/api/photos/'),
          api.get('/api/users/')
        ]);

        // 2. Create a Map for quick user lookups by username.
        const usersMap = new Map(
          usersResponse.data.map(u => [u.username, u])
        );
        
        // Add mock likes for UI purposes for now
        const postsWithLikes = photosResponse.data.map(post => ({ ...post, likes: Math.floor(Math.random() * 500) }));

        setPosts(postsWithLikes);
        setUsers(usersMap);

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
          // 3. For each post, find the full uploader object from our Map.
          const uploaderData = users.get(post.uploader);
          return (
            <Post 
              key={post.id} 
              post={post} 
              uploader={uploaderData} // 4. Pass it as a separate prop.
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