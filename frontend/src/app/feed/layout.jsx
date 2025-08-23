// =======================================================================
// /src/app/feed/layout.jsx
// This layout now manages the state for the UploadModal.
// =======================================================================
'use client';

import { useState } from 'react';
import Sidebar from '@/components/shell/Sidebar';
import RightSidebar from '@/components/shell/RightSidebar';
import BottomNav from '@/components/shell/BottomNav';
import Header from '@/components/shell/Header';
import UploadModal from '@/components/upload/UploadModal'; // <-- Import the modal

export default function AppLayout({ children }) {
  // State to control the modal's visibility
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-primary">
      <div className="flex">
        {/* We pass the function to open the modal down to the Sidebar */}
        <Sidebar onUploadClick={() => setUploadModalOpen(true)} />

        <div className="flex-1 md:pl-64 lg:pr-80">
          <Header />
          
          <main className="flex justify-center p-4 sm:p-6 lg:p-8 pt-24">
            <div className="w-full max-w-3xl">
              {children}
            </div>
          </main>
        </div>

        <RightSidebar />
      </div>
      
      <BottomNav />

      {/* Conditionally render the modal based on state */}
      {isUploadModalOpen && <UploadModal onClose={() => setUploadModalOpen(false)} />}
    </div>
  );
}
