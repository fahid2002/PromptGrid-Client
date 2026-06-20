'use client';

import Link from 'next/link';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '@/libs/api.js';
import { useAuth } from '@/libs/auth-context.js';
import NotificationBell from '@/components/notifications/NotificationBell.js';

// Header navigation links
const links = [
  ['Home', '/'],
  ['All Prompts', '/all-prompts'],
  ['Trending', '/#featured'],
  ['Creators', '/#creators'],
  ['Dashboard', '/dashboard'],
  ['Pricing', '/payment'],
];

export default function Header() {
  // Get current user and user setter from auth context
  const { user, setUser } = useAuth();

  // Get current pathname for active nav link
  const pathname = usePathname();

  // Used for redirecting after logout
  const router = useRouter();

  // Mobile menu open/close state
  const [open, setOpen] = useState(false);

  // Theme state
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Load saved theme from localStorage
    const saved = localStorage.getItem('promptgrid-theme') === 'dark';

    document.body.classList.toggle('dark-mode', saved);
    document.body.classList.toggle('light-mode', !saved);

    requestAnimationFrame(() => setDark(saved));
  }, []);

  // Switch between dark and light mode
  const toggleTheme = () => {
    const next = !dark;

    setDark(next);

    localStorage.setItem('promptgrid-theme', next ? 'dark' : 'light');

    document.body.classList.toggle('dark-mode', next);
    document.body.classList.toggle('light-mode', !next);
  };

  // Logout user and redirect to home page
  const logout = async () => {
    await api('/auth/logout', {
      method: 'POST',
    });

    setUser(null);

    toast.success('Logged out');

    router.push('/');
  };

  return (
    <header className="nav-blur sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between gap-4">
          {/* Website logo */}
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <span className="logo-mark">
              P
            </span>

            <span>
              <b className="font-display text-xl leading-none">
                PromptGrid
              </b>

              <small className="block text-[10px] font-bold uppercase tracking-[.22em] muted">
                AI Marketplace
              </small>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden items-center gap-7 text-sm font-extrabold lg:flex">
            {links.map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className={pathname === href ? 'nav-link active' : 'nav-link'}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop right side actions */}
          <div className="hidden items-center gap-3 lg:flex">
            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="btn-outline icon-button rounded-full p-3"
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* Show dashboard/logout if user is logged in */}
            {user ? (
              <>
                <NotificationBell />
                <Link
                  href="/dashboard"
                  className="btn-outline rounded-2xl px-4 py-3 text-sm font-black"
                >
                  {user.name.split(' ')[0]} · {user.role}
                </Link>

                <button
                  onClick={logout}
                  className="btn-lime rounded-2xl px-5 py-3 text-sm font-black"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="btn-outline rounded-2xl px-5 py-3 text-sm font-black"
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className="btn-lime rounded-2xl px-5 py-3 text-sm font-black"
                >
                  Start creating
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="btn-outline icon-button grid lg:hidden"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile navigation menu */}
        {open ? (
          <div className="pb-5 lg:hidden">
            <div className="hard-card grid gap-2 rounded-3xl p-4">
              {links.map(([label, href]) => (
                <Link
                  onClick={() => setOpen(false)}
                  key={label}
                  href={href}
                  className="rounded-2xl p-3 font-bold"
                >
                  {label}
                </Link>
              ))}
              <div className="my-1 border-t border-[#17192d]/15" />
              {user ? (
                <>
                  <div className="flex justify-end px-2"><NotificationBell /></div>
                  <Link
                    onClick={() => setOpen(false)}
                    href="/dashboard"
                    className="btn-outline rounded-2xl px-4 py-3 text-center text-sm font-black"
                  >
                    {user.name.split(' ')[0]} · {user.role}
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="btn-lime rounded-2xl px-5 py-3 text-sm font-black"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    href="/login"
                    className="btn-outline rounded-2xl px-5 py-3 text-center text-sm font-black"
                  >
                    Log in
                  </Link>
                  <Link
                    onClick={() => setOpen(false)}
                    href="/register"
                    className="btn-lime rounded-2xl px-5 py-3 text-center text-sm font-black"
                  >
                    Start creating
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
