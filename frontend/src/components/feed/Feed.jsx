// /src/components/feed/Feed.jsx
// This is the core client component for the feed. It's responsible for
// fetching photo data from our API and managing the display state.
// SIMPLIFIED VERSION: This version only fetches photos.
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api'; // We'll use our api client directly here
import Post from './Post'; // We will create this component next

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get the logged-in user from our context

  // This useEffect hook runs when the component mounts or when the user changes.
  useEffect(() => {
    const fetchPosts = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // We now only fetch the list of photos.
        const response = await api.get('/api/photos/');
        setPosts(response.data);

      } catch (error) {
        console.error("Failed to fetch feed data:", error);
        // In a real app, you might want to show an error message to the user.
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [user]); // The dependency array ensures this runs again if the user logs in/out.

  if (loading) {
    return (
      <div className="w-full max-w-[680px] py-8 px-4 lg:px-0 text-center">
        <p className="text-gray-500 dark:text-gray-400">Loading feed...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[680px] py-8 px-4 lg:px-0 pb-20 lg:pb-0">
      <div className="space-y-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Post key={post.id} post={post} />
          ))
        ) : (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
             <p className="text-lg">Your feed is empty.</p>
             <p className="text-sm mt-2">Upload a photo to see it here!</p>
          </div>
        )}
      </div>
    </div>
  );
}
