'use client';

import Link from 'next/link';
import { useAuth } from '@/libs/auth-context.js';

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.74.08-.74 1.2.09 1.83 1.23 1.83 1.23 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.23-3.22-.12-.3-.53-1.52.12-3.18 0 0 1-.32 3.3 1.23a11.46 11.46 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6 0h3.83v1.64h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.77 2.65 4.77 6.1V21h-4v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.97V21H9V9Z" />
    </svg>
  );
}

export default function Footer() {
  const { user } = useAuth();

  return (
    <footer className="border-t border-[var(--line)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        {/* Brand information */}
        <div>
          <div className="flex items-center gap-3">
            <span className="logo-mark">
              P
            </span>

            <h3 className="font-display text-2xl font-black">
              PromptGrid
            </h3>
          </div>

          <p className="mt-4 max-w-md text-sm leading-7 muted">
            AI Prompt Sharing & Marketplace Platform for discovering, creating,
            reviewing and managing prompt workflows securely.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:contents">
          {/* Platform links */}
          <div>
            <h4 className="font-black">
              Platform
            </h4>

            <div className="mt-4 grid gap-2 text-sm muted">
              <Link href="/">
                Home
              </Link>

              <Link href="/all-prompts">
                All Prompts
              </Link>

              <Link href="/payment">
                Pricing
              </Link>

              {user ? <Link href="/dashboard">Dashboard</Link> : null}
            </div>
          </div>

          {/* Legal links */}
          <div>
            <h4 className="font-black">
              Legal
            </h4>

            <div className="mt-4 grid gap-2 text-sm muted">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/faq">FAQ</Link>
            </div>
          </div>
        </div>

        {/* Social links */}
        <div>
          <h4 className="font-black">
            Social
          </h4>

          <div className="mt-4 flex gap-3">
            <a
              className="badge transition hover:-translate-y-0.5"
              href="https://www.linkedin.com/in/fahid-hasan-280425382/"
              target="_blank"
              rel="noreferrer"
              aria-label="Fahid Hasan on LinkedIn"
            >
              <LinkedinIcon />
            </a>

            <a
              className="badge transition hover:-translate-y-0.5"
              href="https://github.com/fahid2002"
              target="_blank"
              rel="noreferrer"
              aria-label="Fahid Hasan on GitHub"
            >
              <GithubIcon />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright text */}
      <p className="mx-auto mt-10 max-w-7xl text-sm muted">
        © {new Date().getFullYear()} PromptGrid AI.
      </p>
    </footer>
  );
}
