"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "./ui/button";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogIn, LogOut, UserCog } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";

interface HeaderProps {
    iconUrl: string | null;
}

export function Header({ iconUrl }: HeaderProps) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const isAdmin = user?.email === 'xyzapplywork@gmail.com';

    const handleSignOut = async () => {
        await auth.signOut();
        router.push('/');
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    {authLoading ? (
                        <Skeleton className="h-6 w-6 rounded-md" />
                    ) : (
                        iconUrl && <Image src={iconUrl} alt="Site Icon" width={24} height={24} className="rounded-md" />
                    )}
                    <span className="hidden font-bold sm:inline-block font-headline">
                        App Showcase Central
                    </span>
                </Link>
                <div className="flex flex-1 items-center justify-end space-x-2">
                    {authLoading ? (
                       <Skeleton className="h-8 w-24" />
                    ) : user ? (
                        <>
                            {isAdmin && (
                                <Link href="/admin">
                                    <Button variant="ghost">
                                        <UserCog className="mr-2 h-4 w-4" />
                                        Admin
                                    </Button>
                                </Link>
                            )}
                            <Button onClick={handleSignOut} variant="outline">
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost">
                                <LogIn className="mr-2 h-4 w-4" />
                                Admin Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
