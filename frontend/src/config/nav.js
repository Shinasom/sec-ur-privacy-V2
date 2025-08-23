// =======================================================================
// /src/config/nav.js
// This version removes the "Upload" link from the main navigation
// to prevent 404 errors, as uploading is now handled by a modal.
// =======================================================================
import {
  LayoutGrid,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  User,
  Settings,
  LogOut,
} from 'lucide-react';

// Main navigation links for the primary section of the sidebar.
// The "Upload" link has been removed from this list.
export const mainNavItems = [
  { icon: LayoutGrid, text: 'Gallery', href: '/feed' },
  { icon: Sparkles, text: 'Discover', href: '/discover' },
  { icon: MessageCircle, text: 'Messages', href: '/messages' },
  { icon: ShieldCheck, text: 'Consent', href: '/consent' },
];

// User-related navigation links for the bottom section of the sidebar.
export const userNavItems = [
  { icon: User, text: 'Profile', href: '/profile' },
  { icon: Settings, text: 'Settings', href: '/settings' },
];

// The single logout action.
export const logoutNavItem = { icon: LogOut, text: 'Logout' };
