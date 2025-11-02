// =======================================================================
// /src/context/AuthContext.js
// This version fixes the 401 Unauthorized error by ensuring the API client
// is immediately configured with the new auth token upon login and on
// initial page load.
//
// FIXED AGAIN: Now also exports 'setUser' so other components can update
// the user state.
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
    const bootstrapAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        try {
          // --- FIX ---
          // Immediately configure the api client to use the token for all subsequent requests.
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          const decodedUser = jwtDecode(accessToken);
          setTokens({ access: accessToken, refresh: localStorage.getItem('refresh_token') });
          
          const response = await api.get(`/api/users/${decodedUser.user_id}/`);
          setUser(response.data);

        } catch (error) {
          console.error("AuthContext: Failed to initialize auth state.", error);
          // If token is invalid or expired, clear everything.
          delete api.defaults.headers.common['Authorization'];
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          setUser(null);
          setTokens(null);
        }
      }
      setLoading(false);
    };

    bootstrapAuth();
  }, []);

  const loginUser = async (username, password) => {
    try {
      const response = await api.post('/api/token/', { username, password });
      const data = response.data;

      // --- FIX ---
      // 1. Immediately configure the api client with the new token.
      api.defaults.headers.common['Authorization'] = `Bearer ${data.access}`;
      
      // 2. Save tokens to localStorage.
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);

      // 3. Set state.
      setTokens(data);
      
      const decodedUser = jwtDecode(data.access);
      
      // 4. Now, this API call will be properly authenticated.
      const userProfileResponse = await api.get(`/api/users/${decodedUser.user_id}/`);
      setUser(userProfileResponse.data);
      
      router.push('/feed');
      return { success: true };
    } catch (error) {
      console.error("AuthContext: Login failed!", error);
      return { success: false, error: error.response?.data?.detail || "An error occurred." };
    }
  };
  
  const registerUser = async (userData) => {
    try {
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });

      await api.post('/api/users/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // The loginUser function will now handle authentication correctly.
      await loginUser(userData.username, userData.password);
      return { success: true };

    } catch (error) {
      console.error("Registration failed:", error.response?.data);
      const errorMessages = Object.values(error.response?.data || {}).flat().join(' ');
      return { success: false, error: errorMessages || "Registration failed." };
    }
  };

  const logoutUser = () => {
    // --- FIX ---
    // Clear the authorization header from the api client on logout.
    delete api.defaults.headers.common['Authorization'];

    setTokens(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    router.push('/login');
  };

  const contextData = {
    user,
    setUser, // <-- THIS IS THE REQUIRED FIX
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