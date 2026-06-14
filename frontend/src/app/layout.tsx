import type { Metadata } from 'next';
import { Sora, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const sora = Sora({
  weight: ['400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
});
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sentinel | On-chain AI content-policy gate',
  description:
    'Publish a policy in plain language, submit content against it, and an injection-resistant AI moderator rules COMPLIANT, FLAGGED, or BLOCKED with a severity score under GenLayer validator consensus.',
  openGraph: {
    title: 'Sentinel | On-chain AI content-policy gate',
    description:
      'An AI moderator settles content-policy rulings under GenLayer validator consensus. Auditable moderation, no backend.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-abyss font-body text-mist antialiased">{children}</body>
    </html>
  );
}
