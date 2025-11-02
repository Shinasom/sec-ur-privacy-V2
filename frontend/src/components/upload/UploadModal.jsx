// =======================================================================
// /src/components/upload/UploadModal.jsx
// FIXED: Fully responsive upload modal for mobile, tablet, and desktop
// =======================================================================
'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { 
  UploadCloud, 
  X, 
  Loader2, 
  MapPin, 
  Hash, 
  ImageIcon,
  Sparkles,
  ChevronLeft,
  MessageSquare
} from 'lucide-react';

export default function UploadModal({ onClose, onUploadStart }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);
  const [filter, setFilter] = useState('none');
  
  const fileInputRef = useRef(null);
  const { user } = useAuth();
  const router = useRouter();

  const filters = [
    { name: 'None', value: 'none', filter: '' },
    { name: 'Bright', value: 'bright', filter: 'brightness(1.2) contrast(1.1)' },
    { name: 'Warm', value: 'warm', filter: 'sepia(0.3) saturate(1.2)' },
    { name: 'Cool', value: 'cool', filter: 'hue-rotate(180deg) saturate(1.1)' },
    { name: 'Vintage', value: 'vintage', filter: 'sepia(0.5) contrast(1.2) brightness(1.1)' },
    { name: 'B&W', value: 'bw', filter: 'grayscale(1) contrast(1.1)' },
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files ? e.target.files[0] : e.dataTransfer.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setError('');
      setStep(2);
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

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim()) && tags.length < 10) {
        setTags([...tags, tagInput.trim()]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const buildDescription = () => {
    let description = caption.trim();
    if (location.trim()) {
      description += `\n\n📍 ${location.trim()}`;
    }
    if (tags.length > 0) {
      description += `\n\n${tags.map(tag => `#${tag}`).join(' ')}`;
    }
    return description;
  };

  const handleShare = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('original_image', file);
    const fullDescription = buildDescription();
    formData.append('caption', fullDescription);

    onClose();
    onUploadStart('uploading');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onUploadStart('processing');
      
      await api.post('/api/photos/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      onUploadStart('success');
      
      setTimeout(() => {
        router.refresh();
      }, 1000);
      
    } catch (err) {
      console.error('Upload failed:', err);
      onUploadStart('error');
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setFile(null);
      setPreview(null);
      setCaption('');
      setLocation('');
      setTags([]);
      setFilter('none');
    }
  };

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const descriptionPreview = buildDescription();

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end md:items-center justify-center z-50 p-0 md:p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-surface w-full md:max-w-5xl md:rounded-2xl rounded-t-3xl md:rounded-b-2xl shadow-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden animate-slideUp md:animate-none" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center space-x-3">
            {step === 2 && (
              <button 
                onClick={handleBack}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors -ml-2"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h2 className="text-lg font-bold text-gray-800">
              {step === 1 ? 'Create new post' : 'Edit your post'}
            </h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Image Preview / Upload Area */}
          <div className={`flex-1 bg-gray-50 flex items-center justify-center p-4 ${
            step === 1 ? 'min-h-[400px]' : 'min-h-[300px] md:min-h-0'
          }`}>
            {step === 1 ? (
              <div 
                className={`relative w-full h-full flex items-center justify-center transition-colors duration-300 border-2 border-dashed rounded-xl ${
                  isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}
                onDragEnter={e => handleDragEvents(e, true)} 
                onDragLeave={e => handleDragEvents(e, false)} 
                onDragOver={e => e.preventDefault()} 
                onDrop={handleDrop}
              >
                <div className="text-center p-6 md:p-8">
                  <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 md:mb-6 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center">
                    <UploadCloud className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                    {isDragging ? 'Drop your photo here' : 'Select a photo to share'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 md:mb-6">or drag and drop it here</p>
                  <button 
                    onClick={() => fileInputRef.current.click()} 
                    type="button" 
                    className="inline-flex items-center px-5 py-2.5 md:px-6 md:py-3 border-none shadow-lg text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-primary to-dark-accent hover:shadow-xl transition-all duration-200"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Choose from Device
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*" 
                  />
                  <p className="text-xs text-gray-400 mt-4">
                    JPG, PNG or GIF • Max 10MB
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center max-h-[400px] md:max-h-none">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                  style={{ filter: filters.find(f => f.value === filter)?.filter || '' }}
                />
              </div>
            )}
          </div>

          {/* Details Form - Only visible in step 2 */}
          {step === 2 && (
            <div className="w-full md:w-96 flex flex-col bg-white overflow-y-auto max-h-[500px] md:max-h-none">
              <div className="p-4 md:p-5 flex flex-col flex-1">
                {/* User Info */}
                <div className="flex items-center space-x-3 mb-4 pb-3 md:pb-4 border-b">
                  <img 
                    src={user?.profile_pic || `https://placehold.co/40x40/556B2F/F5F3ED?text=${user?.username?.charAt(0).toUpperCase() || 'U'}`} 
                    alt="Your Profile" 
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover ring-2 ring-primary/20" 
                  />
                  <span className="font-semibold text-sm text-gray-800">{user?.username}</span>
                </div>

                {/* Caption */}
                <div className="mb-4">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4 mr-1 text-primary" />
                    Caption
                  </label>
                  <textarea 
                    value={caption} 
                    onChange={(e) => setCaption(e.target.value)} 
                    placeholder="Write something about this photo..." 
                    className="w-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg resize-none text-sm p-3 bg-gray-50" 
                    rows="3"
                    maxLength={400}
                  ></textarea>
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {caption.length}/400
                  </p>
                </div>

                {/* Filters */}
                <div className="mb-4">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2 md:mb-3">
                    <Sparkles className="w-4 h-4 mr-1 text-primary" />
                    Filters
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {filters.map(f => (
                      <button
                        key={f.value}
                        onClick={() => setFilter(f.value)}
                        className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                          filter === f.value 
                            ? 'border-primary shadow-md ring-2 ring-primary/20' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div 
                          className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300"
                          style={{ filter: f.filter }}
                        ></div>
                        <span className={`absolute bottom-0 inset-x-0 text-white text-[10px] font-medium py-1 text-center ${
                          filter === f.value ? 'bg-primary' : 'bg-black/60'
                        }`}>
                          {f.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mr-1 text-primary" />
                    Add Location (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)} 
                    placeholder="Where was this taken?" 
                    className="w-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg text-sm p-3 bg-gray-50" 
                  />
                </div>

                {/* Tags */}
                <div className="mb-4">
                  <label className="flex items-center text-xs font-semibold text-gray-700 mb-2">
                    <Hash className="w-4 h-4 mr-1 text-primary" />
                    Add Tags (Optional)
                  </label>
                  <input 
                    type="text" 
                    value={tagInput} 
                    onChange={(e) => setTagInput(e.target.value)} 
                    onKeyDown={handleAddTag}
                    placeholder="Press Enter to add tags" 
                    className="w-full border border-gray-200 focus:ring-2 focus:ring-primary focus:border-transparent rounded-lg text-sm p-3 bg-gray-50" 
                  />
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map(tag => (
                        <span 
                          key={tag} 
                          className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          #{tag}
                          <button 
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-dark-accent"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description Preview */}
                {(caption || location || tags.length > 0) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Preview:</p>
                    <p className="text-xs text-gray-700 whitespace-pre-wrap line-clamp-3">
                      {descriptionPreview || 'Your description will appear here...'}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 text-sm text-center text-red-800 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                {/* Share Button - Sticky at bottom on mobile */}
                <div className="mt-auto pt-4 border-t sticky bottom-0 bg-white md:static">
                  <button 
                    onClick={handleShare} 
                    disabled={!file} 
                    className="w-full bg-gradient-to-r from-primary to-dark-accent text-white py-3 rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Share Post
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}