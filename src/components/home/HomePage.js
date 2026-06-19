'use client';

import { useEffect, useState } from 'react';
import { api } from '@/libs/api.js';
import HeroSection from './HeroSection.js';
import { BenefitsSection, CommunitySection, ExtraSections, FeaturedSection } from './MarketplaceSections.js';

const emptyHome = { featured: [], topCreators: [], reviews: [], categories: [], totals: { copies: 0, prompts: 0 } };
export default function HomePage() { const [data, setData] = useState(null); useEffect(() => { let active = true; api('/prompts/home').then((result) => { if (active) setData(result); }).catch(() => { if (active) setData(emptyHome); }); return () => { active = false; }; }, []); return <><HeroSection data={data} /><FeaturedSection prompts={data?.featured} /><BenefitsSection /><CommunitySection creators={data?.topCreators} reviews={data?.reviews} /><ExtraSections categories={data?.categories} /></>; }
