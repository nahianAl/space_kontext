import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
// import { ClerkProvider } from '@/lib/clerk-provider'; // Temporarily disabled for development
import './globals.css';
import ErrorBoundary from '@/shared/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Space Kontext - Architectural Design Platform',
  description: 'Professional architectural design tool with site analysis, 2D floorplan editing, 3D model generation, and massing diagrams.',
  keywords: ['architecture', 'design', 'floorplan', '3D modeling', 'site analysis'],
  authors: [{ name: 'Space Kontext Team' }],
  creator: 'Space Kontext',
  publisher: 'Space Kontext',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Space Kontext - Architectural Design Platform',
    description: 'Professional architectural design tool with site analysis, 2D floorplan editing, 3D model generation, and massing diagrams.',
    url: '/',
    siteName: 'Space Kontext',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Space Kontext - Architectural Design Platform',
    description: 'Professional architectural design tool with site analysis, 2D floorplan editing, 3D model generation, and massing diagrams.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* <ClerkProvider> */}
          <ErrorBoundary>
            <div id="root" className="relative flex min-h-screen flex-col">
              {children}
            </div>
          </ErrorBoundary>
        {/* </ClerkProvider> */}
      </body>
    </html>
  );
}
