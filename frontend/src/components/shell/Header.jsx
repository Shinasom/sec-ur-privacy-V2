// =======================================================================
// /src/components/shell/Header.jsx
// FIXED: Proper width calculation for header
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY < 10) {
        // Always show at top
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down - hide
        setIsVisible(false);
        setIsSearchFocused(false); // Close search when hiding
      } else {
        // Scrolling up - show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <header 
      className={`bg-surface/95 backdrop-blur-md shadow-sm fixed top-0 left-0 right-0 md:left-64 lg:right-80 z-20 border-b border-gray-200 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="h-16 px-4 sm:px-6 lg:px-8">
        {/* Center the search bar in the available space */}
        <div className="h-full flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <div className="relative group">
              {/* Search Icon */}
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                isSearchFocused ? 'text-primary' : 'text-gray-400'
              }`}>
                <Search className="w-5 h-5 pointer-events-none" />
              </div>

              {/* Search Input */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Search photos, people, or tags..."
                className={`w-full bg-gray-50 border-2 focus:outline-none rounded-full pl-12 pr-12 py-3 text-sm text-gray-700 placeholder:text-gray-400 transition-all duration-200 ${
                  isSearchFocused 
                    ? 'border-primary bg-white shadow-lg shadow-primary/10' 
                    : 'border-transparent hover:bg-gray-100 hover:border-gray-200'
                }`}
              />

              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              )}

              {/* Search Results Dropdown (Optional - shown when focused with results) */}
              {isSearchFocused && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 py-2 max-h-96 overflow-y-auto">
                  {/* Quick Search Results */}
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Quick Results
                    </p>
                    
                    {/* Example results - replace with actual search results */}
                    <SearchResultItem 
                      type="user"
                      image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop"
                      title="john_doe"
                      subtitle="John Doe"
                    />
                    <SearchResultItem 
                      type="tag"
                      title="#nature"
                      subtitle="2.4K posts"
                    />
                    <SearchResultItem 
                      type="user"
                      image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop"
                      title="jane_smith"
                      subtitle="Jane Smith"
                    />
                  </div>

                  {/* No Results State */}
                  {/* Uncomment if no results
                  <div className="px-4 py-8 text-center">
                    <Search className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No results found</p>
                  </div>
                  */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// Search Result Item Component
const SearchResultItem = ({ type, image, title, subtitle }) => {
  return (
    <button className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group">
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {image ? (
          <img 
            src={image} 
            alt={title}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100 group-hover:ring-primary/30 transition-all"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <span className="text-primary font-bold">#</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
          {title}
        </p>
        <p className="text-xs text-gray-500 truncate">
          {subtitle}
        </p>
      </div>

      {/* Type Badge */}
      <div className="flex-shrink-0">
        <span className="text-xs font-medium text-gray-400 capitalize">
          {type}
        </span>
      </div>
    </button>
  );
};