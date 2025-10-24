// =======================================================================
// /src/components/upload/UploadToast.jsx
// Toast notification component for background upload progress
// =======================================================================
'use client';

import { CheckCircle, Loader2, AlertCircle, X } from 'lucide-react';

export default function UploadToast({ status, onClose }) {
  // status can be: 'uploading', 'processing', 'success', 'error'
  
  const getContent = () => {
    switch (status) {
      case 'uploading':
        return {
          icon: <Loader2 className="w-5 h-5 text-primary animate-spin" />,
          title: 'Uploading your photo...',
          description: 'Please wait while we process your image',
          bgColor: 'bg-blue-50 border-blue-200',
          showProgress: true
        };
      case 'processing':
        return {
          icon: <Loader2 className="w-5 h-5 text-primary animate-spin" />,
          title: 'Processing your photo...',
          description: 'Running face detection and privacy checks',
          bgColor: 'bg-blue-50 border-blue-200',
          showProgress: true
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          title: 'Photo uploaded successfully!',
          description: 'Your photo is now live on your feed',
          bgColor: 'bg-green-50 border-green-200',
          showProgress: false
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-600" />,
          title: 'Upload failed',
          description: 'Please try again or check your connection',
          bgColor: 'bg-red-50 border-red-200',
          showProgress: false
        };
      default:
        return null;
    }
  };

  const content = getContent();
  if (!content) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideInRight">
      <div className={`${content.bgColor} border rounded-xl shadow-lg p-4 min-w-[320px] max-w-sm`}>
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {content.icon}
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-gray-800 mb-1">
              {content.title}
            </h4>
            <p className="text-xs text-gray-600">
              {content.description}
            </p>
            {content.showProgress && (
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-dark-accent rounded-full animate-progressBar"></div>
                </div>
              </div>
            )}
          </div>
          {status === 'success' || status === 'error' ? (
            <button 
              onClick={onClose}
              className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}