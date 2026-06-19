'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api } from './api.js';

// Auth context stores user, loading state and auth helper functions
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Stores logged-in user data
  const [user, setUser] = useState(null);

  // Tracks auth loading state while checking current user
  const [loading, setLoading] = useState(true);

  // Refresh current logged-in user from backend
  const refresh = useCallback(async () => {
    try {
      const data = await api('/auth/me');

      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check user session when app first loads
  useEffect(() => {
    void refresh();
  }, [refresh]); // eslint-disable-line react-hooks/set-state-in-effect

  // Memoized auth context value
  const value = useMemo(
    () => ({
      user,
      loading,
      setUser,
      refresh,
    }),
    [user, loading, refresh]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for using auth context
export const useAuth = () => useContext(AuthContext);

export function PrivateRoute({ children, roles }) {
  // Get current user and loading state
  const { user, loading } = useAuth();

  // Used for redirecting unauthorized users
  const router = useRouter();

  // Current page path used for redirect after login
  const pathname = usePathname();

  useEffect(() => {
    // If user is not logged in, redirect to login page
    if (!loading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (!loading && roles && !roles.includes(user?.role)) {
      // If user role is not allowed, redirect to dashboard
      router.replace('/dashboard');
    }
  }, [loading, user, roles, router, pathname]);

  // Show loading skeleton while checking auth or redirecting
  if (loading || !user || (roles && !roles.includes(user.role))) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20">
        <div className="skeleton h-48 rounded-[2rem]" />
      </div>
    );
  }

  return children;
}