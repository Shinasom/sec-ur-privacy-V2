// frontend/src/app/register/page.jsx
// Modern register page with refined right panel design
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Eye, EyeOff, User, Lock, Mail, Upload, Shield, Heart, Camera, Users, AlertCircle, X } from 'lucide-react';

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

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { registerUser } = useAuth();

  // Image carousel data with privacy-themed images
  const carouselImages = [
    {
      url: 'https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=600&h=900&fit=crop',
      overlay: { icon: Shield, text: 'Your Privacy Matters', color: 'from-green-400 to-emerald-600' }
    },
    {
      url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=900&fit=crop',
      overlay: { icon: Users, text: 'Connect Safely', color: 'from-blue-400 to-cyan-600' }
    },
    {
      url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=900&fit=crop',
      overlay: { icon: Heart, text: 'Share with Consent', color: 'from-pink-400 to-rose-600' }
    },
    {
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=900&fit=crop',
      overlay: { icon: Camera, text: 'Control Your Photos', color: 'from-purple-400 to-violet-600' }
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profile_pic: file }));
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
      setIsLoading(false);
    }
  };

  const currentImage = carouselImages[currentImageIndex];
  const OverlayIcon = currentImage.overlay.icon;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side - Image Carousel */}
        <div className="lg:w-1/2 relative bg-gradient-to-br from-primary to-dark-accent p-8 lg:p-12 flex items-center justify-center overflow-hidden min-h-[300px] lg:min-h-[700px]">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          {/* Image Carousel */}
          <div className="relative w-full max-w-md z-10">
            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl">
              {carouselImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-all duration-700 ${
                    index === currentImageIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-95'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${image.overlay.color} opacity-30`}></div>
                  
                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="flex items-center space-x-3 text-white">
                      <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                        <OverlayIcon className="w-6 h-6" />
                      </div>
                      <h3 className="text-2xl font-bold">{image.overlay.text}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Indicators */}
            <div className="flex justify-center space-x-2 mt-6">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'w-8 bg-white' 
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>

            {/* Floating Icons */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center animate-bounce">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>

          {/* Brand Text */}
          <div className="absolute top-8 left-8 z-20">
            <h1 className="text-4xl font-bold text-white tracking-tight">Unmask</h1>
            <p className="text-white/80 text-sm mt-1">Reveal on Your Terms</p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:w-1/2 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            
            {/* Logo for Mobile */}
            <div className="lg:hidden text-center mb-6">
              <h1 className="text-3xl font-bold text-primary mb-1">SEC-UR Privacy</h1>
              <p className="text-gray-600 text-sm">Your photos, your consent, your network</p>
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
              <p className="text-gray-600">Join our privacy-first community</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Profile Picture Upload - Refined */}
              <div className="flex flex-col items-center mb-2">
                <div className="relative">
                  <input 
                    id="profile_pic" 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/png, image/jpeg" 
                  />
                  <label 
                    htmlFor="profile_pic" 
                    className="cursor-pointer block"
                  >
                    {previewUrl ? (
                      <div className="relative group">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-primary shadow-lg">
                          <img 
                            src={previewUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            removeImage();
                          }}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 shadow-lg transition-colors z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Upload className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-28 h-28 rounded-full bg-gradient-to-br from-accent to-primary flex flex-col items-center justify-center hover:shadow-xl transition-shadow border-4 border-white shadow-lg">
                        <Upload className="w-8 h-8 text-white mb-1" />
                        <span className="text-xs font-medium text-white">Upload Photo</span>
                      </div>
                    )}
                  </label>
                </div>
                {previewUrl && (
                  <p className="text-xs text-green-600 mt-2 font-medium">✓ Photo selected</p>
                )}
              </div>

              {/* Face Recognition Info - More Compact */}
              {previewUrl && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-700 leading-relaxed">
                      Face detection enabled. Ensure your face is clearly visible for best results.
                    </p>
                  </div>
                </div>
              )}

              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    disabled={isLoading}
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Choose a username"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    disabled={isLoading}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-12 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* First Name & Last Name */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    First Name
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    disabled={isLoading}
                    value={formData.first_name}
                    onChange={handleChange}
                    placeholder="First name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Last Name
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    disabled={isLoading}
                    value={formData.last_name}
                    onChange={handleChange}
                    placeholder="Last name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Bio - More Compact */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  disabled={isLoading}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="2"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition text-gray-900 placeholder-gray-400 resize-none text-sm"
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 text-sm text-center text-red-800 bg-red-50 border border-red-200 rounded-xl">
                  {error}
                </div>
              )}

              {/* Register Button */}
              <button
                type="submit"
                disabled={isLoading || !formData.profile_pic}
                className="w-full py-3 bg-gradient-to-r from-primary to-dark-accent text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
              >
                {isLoading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Divider */}
              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Or sign up with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition group"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Google</span>
                </button>
                
                <button
                  type="button"
                  className="flex items-center justify-center px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">Facebook</span>
                </button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <Link href="/login" className="text-primary hover:text-dark-accent font-semibold">
                  Log in
                </Link>
              </p>
            </form>

            {/* Footer Links - More Compact */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                <Link href="/about" className="hover:text-primary">About</Link>
                <Link href="/help" className="hover:text-primary">Help</Link>
                <Link href="/privacy" className="hover:text-primary">Privacy</Link>
                <Link href="/terms" className="hover:text-primary">Terms</Link>
              </div>
              <p className="text-center text-xs text-gray-400 mt-3">
                © 2025 SEC-UR Privacy
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}