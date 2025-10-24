// =======================================================================
// /src/app/login/page.jsx
// Updated login page with gradient background matching your design
// =======================================================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await loginUser(username, password);
    
    if (!result.success) {
      setError(result.error || 'Invalid username or password.');
    }

    setIsLoading(false);
  };

  return (
    <main className="w-full min-h-screen lg:flex bg-background">
      {/* Branding Section with Gradient */}
      <div className="relative lg:w-1/2 flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-accent via-primary to-dark-accent">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white tracking-wider">SEC-UR Privacy</h1>
          <p className="text-white/90 mt-4 text-lg">Your new social universe awaits.</p>
        </div>
        <div className="absolute bottom-6 text-white/70 text-sm">
          © 2025 SEC-UR Privacy
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md p-8 space-y-6 bg-surface rounded-xl shadow-lg">
          <div className="text-left mb-8">
            <h2 className="text-3xl font-bold text-primary">Log In</h2>
            <p className="text-gray-600 mt-2">Welcome back! Please enter your details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  required 
                  disabled={isLoading} 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Enter your username" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  id="password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  required 
                  disabled={isLoading} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Enter your password" 
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                />
                <button 
                  type="button" 
                  disabled={isLoading} 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-primary"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-center text-red-800 bg-red-100 border border-red-300 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <button 
                type="submit" 
                disabled={isLoading} 
                className="w-full flex justify-center items-center py-3 px-4 font-semibold text-white bg-primary hover:bg-dark-accent rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <div className="animate-spin h-5 w-5 text-white border-2 border-t-transparent rounded-full"></div> : 'Log In'}
              </button>
            </div>

            <p className="text-sm text-center text-gray-600 pt-4">
              Don't have an account?{' '}
              <Link href="/register" className={`font-medium text-primary hover:text-dark-accent hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>Sign up</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}