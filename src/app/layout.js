import {
  Inter,
  Space_Grotesk,
} from 'next/font/google';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import Footer from '@/components/layout/Footer.js';
import Header from '@/components/layout/Header.js';
import Providers from '@/components/layout/Providers.js';

// Main body font
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

// Display font
const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
});

// Website metadata
export const metadata = {
  title: 'PromptGrid AI Marketplace',
  description: 'Discover, share, review and manage high-quality AI prompts.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${space.variable} light-mode font-sans`}>
        {/* Global providers wrap the whole app */}
        <Providers>
          {/* Main navigation header */}
          <Header />

          {/* Page content */}
          <main>
            {children}
          </main>

          {/* Global footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}