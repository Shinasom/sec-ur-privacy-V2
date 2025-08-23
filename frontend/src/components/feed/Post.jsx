// =======================================================================
// /src/components/feed/Post.jsx
// This version is simplified. It receives the full `uploader` object
// as a prop from the parent Feed component.
// =======================================================================
'use client';

import Image from 'next/image';
import { MoreHorizontal, Heart, Bookmark } from 'lucide-react';

export default function Post({ post, uploader }) {
  // Guard against missing data. If the uploader wasn't found in the map,
  // we can choose to render nothing or a fallback state.
  if (!post || !post.public_image || !uploader) {
    return null; 
  }

  return (
    <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
      {/* Post Header */}
      <div className="flex items-center p-4">
        <img 
          // We now get the profile_pic from the uploader prop.
          src={uploader.profile_pic} 
          alt={uploader.username} 
          className="w-10 h-10 rounded-full object-cover" 
          onError={(e) => { 
            e.target.onerror = null; 
            e.target.src = `https://placehold.co/40x40/556B2F/F5F3ED?text=${uploader.username.charAt(0).toUpperCase()}`; 
          }}
        />
        <div className="ml-3">
          <p className="font-semibold text-sm text-gray-800">{uploader.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
        <button className="ml-auto p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-colors">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Image Container */}
      <div className="relative w-full">
        <Image
          src={post.public_image}
          alt={post.caption || 'A photo by ' + uploader.username}
          width={1200}
          height={900}
          layout="responsive"
          objectFit="cover"
          unoptimized 
        />
      </div>

      {/* Post Footer */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
             <p className="font-semibold text-sm text-gray-800">{post.likes || 0} likes</p>
          </div>
          <div className="flex items-center space-x-1">
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-red-500 transition-colors"><Heart className="w-5 h-5" /></button>
            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-primary transition-colors"><Bookmark className="w-5 h-5" /></button>
          </div>
        </div>
        {post.caption && (
          <p className="text-gray-700 text-sm">
            <span className="font-semibold text-gray-800 mr-2">{uploader.username}</span>
            {post.caption}
          </p>
        )}
      </div>
    </div>
  );
}
