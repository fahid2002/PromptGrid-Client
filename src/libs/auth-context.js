'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api } from './api.js';

const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => { try { const data = await api('/auth/me'); setUser(data.user); } catch { setUser(null); } finally { setLoading(false); } }, []);
  useEffect(() => { void refresh(); }, [refresh]); // eslint-disable-line react-hooks/set-state-in-effect
  const value = useMemo(() => ({ user, loading, setUser, refresh }), [user, loading, refresh]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
export function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth(); const router = useRouter(); const pathname = usePathname();
  useEffect(() => { if (!loading && !user) router.replace(`/login?next=${encodeURIComponent(pathname)}`); else if (!loading && roles && !roles.includes(user?.role)) router.replace('/dashboard'); }, [loading, user, roles, router, pathname]);
  if (loading || !user || (roles && !roles.includes(user.role))) return <div className="mx-auto max-w-7xl px-4 py-20"><div className="skeleton h-48 rounded-[2rem]" /></div>;
  return children;
}
