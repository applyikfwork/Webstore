import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/providers/auth-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Header } from '@/components/header';

let iconUrl = '/favicon.ico';
try {
  const docRef = doc(db, "settings", "site");
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() && docSnap.data().iconUrl) {
    iconUrl = docSnap.data().iconUrl;
  }
} catch (error) {
  // Gracefully fallback to default icon
  console.error("Could not fetch site icon for metadata", error);
}

export const metadata: Metadata = {
  title: 'App Showcase Central',
  description: 'A platform for showcasing APKs and websites.',
  icons: {
    icon: iconUrl,
  }
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let fetchedIconUrl = '/favicon.ico';
    try {
        const docRef = doc(db, "settings", "site");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().iconUrl) {
            fetchedIconUrl = docSnap.data().iconUrl;
        }
    } catch (error) {
        console.error("Could not fetch site icon for layout", error);
    }
    
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <Header iconUrl={fetchedIconUrl} />
          <main>{children}</main>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  );
}
