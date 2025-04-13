import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Game ID Shop',
  description: 'Buy game IDs and accounts with premium features',
  keywords: 'game accounts, gaming, digital goods, game id, game shop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-black">
        {children}
      </body>
    </html>
  );
}