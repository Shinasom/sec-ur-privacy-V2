// =======================================================================
// /src/app/login/page.jsx
// This is the REFACTORED client component for our login page.
// It keeps your UI but uses our new AuthContext to handle all logic.
// =======================================================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext'; // <-- Step 1: Import our useAuth hook
import { User, Lock, Eye, EyeOff } from 'lucide-react'; // <-- Using lucide-react for consistency

export default function LoginPage() {
  // State for the form inputs remains the same
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // State for the UI remains the same
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Step 2: Get the loginUser function from our AuthContext
  // We no longer need the 'router' here, as the context handles redirection.
  const { loginUser } = useAuth();

  /**
   * Handles the form submission.
   * This function is now much simpler.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default browser form submission
    setIsLoading(true);
    setError('');

    // Step 3: Call the loginUser function from the context.
    // All the complex logic of axios, localStorage, and routing is now hidden inside loginUser.
    const result = await loginUser(username, password);
    
    // The context handles success (redirecting). We only need to handle failure.
    if (!result.success) {
      setError(result.error || 'Invalid username or password.');
    }

    setIsLoading(false);
  };

  // The JSX for your UI remains almost identical.
  return (
    <main className="w-full min-h-screen lg:flex bg-gray-100 dark:bg-gray-900">
      {/* Branding Section */}
      <div className="relative lg:w-1/2 flex flex-col items-center justify-center text-center bg-gray-900 p-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white tracking-wider">SEC-UR Privacy</h1>
          <p className="text-white/80 mt-4 text-lg">Your Photos, Your Consent, Your Network.</p>
        </div>
        <div className="absolute bottom-6 text-white/50 text-sm">
          © 2025 SEC-UR Privacy
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Log In</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input id="username" name="username" type="text" required disabled={isLoading} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? 'text' : 'password'} required disabled={isLoading} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
                <button type="button" disabled={isLoading} onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-purple-600">
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-center text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-300 dark:border-red-500/30 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center py-3 px-4 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">
                {isLoading ? <div className="animate-spin h-5 w-5 text-white border-2 border-t-transparent rounded-full"></div> : 'Log In'}
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 dark:text-gray-400 pt-4">
              Don't have an account?{' '}
              <Link href="/register" className={`font-medium text-purple-600 hover:text-purple-500 hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
