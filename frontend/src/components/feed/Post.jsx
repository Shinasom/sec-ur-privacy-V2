// =======================================================================
// /src/components/feed/Post.jsx
// This version implements the new comment modal feature.
// =======================================================================
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { MoreHorizontal, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import CommentModal from './CommentModal'; // <-- Import the new modal

export default function Post({ post, uploader }) {
    const { user } = useAuth();
    const [likes, setLikes] = useState(post.likes || []);
    const [comments, setComments] = useState(post.comments || []);
    const [isCommentModalOpen, setCommentModalOpen] = useState(false); // <-- State for the modal

    if (!post || !post.public_image || !uploader) {
        return null;
    }

    const hasLiked = likes.some(like => like.user.id === user.id);

    const handleLike = async () => {
        if (hasLiked) {
            const like = likes.find(like => like.user.id === user.id);
            await api.delete(`/api/likes/${like.id}/`);
            setLikes(likes.filter(l => l.id !== like.id));
        } else {
            const response = await api.post('/api/likes/', { photo: post.id });
            setLikes([...likes, response.data]);
        }
    };

    // Callback function for the modal to update the post's comment state
    const handleCommentAdded = (newComment) => {
        setComments([...comments, newComment]);
    };

    return (
        <>
            <div className="bg-surface rounded-xl shadow-lg overflow-hidden">
                {/* Post Header */}
                <div className="flex items-center p-4">
                    <img src={uploader.profile_pic} alt={uploader.username} className="w-10 h-10 rounded-full object-cover" />
                    <div className="ml-3">
                        <p className="font-semibold text-sm text-gray-800">{uploader.username}</p>
                        <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                    <button className="ml-auto p-2 rounded-full text-gray-500 hover:bg-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>

                {/* Post Image */}
                <div className="relative w-full">
                    <Image src={post.public_image} alt={post.caption || 'A photo by ' + uploader.username} width={1200} height={900} layout="responsive" objectFit="cover" unoptimized />
                </div>

                {/* Post Footer & Interactions */}
                <div className="p-4">
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2">
                        <button onClick={handleLike} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <Heart className={`w-6 h-6 ${hasLiked ? 'text-red-500 fill-current' : 'text-gray-500'}`} />
                        </button>
                        <button onClick={() => setCommentModalOpen(true)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                            <MessageCircle className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    <p className="font-semibold text-sm text-gray-800 mt-2">{likes.length} likes</p>

                    {post.caption && (
                        <p className="text-gray-700 text-sm mt-1">
                            <span className="font-semibold text-gray-800 mr-2">{uploader.username}</span>
                            {post.caption}
                        </p>
                    )}

                    {/* NEW: View all comments button */}
                    {comments.length > 2 && (
                        <button onClick={() => setCommentModalOpen(true)} className="text-sm text-gray-500 mt-2 hover:underline">
                            View all {comments.length} comments
                        </button>
                    )}

                    {/* NEW: Show only the top two comments */}
                    <div className="mt-2 space-y-1">
                        {comments.slice(0, 2).map(comment => (
                            <p key={comment.id} className="text-sm text-gray-600">
                                <span className="font-semibold text-gray-800 mr-2">{comment.user.username}</span>
                                {comment.text}
                            </p>
                        ))}
                    </div>
                </div>
            </div>

            {/* NEW: Conditionally render the modal */}
            {isCommentModalOpen && (
                <CommentModal
                    post={post}
                    onClose={() => setCommentModalOpen(false)}
                    onCommentAdded={handleCommentAdded}
                />
            )}
        </>
    );
}