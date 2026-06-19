import { Inter, Space_Grotesk } from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import Footer from '@/components/layout/Footer.js';
import Header from '@/components/layout/Header.js';
import Providers from '@/components/layout/Providers.js';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' }); const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space' });
export const metadata = { title: 'PromptGrid AI Marketplace', description: 'Discover, share, review and manage high-quality AI prompts.' };
export default function RootLayout({ children }) { return <html lang="en"><body className={`${inter.variable} ${space.variable} light-mode font-sans`}><Providers><Header /><main>{children}</main><Footer /></Providers></body></html>; }
