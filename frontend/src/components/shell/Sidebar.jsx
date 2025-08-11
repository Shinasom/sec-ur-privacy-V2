// =======================================================================
// /src/components/shell/Sidebar.jsx
// This component is the main left-hand navigation bar for the application.
// It provides links to key pages and includes the logout functionality.
// =======================================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Home, Bell, User, LogOut, Upload } from 'lucide-react';

// Define our navigation items in an array for easy mapping.
const navItems = [
  { icon: Home, label: 'Feed', href: '/feed' },
  { icon: Bell, label: 'Requests', href: '/requests' },
  { icon: Upload, label: 'Upload', href: '/upload' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function Sidebar() {
  const { logoutUser } = useAuth();
  const pathname = usePathname(); // A hook to know which page is currently active.

  return (
    // This sidebar is hidden on small screens (mobile) and visible on large screens.
    <aside className="hidden lg:block w-20 xl:w-72 p-4 border-r border-gray-200 dark:border-gray-700 flex-shrink-0">
      <div className="fixed h-full flex flex-col w-20 xl:w-72">
        {/* App Logo/Branding */}
        <div className="flex items-center space-x-3 mb-10">
          <div className="h-9 w-9 bg-purple-600 rounded-lg flex items-center justify-center">
            <LockClosedIcon className="h-5 w-5 text-white" />
          </div>
          <span className="hidden xl:block text-2xl font-bold font-serif text-gray-900 dark:text-white">
            SEC-UR
          </span>
        </div>

        {/* Main Navigation */}
        <nav className="flex-grow">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-4 p-3 rounded-lg text-gray-700 dark:text-gray-300 transition-colors duration-200
                      ${isActive
                        ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 font-semibold'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`
                    }
                  >
                    <item.icon className="w-6 h-6" />
                    <span className="hidden xl:block text-lg">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div>
          <button
            onClick={logoutUser}
            className="w-full flex items-center space-x-4 p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-red-500 dark:hover:text-red-500 transition-colors duration-200"
          >
            <LogOut className="w-6 h-6" />
            <span className="hidden xl:block text-lg font-medium">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

// A local SVG component for the logo icon
const LockClosedIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);
