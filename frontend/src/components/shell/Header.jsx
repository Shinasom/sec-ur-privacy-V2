// /src/components/shell/Header.jsx
// The new fixed header component for the main content area.
// It contains the search bar and has a blurred background effect.
// =======================================================================
'use client';

import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-surface/80 backdrop-blur-lg shadow-sm fixed top-0 left-0 md:left-64 right-0 lg:right-[352px] z-20 transition-all">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-end h-16">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for photos, people, or tags..."
                className="bg-gray-100 border-transparent focus:outline-none focus:ring-2 focus:ring-primary rounded-full pl-10 pr-4 py-2 w-full text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
