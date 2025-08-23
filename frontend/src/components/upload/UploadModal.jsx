// /src/components/upload/UploadModal.jsx
// The new modal component for uploading posts.
// =======================================================================
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { UploadCloud, X, Loader2, UserPlus, MapPin, ChevronDown } from 'lucide-react';

export default function UploadModal({ onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleDragEvents = (e, dragging) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  const handleDrop = (e) => {
    handleDragEvents(e, false);
    handleFileChange(e);
  };

  const handleShare = async () => {
    if (!file) return;
    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);

    try {
      await api.post('/api/photos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onClose(); // Close the modal on success
      router.refresh(); // Refresh the feed to show the new post
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-surface rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-bold text-gray-800">Create new post</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100"><X className="w-5 h-5 text-gray-600" /></button>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Image Preview / Upload Area */}
          <div 
            className={`relative flex-1 bg-gray-50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r transition-colors duration-300 ${isDragging ? 'bg-accent/20' : ''}`} 
            onDragEnter={e => handleDragEvents(e, true)} 
            onDragLeave={e => handleDragEvents(e, false)} 
            onDragOver={e => e.preventDefault()} 
            onDrop={handleDrop}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="max-h-full max-w-full object-contain rounded-lg" />
            ) : (
              <div className="text-center p-8">
                <UploadCloud className="mx-auto h-24 w-24 text-gray-300" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Drag & drop photos here</h3>
                <p className="mt-1 text-sm text-gray-500">or</p>
                <button onClick={() => fileInputRef.current.click()} type="button" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-opacity-90">
                  Upload from Device
                </button>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              </div>
            )}
            {isDragging && <div className="absolute inset-0 border-4 border-dashed border-primary rounded-xl"></div>}
          </div>

          {/* Details Form */}
          <div className={`w-full md:w-80 p-4 flex flex-col transition-all duration-300 ${file ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <img src={user?.profile_pic || `https://placehold.co/40x40/556B2F/F5F3ED?text=${user?.username?.charAt(0).toUpperCase() || 'U'}`} alt="Your Profile" className="w-10 h-10 rounded-full object-cover" />
              <span className="font-semibold text-sm">{user?.username}</span>
            </div>
            <textarea value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="Write a caption..." className="w-full flex-1 border-none focus:ring-0 resize-none text-sm p-2 bg-transparent" rows="6"></textarea>
            
            {error && <p className="text-sm text-red-600 my-2">{error}</p>}

            <div className="mt-auto pt-4 border-t">
              <button onClick={handleShare} disabled={isUploading || !file} className="w-full bg-primary text-white py-2.5 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors flex items-center justify-center disabled:bg-opacity-50">
                {isUploading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : 'Share'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
