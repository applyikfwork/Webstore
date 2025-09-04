
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Inter } from 'next/font/google';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { SiteSettingsData } from '@/lib/types';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  let settings: SiteSettingsData = {};
  try {
    const docRef = doc(db, "settings", "site");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      settings = docSnap.data() as SiteSettingsData;
    }
  } catch (error) {
    console.error("Could not fetch site settings for metadata", error);
  }

  const title = settings.tagline ? `${settings.appName || 'MyAppStore'} | ${settings.tagline}` : 'App Showcase Central - Discover and Download Apps';
  const description = 'The ultimate platform for developers to showcase their latest APKs and web applications. Discover, download, and get details on a wide variety of apps.';

  return {
    title,
    description,
    icons: {
        icon: settings.iconUrl || '/favicon.ico',
    }
  };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <head/>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
