import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GridRush — Real-Time Shared Grid',
  description: 'Multiplayer real-time block-capturing game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-gray-100 min-h-screen antialiased selection:bg-primary selection:text-white">
        {children}
      </body>
    </html>
  );
}

