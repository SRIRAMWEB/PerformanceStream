import type { Metadata } from 'next';
import './globals.css';
import { SimProvider } from '@/src/context/SimContext';
import { TopBar } from '@/src/components/TopBar';
import { Footer } from '@/src/components/BottomBar';

import { AudioTourPlayer } from '@/src/components/AudioTourPlayer';

export const metadata: Metadata = {
  title: 'PerformanceStream — Secure Real-Time Sports Analytics Pipeline',
  description: 'A secure real-time sports analytics pipeline that verifies every sensor reading, quarantines anything suspicious, and lets coaches trace any number back to its source.',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' fill='%23034F46'/><circle cx='16' cy='16' r='6' fill='%23E4F1C6'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#F6F1E7] text-[#1D1B16] font-sans antialiased selection:bg-[#E3DCCB] selection:text-[#1D1B16]">
        <SimProvider>
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-1 w-full" id="main-content">
              {children}
            </main>
            <Footer />
            <AudioTourPlayer />
          </div>
        </SimProvider>
      </body>
    </html>
  );
}
