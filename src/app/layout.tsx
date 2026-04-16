import { GeistSans } from 'geist/font/sans';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SubjectLine AI — Generate High-Converting Email Subject Lines',
  description: 'AI-powered email subject line generator. Create compelling, curiosity-driven subject lines that boost open rates for newsletters, cold emails, promotions & more.',
  keywords: ['email subject lines', 'AI', 'email marketing', 'open rate', 'copywriting', 'newsletter'],
  openGraph: {
    title: 'SubjectLine AI — Email Subject Lines That Get Opened',
    description: 'Generate scroll-stopping email subject lines with AI. Multiple email types, tones, and industries.',
    type: 'website',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${GeistSans.variable} font-sans bg-zinc-950 text-zinc-50 antialiased`}>
        <nav className="fixed top-0 w-full glass z-50 px-6 py-3 flex items-center justify-between">
          <span className="font-bold text-lg gradient-text">SubjectLine AI</span>
          <div className="flex gap-4 text-sm">
            <a href="/" className="text-zinc-400 hover:text-white transition">Home</a>
            <a href="/dashboard" className="text-zinc-400 hover:text-white transition">Dashboard</a>
            <a href="/pricing" className="text-zinc-400 hover:text-white transition">Pricing</a>
          </div>
        </nav>
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
