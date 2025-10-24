// =======================================================================
// /src/components/shell/Header.jsx
// Improved header with better search bar styling
// =======================================================================
'use client';

import { Search } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-surface/95 backdrop-blur-md shadow-sm fixed top-0 left-0 md:left-64 right-0 lg:right-80 z-20 border-b border-gray-200">
      <div className="h-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search for photos, people, or tags..."
              className="w-full bg-background border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent rounded-full pl-10 pr-4 py-2.5 text-sm text-gray-700 placeholder:text-gray-400 transition-all"
            />
          </div>
        </div>
      </div>
    </header>
  );
}