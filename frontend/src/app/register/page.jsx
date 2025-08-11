// =======================================================================
// /src/app/register/page.jsx
// This is the REFACTORED client component for our registration page.
// It keeps your UI but uses our new AuthContext to handle all logic.
// This version corrects the missing form fields.
// =======================================================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Mail, Pencil, Image as ImageIcon } from 'lucide-react';

export default function RegisterPage() {
  // State for the form inputs
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    bio: '',
    profile_pic: null,
  });

  // State for the UI
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('Upload your profile picture');
  
  // Get the registerUser function from our AuthContext
  const { registerUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_pic: file }));
      setFileName(file.name);
    } else {
      setFileName('Upload your profile picture');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.profile_pic) {
        setError("A profile picture is required for registration.");
        return;
    }
    setIsLoading(true);
    setError('');

    const result = await registerUser(formData);

    if (!result.success) {
      const errorMessages = Object.values(result.error).flat().join(' ');
      setError(errorMessages || 'Registration failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  return (
    <main className="w-full min-h-screen lg:flex bg-gray-100 dark:bg-gray-900">
      {/* Branding Section */}
      <div className="relative lg:w-1/2 flex flex-col items-center justify-center text-center bg-gray-900 p-12 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-gray-900 to-black">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white tracking-wider">Join SEC-UR Privacy</h1>
          <p className="text-white/80 mt-4 text-lg">Your Photos, Your Consent, Your Network.</p>
        </div>
        <div className="absolute bottom-6 text-white/50 text-sm">
          © 2025 SEC-UR Privacy
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-lg p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="text-center sm:text-left mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create an Account</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Let's get you started on your secure journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <FormField id="username" label="Username" icon={<User className="h-5 w-5 text-gray-400" />}>
              <input id="username" name="username" type="text" required onChange={handleChange} placeholder="e.g., jane_doe" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
            </FormField>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField id="first_name" label="First Name" icon={<User className="h-5 w-5 text-gray-400" />}>
                  <input id="first_name" name="first_name" type="text" onChange={handleChange} placeholder="e.g., Jane" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
              </FormField>
              <FormField id="last_name" label="Last Name" icon={<User className="h-5 w-5 text-gray-400" />}>
                  <input id="last_name" name="last_name" type="text" onChange={handleChange} placeholder="e.g., Doe" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
              </FormField>
            </div>

            <FormField id="email" label="Email Address" icon={<Mail className="h-5 w-5 text-gray-400" />}>
              <input id="email" name="email" type="email" required onChange={handleChange} placeholder="you@example.com" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
            </FormField>

            <FormField id="password" label="Password" icon={<Lock className="h-5 w-5 text-gray-400" />}>
              <input id="password" name="password" type="password" required onChange={handleChange} placeholder="••••••••" className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" />
            </FormField>

            <FormField id="bio" label="Bio (Optional)" icon={<Pencil className="h-5 w-5 text-gray-400" />}>
              <textarea id="bio" name="bio" onChange={handleChange} placeholder="Tell us about yourself..." className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400 text-gray-900 dark:text-white" rows="3"></textarea>
            </FormField>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Profile Picture</label>
              <label htmlFor="profile_pic" className="relative flex items-center px-4 py-3 bg-white dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 transition">
                <ImageIcon className="h-6 w-6 text-purple-600" />
                <span className="ml-3 text-gray-700 dark:text-gray-300 truncate">{fileName}</span>
                <span className="ml-auto text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md px-3 py-1">Choose File</span>
                <input id="profile_pic" name="profile_pic" type="file" required onChange={handleFileChange} className="sr-only" accept="image/png, image/jpeg" />
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">A clear photo of your face is required for recognition.</p>
            </div>

            {error && (
              <div className="p-3 flex items-center gap-x-3 text-sm text-center text-red-800 bg-red-100 dark:bg-red-900/20 dark:text-red-400 border border-red-300 dark:border-red-500/30 rounded-lg">
                <p>{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className="w-full py-3 px-4 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all duration-300 ease-in-out flex justify-center items-center">
              {isLoading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Create Account'}
            </button>
            
            <p className="text-sm text-center text-gray-600 dark:text-gray-400 pt-4">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 hover:underline">Log In</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

// Reusable FormField component for consistency
const FormField = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
        </label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {icon}
            </div>
            {children}
        </div>
    </div>
);
