import { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    accessToken: localStorage.getItem('accessToken') || null,
    userName: localStorage.getItem('LogedInUser') || null,
    userID: localStorage.getItem('userID') || null,
    userProfile: localStorage.getItem('userProfile') || null,
  });

  // Called after successful login — stores tokens & user info
  const login = useCallback((data) => {
    const { accessToken, name, userID, userProfile } = data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('LogedInUser', name);
    localStorage.setItem('userID', userID);
    localStorage.setItem('userProfile', userProfile);

    setAuth({ accessToken, userName: name, userID, userProfile });
  }, []);

  // Called on logout — clears localStorage, notifies server to revoke refresh token
  const logout = useCallback(async () => {
    try {
      await axiosInstance.post('/auth/logout'); // clears httpOnly cookie server-side
    } catch (_) {
      // Ignore errors — still clear client state
    }

    localStorage.removeItem('accessToken');
    localStorage.removeItem('LogedInUser');
    localStorage.removeItem('userID');
    localStorage.removeItem('userProfile');

    setAuth({ accessToken: null, userName: null, userID: null, userProfile: null });
  }, []);

  // Called from UpdateProfileImg after a successful upload
  const updateProfileImage = useCallback((url) => {
    localStorage.setItem('userProfile', url);
    setAuth((prev) => ({ ...prev, userProfile: url }));
  }, []);

  return (
    <AuthContext.Provider value={{ auth, login, logout, updateProfileImage }}>
      {children}
    </AuthContext.Provider>
  );
};

// Convenience hook
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
