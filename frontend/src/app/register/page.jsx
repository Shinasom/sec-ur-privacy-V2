// =======================================================================
// /src/app/register/page.jsx
// Modern, aesthetic registration page with gradient background
// =======================================================================
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { User, Lock, Mail, Pencil, Image as ImageIcon, Upload, X } from 'lucide-react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    bio: '',
    profile_pic: null,
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const { registerUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_pic: file }));
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, profile_pic: null }));
    setPreviewUrl(null);
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
    <main className="w-full min-h-screen lg:flex bg-background">
      {/* Branding Section with Gradient */}
      <div className="relative lg:w-1/2 flex flex-col items-center justify-center text-center p-12 bg-gradient-to-b from-accent via-primary to-dark-accent">
        <div className="w-full max-w-md">
          <h1 className="text-5xl font-bold text-white tracking-wider mb-4">Join SEC-UR Privacy</h1>
          <p className="text-white/90 text-lg leading-relaxed">
            Your Photos, Your Consent, Your Network.
          </p>
          <div className="mt-8 space-y-3 text-white/80 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <p>Privacy-first photo sharing</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <p>Consent-based content control</p>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-white/60 rounded-full"></div>
              <p>Secure social networking</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 text-white/70 text-sm">
          © 2025 SEC-UR Privacy
        </div>
      </div>

      {/* Form Section */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-lg">
          <div className="bg-surface p-8 rounded-2xl shadow-xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary">Create Account</h2>
              <p className="text-gray-600 mt-2">Let's get you started on your secure journey</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Profile Picture Upload - Featured */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {previewUrl ? (
                    <div className="relative">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="profile_pic" className="cursor-pointer">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center hover:shadow-xl transition-shadow">
                        <div className="text-center text-white">
                          <Upload className="w-8 h-8 mx-auto mb-2" />
                          <p className="text-xs font-medium">Upload Photo</p>
                        </div>
                      </div>
                    </label>
                  )}
                  <input 
                    id="profile_pic" 
                    name="profile_pic" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/png, image/jpeg" 
                  />
                </div>
              </div>

              {/* Username */}
              <FormField 
                id="username" 
                label="Username" 
                icon={<User className="h-5 w-5 text-gray-400" />}
                required
              >
                <input 
                  id="username" 
                  name="username" 
                  type="text" 
                  required 
                  onChange={handleChange} 
                  placeholder="Choose a unique username" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                />
              </FormField>

              {/* First Name and Last Name - Side by Side */}
              <div className="grid grid-cols-2 gap-4">
                <FormField id="first_name" label="First Name" icon={<User className="h-5 w-5 text-gray-400" />}>
                  <input 
                    id="first_name" 
                    name="first_name" 
                    type="text" 
                    onChange={handleChange} 
                    placeholder="First name" 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                  />
                </FormField>
                <FormField id="last_name" label="Last Name" icon={<User className="h-5 w-5 text-gray-400" />}>
                  <input 
                    id="last_name" 
                    name="last_name" 
                    type="text" 
                    onChange={handleChange} 
                    placeholder="Last name" 
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                  />
                </FormField>
              </div>

              {/* Email */}
              <FormField 
                id="email" 
                label="Email Address" 
                icon={<Mail className="h-5 w-5 text-gray-400" />}
                required
              >
                <input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  onChange={handleChange} 
                  placeholder="your.email@example.com" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                />
              </FormField>

              {/* Password */}
              <FormField 
                id="password" 
                label="Password" 
                icon={<Lock className="h-5 w-5 text-gray-400" />}
                required
              >
                <input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  onChange={handleChange} 
                  placeholder="Create a strong password" 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900" 
                />
              </FormField>

              {/* Bio */}
              <FormField 
                id="bio" 
                label="Bio (Optional)" 
                icon={<Pencil className="h-5 w-5 text-gray-400" />}
              >
                <textarea 
                  id="bio" 
                  name="bio" 
                  onChange={handleChange} 
                  placeholder="Tell us a bit about yourself..." 
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition placeholder-gray-400 text-gray-900 resize-none" 
                  rows="3"
                ></textarea>
              </FormField>

              {error && (
                <div className="p-3 text-sm text-center text-red-800 bg-red-50 border border-red-200 rounded-xl">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading || !formData.profile_pic} 
                className="w-full py-3.5 px-4 font-semibold text-white bg-gradient-to-r from-primary to-dark-accent hover:from-dark-accent hover:to-primary rounded-xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-in-out flex justify-center items-center"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  'Create Account'
                )}
              </button>
              
              <p className="text-sm text-center text-gray-600 pt-4">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-primary hover:text-dark-accent hover:underline transition">
                  Log In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

// Reusable FormField component
const FormField = ({ id, label, icon, required, children }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-start pt-3 pointer-events-none">
        {icon}
      </div>
      {children}
    </div>
  </div>
);