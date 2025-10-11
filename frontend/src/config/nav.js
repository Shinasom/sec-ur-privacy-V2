// =======================================================================
// /src/config/nav.js
// This version removes the duplicate "Profile" link from the user 
// navigation to fix the UI bug. The dynamic link in Sidebar.jsx is now
// the single source of truth.
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
export const mainNavItems = [
  { icon: LayoutGrid, text: 'Gallery', href: '/feed' },
  { icon: Sparkles, text: 'Discover', href: '/discover' },
  { icon: MessageCircle, text: 'Messages', href: '/messages' },
  { icon: ShieldCheck, text: 'Consent', href: '/consent' },
];

// User-related navigation links for the bottom section of the sidebar.
// The hardcoded "Profile" link has been removed.
export const userNavItems = [
  { icon: Settings, text: 'Settings', href: '/settings' },
];

// The single logout action.
export const logoutNavItem = { icon: LogOut, text: 'Logout' };