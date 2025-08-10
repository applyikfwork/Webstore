
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserCog, Sun, Moon } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import type { SiteSettingsData } from "@/lib/types";

export function Header() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [settings, setSettings] = useState<SiteSettingsData>({});
    const [loading, setLoading] = useState(true);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "settings", "site"), (doc) => {
            if (doc.exists()) {
                setSettings(doc.data() as SiteSettingsData);
            }
            setLoading(false);
        });

        // Set initial theme based on system preference or localStorage
        const storedTheme = localStorage.getItem('theme') || 'light';
        setTheme(storedTheme);
        document.documentElement.classList.toggle('dark', storedTheme === 'dark');

        return () => unsubscribe();
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    {loading || authLoading ? (
                        <Skeleton className="h-8 w-8 rounded-md" />
                    ) : (
                        settings.iconUrl && <Image src={settings.iconUrl} alt="Site Icon" width={32} height={32} className="rounded-md" />
                    )}
                    <div className="flex flex-col">
                        <span className="font-bold sm:inline-block font-headline">
                           MyAppStore
                        </span>
                        {settings.tagline && <p className="text-xs text-muted-foreground hidden md:block">{settings.tagline}</p>}
                    </div>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
                        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    </Button>
                     {authLoading ? (
                       <Skeleton className="h-8 w-24" />
                    ) : user ? (
                        <>
                            <Link href="/admin">
                                <Button variant="ghost">
                                    <UserCog className="mr-2 h-4 w-4" />
                                    Admin
                                </Button>
                            </Link>
                            <Button onClick={handleSignOut} variant="outline">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button>
                                <LogIn className="mr-2 h-4 w-4" />
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
