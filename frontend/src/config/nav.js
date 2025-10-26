// frontend/src/config/nav.js
import {
  LayoutGrid,
  Sparkles,
  MessageCircle,
  ShieldCheck,
  Settings,
  LogOut,
} from 'lucide-react';

export const mainNavItems = [
  { icon: LayoutGrid, text: 'Gallery', href: '/feed' },
  { icon: Sparkles, text: 'Discover', href: '/discover' },
  { icon: MessageCircle, text: 'Messages', href: '/messages' },
  { icon: ShieldCheck, text: 'Consent', modal: 'consent' }, // Add modal flag
];

export const userNavItems = [
  { icon: Settings, text: 'Settings', href: '/settings' },
];

export const logoutNavItem = { icon: LogOut, text: 'Logout' };