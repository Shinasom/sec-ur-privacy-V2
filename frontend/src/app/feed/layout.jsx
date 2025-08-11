// =======================================================================
// /src/app/feed/layout.jsx
// This layout component wraps all pages for logged-in users.
// It provides the main structure with the left and right sidebars,
// ensuring a consistent look and feel across the application.
// =======================================================================
'use client';

// We will create these components in the next steps.
// For now, we can create placeholder files for them if you like.
import Sidebar from '@/components/shell/Sidebar';
import RightSidebar from '@/components/shell/RightSidebar';
import BottomNav from '@/components/shell/BottomNav';

// The `children` prop will be whatever page is currently being rendered,
// for example, the FeedPage component.
export default function AppLayout({ children }) {
  return (
    <div className="text-gray-800 dark:text-gray-200 min-h-screen">
      <div className="flex justify-center max-w-screen-2xl mx-auto">
        <Sidebar />
        <main className="flex-grow flex justify-center w-full">
          {/* The main content of the page (e.g., the feed) goes here */}
          {children}
        </main>
        <RightSidebar />
      </div>
      {/* The bottom navigation is for mobile users */}
      <BottomNav />
    </div>
  );
}
