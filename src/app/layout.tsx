import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';

export const metadata: Metadata = {
    title: 'App Showcase Central',
    description: 'A platform for showcasing APKs and websites.',
    icons: {
        icon: '/favicon.ico',
    }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <Header />
          <main>{children}</main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
