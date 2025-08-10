import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Header } from '@/components/header';

export async function generateMetadata(): Promise<Metadata> {
    // Simplified to prevent build errors. The dynamic icon is still fetched for the header.
    return {
        title: 'App Showcase Central',
        description: 'A platform for showcasing APKs and websites.',
        icons: {
            icon: '/favicon.ico',
        }
    };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let iconUrl = null;
  try {
    const docRef = doc(db, "settings", "site");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists() && docSnap.data().iconUrl) {
        iconUrl = docSnap.data().iconUrl;
    }
  } catch (error) {
    console.error("Could not fetch site settings", error);
  }
    
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <Header iconUrl={iconUrl} />
          <main>{children}</main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
