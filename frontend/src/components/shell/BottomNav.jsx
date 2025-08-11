// =======================================================================
// /src/components/shell/BottomNav.jsx
// This component provides the main navigation for mobile users.
// It is hidden on larger screens where the main Sidebar is visible.
// =======================================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Bell, Upload, User } from 'lucide-react';

// We define the same core navigation items as the main Sidebar.
const navItems = [
  { icon: Home, label: 'Feed', href: '/feed' },
  { icon: Bell, label: 'Requests', href: '/requests' },
  { icon: Upload, label: 'Upload', href: '/upload' },
  { icon: User, label: 'Profile', href: '/profile' },
];

export default function BottomNav() {
  const pathname = usePathname(); // Hook to identify the active page.

  return (
    // This nav bar is fixed to the bottom of the screen.
    // It is visible by default but hidden on large ('lg') screens and up.
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-2 flex justify-around z-40">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center w-1/4 p-2 rounded-md transition-colors
              ${isActive
                ? 'text-purple-600 dark:text-purple-400'
                : 'text-gray-600 dark:text-gray-400'
              }`
            }
          >
            <item.icon className="w-6 h-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
