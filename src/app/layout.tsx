import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
export const metadata: Metadata = {
  title: 'SEDA Data Feeds Explorer — v2',
  description: 'Explore 3,000+ supported data feeds on the SEDA network — crypto, equities, forex, commodities, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body data-theme="dark">
        {children}
      </body>
    </html>
  );
}
