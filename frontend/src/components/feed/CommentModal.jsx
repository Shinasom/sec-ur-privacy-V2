// =======================================================================
// /src/components/feed/CommentModal.jsx
// A new modal component to display all comments for a post and allow
// users to add new comments.
// =======================================================================
'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { X, Send } from 'lucide-react';

export default function CommentModal({ post, onClose, onCommentAdded }) {
    const { user } = useAuth();
    const [comments, setComments] = useState(post.comments || []);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setIsSubmitting(true);
        try {
            const response = await api.post('/api/comments/', { photo: post.id, text: newComment });
            const newCommentData = response.data;
            // Update the modal's internal state
            setComments([...comments, newCommentData]);
            // Notify the parent Post component so it can update its state too
            onCommentAdded(newCommentData);
            setNewComment('');
        } catch (error) {
            console.error("Failed to post comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-surface rounded-xl shadow-2xl w-full max-w-lg h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-bold text-gray-800">Comments</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
                        <X className="w-5 h-5 text-gray-600" />
                    </button>
                </div>

                {/* Comments List (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length > 0 ? (
                        comments.map(comment => (
                            <div key={comment.id} className="flex items-start space-x-3">
                                <img src={comment.user.profile_pic} alt={comment.user.username} className="w-9 h-9 rounded-full object-cover" />
                                <div>
                                    <p className="text-sm">
                                        <span className="font-semibold text-gray-800 mr-2">{comment.user.username}</span>
                                        {comment.text}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(comment.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No comments yet.</p>
                    )}
                </div>

                {/* Comment Input Form (Fixed at the bottom) */}
                <form onSubmit={handleCommentSubmit} className="flex items-center p-4 border-t">
                    <img src={user?.profile_pic} alt="Your profile" className="w-9 h-9 rounded-full object-cover mr-3" />
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-grow bg-gray-100 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-primary text-sm"
                    />
                    <button type="submit" className="p-2 ml-2 text-primary disabled:opacity-50" disabled={!newComment.trim() || isSubmitting}>
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            </div>
        </div>
    );
}