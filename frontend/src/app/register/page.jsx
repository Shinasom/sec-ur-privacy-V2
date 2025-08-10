'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'

// Reusable Icon components
const UserIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>);
const LockClosedIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H4.5a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>);
const EmailIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>);
const DocumentArrowUpIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>);
const PencilSquareIcon = ({ className }) => ( <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>);


// A reusable input component with an icon and a label
const FormField = ({ id, label, icon, children }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
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
    const [fileName, setFileName] = useState('No file chosen');
    const router = useRouter();

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
            setFileName('No file chosen');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const submissionData = new FormData();
        for (const key in formData) {
            submissionData.append(key, formData[key]);
        }

        try {
            await axios.post('http://127.0.0.1:8000/api/users/', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push('/login');
        } catch (err) {
            const errorData = err.response?.data;
            if (errorData) {
                const messages = Object.values(errorData).flat().join(' ');
                setError(messages || 'Registration failed. Please check your input.');
            } else {
                setError('An unknown error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-full min-h-screen lg:flex">
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
            <div className="lg:w-1/2 w-full flex items-center justify-center p-6 sm:p-8 bg-gray-100">
                <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg">
                    <div className="text-center sm:text-left mb-8">
                        <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
                        <p className="text-gray-600 mt-2">Let's get you started on your secure journey.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <FormField id="username" label="Username" icon={<UserIcon className="h-5 w-5 text-gray-400" />}>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                onChange={handleChange}
                                placeholder="e.g., jane_doe"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400"
                            />
                        </FormField>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField id="first_name" label="First Name" icon={<UserIcon className="h-5 w-5 text-gray-400" />}>
                                <input
                                    id="first_name"
                                    name="first_name"
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="e.g., Jane"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400"
                                />
                            </FormField>
                            <FormField id="last_name" label="Last Name" icon={<UserIcon className="h-5 w-5 text-gray-400" />}>
                                <input
                                    id="last_name"
                                    name="last_name"
                                    type="text"
                                    onChange={handleChange}
                                    placeholder="e.g., Doe"
                                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400"
                                />
                            </FormField>
                        </div>

                        <FormField id="email" label="Email Address" icon={<EmailIcon className="h-5 w-5 text-gray-400" />}>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                onChange={handleChange}
                                placeholder="you@example.com"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400"
                            />
                        </FormField>

                        <FormField id="password" label="Password" icon={<LockClosedIcon className="h-5 w-5 text-gray-400" />}>
                           <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400"
                            />
                        </FormField>
                        
                        <FormField id="bio" label="Bio (Optional)" icon={<PencilSquareIcon className="h-5 w-5 text-gray-400" />}>
                            <textarea
                                id="bio"
                                name="bio"
                                onChange={handleChange}
                                placeholder="Tell us about yourself..."
                                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition placeholder-gray-400"
                                rows="3"
                            ></textarea>
                        </FormField>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Profile Picture
                            </label>
                            <label htmlFor="profile_pic" className="relative flex items-center px-4 py-3 bg-white border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-purple-500 transition">
                                <DocumentArrowUpIcon className="h-6 w-6 text-purple-600" />
                                <span className="ml-3 text-gray-700">{fileName}</span>
                                <span className="ml-auto text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-md px-3 py-1">
                                    Choose File
                                </span>
                                <input id="profile_pic" name="profile_pic" type="file" required onChange={handleFileChange} className="sr-only" />
                            </label>
                             <p className="text-xs text-gray-500 mt-1">Required for facial recognition.</p>
                        </div>

                        {error && (
                            <div className="p-3 flex items-center gap-x-3 text-sm text-center text-red-800 bg-red-100 border border-red-300 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" /></svg>
                                {error}
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full py-3 px-4 font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-70 transition-all duration-300 ease-in-out">
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </button>
                        
                        <p className="text-sm text-center text-gray-600 pt-4">
                            Already have an account?{' '}
                            <Link href="/login" className="font-medium text-purple-600 hover:text-purple-500 hover:underline">
                                Log In
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}
