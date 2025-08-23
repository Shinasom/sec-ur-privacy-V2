// =======================================================================
// /src/components/shell/RightSidebar.jsx
// The updated right sidebar, with user info, suggestions, and requests.
// =======================================================================
'use client';

import { Bell, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RightSidebar() {
  const { user } = useAuth(); // Get user info from context

  return (
    <aside className="bg-surface border-l border-gray-200 w-80 fixed top-0 right-0 h-full z-30 hidden lg:flex flex-col">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
        <div className="flex items-center space-x-2 p-2 rounded-full hover:bg-background cursor-pointer">
          <img
            src="https://placehold.co/32x32/556B2F/F5F3ED?text=U"
            alt="Your Profile"
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold text-sm text-gray-700">
            {user ? user.username : 'loading...'}
          </span>
        </div>
        <button className="p-2 rounded-full hover:bg-background">
          <Bell className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        {/* Suggestions Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-500">Suggestions For You</h3>
            <a href="#" className="text-xs font-bold text-primary hover:underline">See All</a>
          </div>
          <SuggestionItem username="sara.jones" avatarUrl="https://placehold.co/40x40/e74c3c/ffffff?text=S" mutuals={2} />
          <SuggestionItem username="mike.p" avatarUrl="https://placehold.co/40x40/2c3e50/ffffff?text=M" mutuals={5} />
        </div>
        <hr />
        {/* Requests Section */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-sm text-gray-500">Pending Requests</h3>
            <a href="#" className="text-xs font-bold text-primary hover:underline">Manage</a>
          </div>
          <RequestItem type="friend" username="alex.designs" avatarUrl="https://placehold.co/40x40/3A5A40/F5F3ED?text=A" />
          <RequestItem type="consent" username="cool.company" avatarUrl="https://placehold.co/40x40/81B29A/FFFFFF?text=C" />
        </div>
      </div>

      <footer className="p-6 text-center text-xs text-gray-400 border-t border-gray-200">
        <p>&copy; 2024 PhotoShare. All Rights Reserved.</p>
      </footer>
    </aside>
  );
}

// Sub-components for the sidebar items
const SuggestionItem = ({ username, avatarUrl, mutuals }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <img src={avatarUrl} alt={username} className="w-10 h-10 rounded-full" />
      <div>
        <p className="font-semibold text-sm text-gray-800">{username}</p>
        <p className="text-xs text-gray-500">{mutuals} mutual friends</p>
      </div>
    </div>
    <button className="text-xs font-bold text-blue-500 hover:text-blue-700">Follow</button>
  </div>
);

const RequestItem = ({ type, username, avatarUrl }) => {
  const message = type === 'friend' ? "Friend request" : "Wants to use your photo";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <img src={avatarUrl} alt={username} className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold text-sm text-gray-800">{username}</p>
          <p className="text-xs text-gray-500">{message}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="p-1.5 bg-green-100 rounded-full hover:bg-green-200" title="Accept"><Check className="w-3 h-3 text-green-600" /></button>
        <button className="p-1.5 bg-red-100 rounded-full hover:bg-red-200" title="Decline"><X className="w-3 h-3 text-red-600" /></button>
      </div>
    </div>
  );
};
