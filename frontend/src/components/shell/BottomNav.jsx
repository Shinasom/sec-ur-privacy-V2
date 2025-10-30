// =======================================================================
// /src/components/shell/BottomNav.jsx
// Refined modern bottom navigation - matching sidebar icons, no distractions
// =======================================================================
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LayoutGrid, Sparkles, PlusSquare, ShieldCheck, User } from 'lucide-react';
import UploadModal from '@/components/upload/UploadModal';
import UploadToast from '@/components/upload/UploadToast';
import ConsentModal from '@/components/consent/ConsentModal';
import api from '@/lib/api';

export default function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const [isConsentModalOpen, setConsentModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);

  // Update active tab based on pathname
  useEffect(() => {
    if (pathname.startsWith('/feed')) setActiveTab('feed');
    else if (pathname.startsWith('/discover')) setActiveTab('discover');
    else if (pathname.startsWith('/profile')) setActiveTab('profile');
  }, [pathname]);

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

  const handleUploadStart = (status) => {
    setUploadStatus(status);
    if (status === 'success' || status === 'error') {
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  // Navigation items matching sidebar exactly
  const navItems = [
    { 
      id: 'feed', 
      icon: LayoutGrid, 
      label: 'Gallery',
      href: '/feed',
      type: 'link',
      gradient: 'from-primary to-dark-accent'
    },
    { 
      id: 'discover', 
      icon: Sparkles, 
      label: 'Discover',
      href: '/discover',
      type: 'link',
      gradient: 'from-accent to-primary'
    },
    { 
      id: 'upload', 
      icon: PlusSquare, 
      label: 'Upload',
      type: 'action',
      gradient: 'from-primary to-dark-accent',
      featured: true
    },
    { 
      id: 'consent', 
      icon: ShieldCheck, 
      label: 'Consent',
      type: 'action',
      gradient: 'from-amber-400 to-orange-600',
      badge: pendingCount
    },
    { 
      id: 'profile', 
      icon: User, 
      label: 'Profile',
      href: user ? `/profile/${user.username}` : '/profile',
      type: 'link',
      gradient: 'from-primary to-accent'
    }
  ];

  const handleNavClick = (item) => {
    if (item.type === 'action') {
      if (item.id === 'upload') {
        setUploadModalOpen(true);
      } else if (item.id === 'consent') {
        setConsentModalOpen(true);
      }
    } else {
      setActiveTab(item.id);
      router.push(item.href);
    }
  };

  return (
    <>
      {/* Modern Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40">
        <div className="mx-3 mb-3">
          {/* Glassmorphism Container */}
          <div className="relative bg-surface/90 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-[0_8px_32px_0_rgba(85,107,47,0.12)] p-2">
            {/* Active Indicator Background */}
            <div 
              className="absolute top-2 transition-all duration-500 ease-out"
              style={{
                left: `calc(${navItems.findIndex(item => item.id === activeTab) * 20}% + 8px)`,
                width: 'calc(20% - 16px)',
                height: 'calc(100% - 16px)'
              }}
            >
              <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-[20px]" />
            </div>

            {/* Navigation Items */}
            <div className="relative flex items-center justify-around">
              {navItems.map((item) => {
                const isActive = activeTab === item.id;
                const Icon = item.icon;
                
                // Featured Upload Button (Center) - Simplified
                if (item.featured) {
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className="relative flex flex-col items-center justify-center group -mt-6"
                      aria-label={item.label}
                    >
                      {/* Main Button - No pulse, no glow ring */}
                      <div className="relative bg-gradient-to-br from-primary to-dark-accent rounded-2xl p-3.5 shadow-lg shadow-primary/20 group-hover:shadow-xl group-hover:shadow-primary/30 transform group-hover:scale-105 group-active:scale-95 transition-all duration-300">
                        <Icon className="w-7 h-7 text-white" strokeWidth={2.5} />
                      </div>
                      
                      {/* Label */}
                      <span className="mt-2 text-xs font-semibold text-transparent bg-clip-text bg-gradient-to-br from-primary to-dark-accent">
                        {item.label}
                      </span>
                    </button>
                  );
                }

                // Regular Navigation Items
                const content = (
                  <>
                    {/* Icon Container */}
                    <div className="relative">
                      {/* Notification Badge - Simplified (no pulse) */}
                      {item.badge > 0 && (
                        <div className="absolute -top-1 -right-1 z-10">
                          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 border-2 border-white shadow-md">
                            {item.badge > 9 ? '9+' : item.badge}
                          </div>
                        </div>
                      )}
                      
                      {/* Icon with Gradient on Active */}
                      <div className={`relative transition-all duration-300 ${
                        isActive ? 'scale-110' : 'scale-100 group-hover:scale-105 group-active:scale-95'
                      }`}>
                        {/* Subtle glow on active */}
                        {isActive && (
                          <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} rounded-2xl blur-md opacity-20`} />
                        )}
                        {/* Icon Background */}
                        <div className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
                          isActive 
                            ? `bg-gradient-to-br ${item.gradient}` 
                            : 'bg-transparent group-hover:bg-gray-100'
                        }`}>
                          <Icon 
                            className={`w-6 h-6 transition-colors duration-300 ${
                              isActive ? 'text-white' : 'text-gray-600 group-hover:text-primary'
                            }`}
                            strokeWidth={isActive ? 2.5 : 2}
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Label */}
                    <span className={`mt-1.5 text-[11px] font-semibold transition-all duration-300 whitespace-nowrap ${
                      isActive 
                        ? `text-transparent bg-clip-text bg-gradient-to-br ${item.gradient}` 
                        : 'text-gray-500 group-hover:text-primary'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Active Dot Indicator */}
                    {isActive && (
                      <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2">
                        <div className={`w-1 h-1 rounded-full bg-gradient-to-br ${item.gradient}`} />
                      </div>
                    )}
                  </>
                );

                return item.type === 'link' ? (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setActiveTab(item.id)}
                    className="relative flex-1 flex flex-col items-center justify-center py-3 px-2 group"
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className="relative flex-1 flex flex-col items-center justify-center py-3 px-2 group"
                  >
                    {content}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        {/* Safe area padding for iPhone notch */}
        <div className="h-safe pb-safe" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
      </nav>

      {/* Modals */}
      {isUploadModalOpen && (
        <UploadModal 
          onClose={() => setUploadModalOpen(false)} 
          onUploadStart={handleUploadStart}
        />
      )}

      {isConsentModalOpen && (
        <ConsentModal 
          isOpen={isConsentModalOpen}
          onClose={() => {
            setConsentModalOpen(false);
            // Refresh consent count
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
      )}

      {uploadStatus && (
        <UploadToast 
          status={uploadStatus} 
          onClose={() => setUploadStatus(null)}
        />
      )}
    </>
  );
}