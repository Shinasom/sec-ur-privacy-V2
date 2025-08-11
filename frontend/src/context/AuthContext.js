// =======================================================================
// /src/context/AuthContext.js
// This version includes console.log statements for debugging the 401 error.
// =======================================================================
'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("AuthContext: Checking for token on initial load...");
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      console.log("AuthContext: Found token in localStorage.", accessToken);
      try {
        const decodedUser = jwtDecode(accessToken);
        setUser(decodedUser);
        setTokens({ access: accessToken, refresh: localStorage.getItem('refresh_token') });
      } catch (error) {
        console.error("AuthContext: Invalid token found.", error);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } else {
      console.log("AuthContext: No token found in localStorage.");
    }
    setLoading(false);
  }, []);

  const loginUser = async (username, password) => {
    try {
      console.log("AuthContext: Attempting to log in with username:", username);
      const response = await api.post('/api/token/', { username, password });
      
      const data = response.data;
      console.log("AuthContext: Login successful! Received tokens:", data);

      setTokens(data);
      setUser(jwtDecode(data.access));
      
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      console.log("AuthContext: Tokens have been saved to localStorage.");
      
      router.push('/feed');
      return { success: true };
    } catch (error) {
      console.error("AuthContext: Login failed!", error);
      return { success: false, error: error.response?.data?.detail || "An error occurred." };
    }
  };
  
  const registerUser = async (userData) => {
    // ... (registerUser function remains the same)
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });

      await api.post('/api/users/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      await loginUser(userData.username, userData.password);
      return { success: true };

    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      return { success: false, error: error.response?.data || "Registration failed." };
    }
  };

  const logoutUser = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const contextData = {
    user,
    tokens,
    loading,
    loginUser,
    logoutUser,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <p>Loading...</p> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
