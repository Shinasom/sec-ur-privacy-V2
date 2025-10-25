// frontend/src/components/shell/Sidebar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mainNavItems, userNavItems, logoutNavItem } from '@/config/nav';
import { PlusSquare, User } from 'lucide-react';
import api from '@/lib/api';
import ConsentModal from '@/components/consent/ConsentModal';

export default function Sidebar({ onUploadClick }) {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();
  const [isConsentModalOpen, setConsentModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  // Fetch pending consent count
  useEffect(() => {
    const fetchPendingCount = async () => {
      if (!user) return;
      try {
        const res = await api.get('/api/consent-requests/');
        const pending = res.data.filter(r => r.status === 'PENDING').length;
        setPendingCount(pending);
      } catch (error) {
        console.error('Failed to fetch consent count:', error);
      }
    };

    fetchPendingCount();
    const interval = setInterval(fetchPendingCount, 30000);
    return () => clearInterval(interval);
  }, [user]);

  const handleNavItemClick = (item) => {
    if (item.modal === 'consent') {
      setConsentModalOpen(true);
    }
  };

  return (
    <>
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
            item.modal ? (
              // Modal trigger (Consent)
              <button 
                key={item.text}
                onClick={() => handleNavItemClick(item)} 
                className="w-full relative"
              >
                <NavItem
                  Icon={item.icon}
                  text={item.text}
                  active={false}
                  badge={item.text === 'Consent' ? pendingCount : 0}
                />
              </button>
            ) : (
              // Regular navigation
              <NavItem
                key={item.text}
                Icon={item.icon}
                text={item.text}
                href={item.href}
                active={pathname === item.href}
              />
            )
          ))}
          
          {/* Upload Button */}
          <button onClick={onUploadClick} className="w-full">
            <NavItem
              Icon={PlusSquare}
              text="Upload"
              active={false}
            />
          </button>
        </nav>

        {/* User Navigation & Logout */}
        <div className="px-4 py-6 space-y-2 border-t border-gray-200">
          {/* Profile link */}
          {user && (
            <NavItem
              Icon={User}
              text="Profile"
              href={`/profile/${user.username}`}
              active={pathname === `/profile/${user.username}`}
            />
          )}
          
          {/* Settings */}
          {userNavItems.map((item) => (
            <NavItem
              key={item.text}
              Icon={item.icon}
              text={item.text}
              href={item.href}
              active={pathname === item.href}
            />
          ))}
          
          {/* Logout */}
          <button onClick={logoutUser} className="w-full">
            <NavItem Icon={logoutNavItem.icon} text={logoutNavItem.text} />
          </button>
        </div>
      </aside>

      {/* Consent Modal */}
      <ConsentModal 
        isOpen={isConsentModalOpen} 
        onClose={() => {
          setConsentModalOpen(false);
          // Refresh count after closing modal
          if (user) {
            api.get('/api/consent-requests/')
              .then(res => {
                const pending = res.data.filter(r => r.status === 'PENDING').length;
                setPendingCount(pending);
              })
              .catch(err => console.error('Failed to refresh count:', err));
          }
        }} 
      />
    </>
  );
}

// Reusable NavItem sub-component
const NavItem = ({ Icon, text, href, active = false, badge = 0 }) => {
  const content = (
    <div
      className={`flex items-center justify-center md:justify-start space-x-3 p-3 rounded-lg transition-colors w-full relative ${
        active
          ? 'bg-background text-primary font-semibold'
          : 'text-primary/70 hover:bg-background hover:text-primary'
      }`}
    >
      <div className="relative">
        <Icon className="w-6 h-6 flex-shrink-0" />
        {badge > 0 && (
          <>
            {/* Animated pulse */}
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 animate-ping"></span>
            {/* Badge */}
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-surface">
              {badge > 9 ? '9+' : badge}
            </span>
          </>
        )}
      </div>
      <span className="hidden md:inline">{text}</span>
      {badge > 0 && (
        <span className="hidden md:inline ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};