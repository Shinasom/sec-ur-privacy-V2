// =======================================================================
// /src/app/feed/layout.jsx
// This version fixes the scrolling issue by applying fixed positioning
// to the sidebars.
// =======================================================================
'use client';

import { useState } from 'react';
import Sidebar from '@/components/shell/Sidebar';
import RightSidebar from '@/components/shell/RightSidebar';
import BottomNav from '@/components/shell/BottomNav';
import Header from '@/components/shell/Header';
import UploadModal from '@/components/upload/UploadModal';

export default function AppLayout({ children }) {
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary">
      {/* 1. The sidebars are now wrapped in fixed containers */}
      <div className="fixed left-0 top-0 h-full z-30 hidden md:block">
        <Sidebar onUploadClick={() => setUploadModalOpen(true)} />
      </div>
      <div className="fixed right-0 top-0 h-full z-30 hidden lg:block">
        <RightSidebar />
      </div>

      {/* 2. The main content area uses margins to create space for the sidebars */}
      <div className="flex-1 md:ml-64 lg:mr-80">
        <Header />
        
        <main className="flex justify-center p-4 sm:p-6 lg:p-8 pt-24">
          <div className="w-full max-w-3xl">
            {children}
          </div>
        </main>
      </div>
      
      <BottomNav />

      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
}
