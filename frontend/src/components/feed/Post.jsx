// =======================================================================
// /src/components/feed/Post.jsx
// This component is responsible for rendering a single post in the feed.
// This version fixes the "Invalid URL" error by using the direct URL
// from the API without modification.
// =======================================================================
'use client';

import Image from 'next/image';
import { MoreHorizontal } from 'lucide-react';
import Card from '@/components/ui/Card';
import Avatar from '@/components/ui/Avatar';

export default function Post({ post }) {
  // Guard clause to prevent crashes from invalid data.
  if (!post || !post.image) {
    return null;
  }

  // --- THE FIX ---
  // The `post.image` from our Django serializer already contains the full URL.
  // We no longer need to add the baseURL here.
  const imageUrl = post.image;

  // We still need the baseURL for the placeholder avatar.
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

  return (
    <Card>
      {/* Post Header */}
      <div className="flex items-center p-4">
        <Avatar 
          src={`${baseURL}/media/profile_pics/default.png`} // Placeholder avatar
          alt={post.uploader} 
          className="w-10 h-10" 
        />
        <div className="ml-3">
          <p className="font-bold text-gray-900 dark:text-white">{post.uploader}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
        <button aria-label="More options" className="ml-auto text-gray-400 hover:text-white">
          <MoreHorizontal />
        </button>
      </div>

      {/* Post Image Container */}
      <div className="relative w-full aspect-square bg-gray-900">
        <Image
          src={imageUrl}
          alt={post.caption || 'A photo by ' + post.uploader}
          layout="fill"
          objectFit="cover"
          unoptimized 
        />
      </div>

      {/* Post Footer & Caption */}
      {post.caption && (
        <div className="p-4">
          <p className="text-gray-800 dark:text-gray-300">
            <span className="font-bold text-gray-900 dark:text-white mr-2">{post.uploader}</span>
            {post.caption}
          </p>
        </div>
      )}
    </Card>
  );
}
