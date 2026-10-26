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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=JetBrains+Mono:wght@400;500;600&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#e9e4db] text-[#0F1F1B] font-['Manrope'] antialiased selection:bg-[#E4F1C6] selection:text-[#034F46]">
        <SimProvider>
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-1 w-full">
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
