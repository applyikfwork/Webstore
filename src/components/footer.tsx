
"use client";

import Link from 'next/link';
import { Twitter, Github, Linkedin } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import type { SiteSettingsData } from '@/lib/types';

export function Footer() {
  const [settings, setSettings] = useState<SiteSettingsData>({});

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "settings", "site"), (doc) => {
        if (doc.exists()) {
            setSettings(doc.data() as SiteSettingsData);
        }
    });
    return () => unsubscribe();
  }, []);


  return (
    <footer className="bg-secondary/40 dark:bg-card border-t">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4 col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold font-headline text-primary">{settings.appName || 'MyAppStore'}</h3>
            <p className="text-muted-foreground max-w-md">
              Discover the latest and greatest apps and websites, curated just for you. The ultimate platform for developers to showcase their latest creations.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold tracking-wider uppercase text-foreground/90">Navigate</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold tracking-wider uppercase text-foreground/90">Legal</h4>
            <ul className="mt-4 space-y-2 text-muted-foreground">
              <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row gap-x-4 gap-y-2 text-center">
            <p>&copy; {new Date().getFullYear()} {settings.appName || 'MyAppStore'}. All rights reserved.</p>
            <p className="hidden sm:block">|</p>
            <p>Created by Jitender Prajapat</p>
          </div>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            {settings.twitterUrl && (
                <Link href={settings.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                </Link>
            )}
            {settings.githubUrl && (
                <Link href={settings.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="h-5 w-5" />
                </Link>
            )}
            {settings.linkedinUrl && (
                 <Link href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                </Link>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
