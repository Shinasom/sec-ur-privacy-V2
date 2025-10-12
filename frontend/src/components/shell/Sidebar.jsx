// =======================================================================
// /src/components/shell/Sidebar.jsx
// The "Profile" link is now dynamically generated to point to the
// currently logged-in user's profile page.
// =======================================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mainNavItems, userNavItems, logoutNavItem } from '@/config/nav';
import { PlusSquare, User } from 'lucide-react'; // Import User icon

// The component now accepts an `onUploadClick` prop from its parent layout
export default function Sidebar({ onUploadClick }) {
  const { user, logoutUser } = useAuth(); // Get the full user object
  const pathname = usePathname();

  return (
    <aside className="bg-surface border-r border-gray-200 w-20 md:w-64 h-screen flex flex-col z-30">
      {/* App Logo/Branding */}
      <div className="px-4 py-6 flex items-center justify-center md:justify-start">
        <h1 className="text-3xl font-serif font-bold text-primary hidden md:block">
          SEC-UR
        </h1>
        <h1 className="text-3xl font-serif font-bold text-primary md:hidden">SU</h1>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {mainNavItems.map((item) => (
          <NavItem
            key={item.text}
            Icon={item.icon}
            text={item.text}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
        <button onClick={onUploadClick} className="w-full">
           <NavItem
            Icon={PlusSquare}
            text="Upload"
            active={false}
          />
        </button>
      </nav>

      {/* User Navigation & Logout */}
      <div className="px-4 py-6 space-y-2">
        {/* Dynamically create the Profile link */}
        {user && (
          <NavItem
            Icon={User}
            text="Profile"
            href={`/profile/${user.username}`}
            active={pathname === `/profile/${user.username}`}
          />
        )}
        {/* Map over the rest of the user items (e.g., Settings) */}
        {userNavItems.map((item) => (
          <NavItem
            key={item.text}
            Icon={item.icon}
            text={item.text}
            href={item.href}
            active={pathname === item.href}
          />
        ))}
        <button onClick={logoutUser} className="w-full">
          <NavItem Icon={logoutNavItem.icon} text={logoutNavItem.text} />
        </button>
      </div>
    </aside>
  );
}

// Reusable NavItem sub-component for consistent styling.
const NavItem = ({ Icon, text, href, active = false }) => {
  const content = (
    <div
      className={`flex items-center justify-center md:justify-start space-x-3 p-3 rounded-lg transition-colors w-full ${
        active
          ? 'bg-background text-primary font-semibold'
          : 'text-primary/70 hover:bg-background'
      }`}
    >
      <Icon className="w-6 h-6 flex-shrink-0" />
      <span className="hidden md:inline">{text}</span>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};
