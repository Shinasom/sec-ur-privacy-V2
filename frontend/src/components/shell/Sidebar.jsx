// frontend/src/components/shell/Sidebar.jsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { mainNavItems, userNavItems, logoutNavItem } from '@/config/nav';
import { PlusSquare, User, Bell } from 'lucide-react';
import api from '@/lib/api';
import ConsentModal from '@/components/consent/ConsentModal';

export default function Sidebar({ onUploadClick }) {
  const { user, logoutUser } = useAuth();
  const pathname = usePathname();
  const [isConsentModalOpen, setConsentModalOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [hoveredItem, setHoveredItem] = useState(null);

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
      <aside className="bg-surface border-r border-gray-200 w-20 md:w-80 h-screen flex flex-col z-30">
        {/* Enhanced Header with Logo and Brand */}
        <div className="px-4 md:px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-center md:justify-start md:space-x-4">
            {/* Logo */}
            <div className="relative">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary to-dark-accent flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg md:text-xl">U</span>
              </div>
              {/* Small accent dot */}
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-accent rounded-full border-2 border-surface" />
            </div>
            
            {/* Brand Name - Hidden on mobile */}
            <div className="hidden md:block flex-1">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-dark-accent bg-clip-text text-transparent">
                Unmask
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">Reveal on Your Terms</p>
            </div>

            {/* Notification Bell - Hidden on mobile */}
            <button 
              onClick={() => setConsentModalOpen(true)}
              className="hidden md:block relative p-2 hover:bg-background rounded-xl transition-colors group"
            >
              <Bell className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
              {pendingCount > 0 && (
                <>
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-surface">
                      {pendingCount}
                    </span>
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="flex-1 px-2 md:px-4 py-4 space-y-1 md:space-y-2 overflow-y-auto">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const itemBadge = item.text === 'Consent' ? pendingCount : 0;
            
            return item.modal ? (
              // Modal trigger (Consent)
              <button 
                key={item.text}
                onClick={() => handleNavItemClick(item)} 
                onMouseEnter={() => setHoveredItem(item.text)}
                onMouseLeave={() => setHoveredItem(null)}
                className="w-full relative"
              >
                <NavItem
                  Icon={item.icon}
                  text={item.text}
                  active={false}
                  badge={itemBadge}
                  hovered={hoveredItem === item.text}
                />
              </button>
            ) : (
              // Regular navigation
              <div
                key={item.text}
                onMouseEnter={() => setHoveredItem(item.text)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavItem
                  Icon={item.icon}
                  text={item.text}
                  href={item.href}
                  active={isActive}
                  badge={itemBadge}
                  hovered={hoveredItem === item.text}
                />
              </div>
            );
          })}
          
          {/* Upload Button - Featured */}
          <div className="pt-2">
            <button 
              onClick={onUploadClick} 
              className="w-full group"
            >
              <div className="relative bg-gradient-to-r from-primary to-dark-accent p-3 md:p-4 rounded-xl md:rounded-2xl hover:shadow-xl hover:shadow-primary/30 transition-all">
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all rounded-xl md:rounded-2xl" />
                <div className="relative flex items-center justify-center md:justify-start md:space-x-3">
                  <PlusSquare className="w-6 h-6 text-white" strokeWidth={2.5} />
                  <span className="hidden md:inline font-bold text-white">Create Post</span>
                </div>
              </div>
            </button>
          </div>
        </nav>

        {/* User Navigation & Logout */}
        <div className="px-2 md:px-4 py-4 md:py-6 space-y-1 md:space-y-2 border-t border-gray-200">
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

// Enhanced NavItem sub-component
const NavItem = ({ Icon, text, href, active = false, badge = 0, hovered = false }) => {
  const content = (
    <div
      className={`relative flex items-center justify-center md:justify-start space-x-3 px-3 md:px-4 py-3 md:py-3.5 rounded-xl md:rounded-2xl transition-all duration-300 group ${
        active
          ? 'bg-gradient-to-r from-primary to-dark-accent text-white shadow-lg shadow-primary/30'
          : 'text-gray-600 hover:bg-background hover:text-primary'
      }`}
    >
      {/* Active Indicator */}
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 md:w-1.5 h-6 md:h-8 bg-white rounded-r-full" />
      )}

      {/* Icon */}
      <div className="relative">
        <Icon 
          className={`w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 ${
            active || hovered ? 'scale-110' : 'scale-100'
          }`} 
          strokeWidth={active ? 2.5 : 2} 
        />
        
        {/* Badge - Mobile version (small dot) */}
        {badge > 0 && (
          <>
            <div className="md:hidden absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-surface" />
            {/* Badge - Desktop version */}
            <div className="hidden md:block absolute -top-2 -right-2 min-w-[18px] h-[18px]">
              <span className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-75" />
              <span className="relative bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 border-2 border-surface flex items-center justify-center">
                {badge > 9 ? '9+' : badge}
              </span>
            </div>
          </>
        )}
      </div>

      {/* Text - Hidden on mobile */}
      <span className={`hidden md:inline flex-1 text-left font-semibold transition-all ${
        active ? 'translate-x-1' : 'translate-x-0'
      }`}>
        {text}
      </span>
      
      {/* Arrow indicator - Desktop only */}
      {(active || hovered) && (
        <div className={`hidden md:block transition-all duration-300 ${
          active ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-2'
        }`}>
          →
        </div>
      )}

      {/* Additional badge count - Desktop only */}
      {badge > 0 && !active && (
        <span className="hidden md:inline ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
};