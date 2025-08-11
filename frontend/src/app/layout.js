// /src/app/layout.js

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { AuthProvider } from '@/context/AuthContext';
import "./globals.css";

export const metadata = {
  title: "SEC-UR Privacy",
  description: "The Social Network Built on Consent.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-gray-100 dark:bg-gray-900`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}