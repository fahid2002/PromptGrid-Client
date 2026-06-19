'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { formatNumber } from '@/libs/utils.js';

// Search tag list shown under the search box
const tags = [
  ['⚡ Viral content', 'content'],
  ['✦ 3D design', 'design'],
  ['⌘ Development', 'coding'],
  ['◆ Business', 'business'],
  ['☑ Study', 'study'],
  ['✍ Writing', 'writing'],
];

export default function HeroSection({ data }) {
  // Stores the search input value
  const [search, setSearch] = useState('');

  // Taking only the first 3 featured prompts for the hero floating cards
  const top = data?.featured?.slice(0, 3) || [];

  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1.08fr_.92fr]">
        {/* Left side hero content */}
        <div>
          <p className="section-label mb-5">
            Build faster with every AI tool
          </p>

          {/* Main hero heading */}
          <h1 className="font-display text-5xl font-black leading-[.95] tracking-[-.05em] sm:text-6xl lg:text-7xl">
            Discover, share & unlock{' '}
            <span className="gradient-text">
              powerful AI prompts.
            </span>
          </h1>

          {/* Short platform description */}
          <p className="mt-7 max-w-2xl text-base leading-8 muted sm:text-lg">
            A modern community marketplace where users can find public prompts,
            save favorites, copy tested workflows, review creators, report unsafe
            content, and unlock premium private prompts.
          </p>

          {/* Search form redirects user to all prompts page with search query */}
          <form
            action="/all-prompts"
            className="hard-card mt-8 flex max-w-2xl flex-col gap-3 rounded-[1.6rem] p-2 sm:flex-row"
          >
            <input
              name="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="input-box min-h-14 min-w-0 flex-1 rounded-[1.25rem] px-5 text-sm"
              placeholder="Search prompts, tags or AI tools..."
            />

            <button className="btn-lime min-h-14 rounded-[1.25rem] px-7 text-sm font-black">
              Find a prompt
            </button>
          </form>

          {/* Quick search tags */}
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map(([label, query]) => (
              <Link
                key={query}
                href={`/all-prompts?search=${query}`}
                className="badge"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Hero action buttons */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/all-prompts"
              className="btn-lime rounded-2xl px-6 py-4 text-sm font-black"
            >
              Explore Prompts
            </Link>

            <Link
              href="/register"
              className="btn-outline rounded-2xl px-6 py-4 text-sm font-black"
            >
              Become a Creator
            </Link>
          </div>
        </div>

        {/* Right side hero visual area */}
        <div className="relative min-h-[430px] lg:min-h-[520px]">
          {/* Background orbit design */}
          <div className="dotted-orbit absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rotate-12 sm:h-[430px] sm:w-[430px]" />

          {/* Main colorful background blob */}
          <div className="hero-blob left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />

          {/* Floating prompt cards */}
          {top.map((prompt, index) => (
            <FloatingPrompt
              key={prompt._id}
              prompt={prompt}
              index={index}
            />
          ))}

          {/* Shows loading, empty state, or analytics based on data */}
          {!data ? (
            <div className="skeleton absolute inset-12 rounded-[2rem]" />
          ) : top.length === 0 ? (
            <div className="hard-card absolute left-1/2 top-1/2 w-64 -translate-x-1/2 -translate-y-1/2 rounded-3xl p-6 text-center">
              <b>No approved prompts yet</b>

              <p className="mt-2 text-sm muted">
                Published prompts will appear here.
              </p>
            </div>
          ) : (
            <AnalyticsCard
              prompts={top}
              copies={data.totals?.copies}
            />
          )}
        </div>
      </div>
    </motion.section>
  );
}

function FloatingPrompt({ prompt, index }) {
  // Different card positions for the 3 floating prompt cards
  const positions = [
    'left-2 top-10 -rotate-6',
    'bottom-20 left-16 -rotate-3',
    'right-0 top-40 rotate-6',
  ];

  // Small labels shown on each floating card
  const labels = [
    'Hot this week',
    'Startup kit',
    'Creator favorite',
  ];

  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5 + index, repeat: Infinity }}
      className={`hard-card absolute w-64 rounded-3xl p-5 ${positions[index]}`}
    >
      <p className="text-[10px] font-black uppercase tracking-widest muted">
        {labels[index]}
      </p>

      {/* Prompt title */}
      <h3 className="mt-2 font-display text-xl font-black">
        {prompt.title}
      </h3>

      {/* Prompt copy count and rating */}
      <div className="mt-4 flex justify-between text-xs font-black muted">
        <span>
          {formatNumber(prompt.copyCount)} copies
        </span>

        <span>
          ★ {Number(prompt.averageRating || 0).toFixed(1)}
        </span>
      </div>
    </motion.div>
  );
}

function AnalyticsCard({ prompts, copies }) {
  return (
    <div className="soft-card absolute bottom-0 right-8 hidden w-72 rounded-[2rem] p-5 lg:block">
      <p className="text-xs font-black uppercase tracking-wider muted">
        Live analytics
      </p>

      {/* Total prompt copy count */}
      <h3 className="font-display text-2xl font-black">
        {formatNumber(copies)} copies
      </h3>

      {/* Simple bar graph based on each prompt copy count */}
      <div className="mt-5 flex h-20 items-end gap-2">
        {prompts.map((prompt) => (
          <span
            key={prompt._id}
            className="flex-1 rounded-t-xl bg-gradient-to-t from-cyan-400 to-violet-500"
            style={{
              height: `${Math.max(16, Math.min(100, prompt.copyCount || 0))}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}