'use client';

import { useEffect, useState } from 'react';
import { api } from '@/libs/api.js';
import HeroSection from './HeroSection.js';
import {
  BenefitsSection,
  CommunitySection,
  ExtraSections,
  FeaturedSection,
} from './MarketplaceSections.js';

// Default empty data used if API request fails
const emptyHome = {
  featured: [],
  topCreators: [],
  reviews: [],
  categories: [],
  totals: {
    copies: 0,
    prompts: 0,
  },
};

export default function HomePage() {
  // Stores homepage data from the API
  const [data, setData] = useState(null);

  useEffect(() => {
    // This flag prevents setting state if the component is unmounted
    let active = true;

    // Fetch homepage data from the backend
    api('/prompts/home')
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        // If API fails, use empty default data
        if (active) setData(emptyHome);
      });

    // Cleanup function when component unmounts
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      {/* Hero section receives full homepage data */}
      <HeroSection data={data} />

      {/* Featured prompts section */}
      <FeaturedSection prompts={data?.featured} />

      {/* Static benefits section */}
      <BenefitsSection />

      {/* Community section shows top creators and reviews */}
      <CommunitySection
        creators={data?.topCreators}
        reviews={data?.reviews}
      />

      {/* Extra sections show prompt categories */}
      <ExtraSections categories={data?.categories} />
    </>
  );
}