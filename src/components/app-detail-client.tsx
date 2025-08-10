
"use client"

import { doc, updateDoc, increment, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App, AdSettingsData } from "@/lib/types";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Download, Share, Calendar, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AdRenderer } from "./ad-renderer";

interface AppDetailClientProps {
  initialApp: App;
  appId: string;
}

export function AppDetailClient({ initialApp, appId }: AppDetailClientProps) {
  const [app, setApp] = useState<App>(initialApp);
  const [adSettings, setAdSettings] = useState<AdSettingsData | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const fetchAdSettings = async () => {
        const docRef = doc(db, "settings", "ads");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            setAdSettings(docSnap.data() as AdSettingsData);
        }
    };
    fetchAdSettings();
  }, []);

  useEffect(() => {
    const docRef = doc(db, "apps", appId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
            const data = docSnap.data();
            setApp({ 
                id: docSnap.id, 
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : app.createdAt,
            } as App);
        } else {
            notFound();
        }
        setLoading(false);
    }, (error) => {
        console.error("Error fetching real-time app data", error);
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load real-time app data."
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [appId, toast, app.createdAt]);

  const handleDownload = async () => {
    if (!app?.apkUrl) return;
    try {
        const docRef = doc(db, "apps", appId);
        await updateDoc(docRef, {
            downloads: increment(1)
        });
        window.open(app.apkUrl, '_blank');
    } catch (error) {
        console.error("Error updating download count", error);
        toast({
            variant: "destructive",
            title: "Download Error",
            description: "Could not process download. Please try again."
        })
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: app?.name,
          text: `Check out ${app?.name}, a great app!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
            variant: "destructive",
            title: "Share Error",
            description: "Could not share the app at this moment."
        })
      }
    } else {
        navigator.clipboard.writeText(window.location.href);
        toast({
            title: "Link Copied",
            description: "App URL has been copied to your clipboard.",
        });
    }
  };

  if (loading) {
    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
           <div className="flex flex-col md:flex-row items-start gap-8">
                <Skeleton className="w-full md:w-48 h-48 rounded-3xl" />
                <div className="w-full space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-5 w-full" />
                    <div className="flex gap-2">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                     <div className="flex gap-4">
                        <Skeleton className="h-12 w-36 rounded-lg" />
                        <Skeleton className="h-12 w-24 rounded-lg" />
                    </div>
                </div>
           </div>
           <div className="mt-12">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Skeleton className="w-full h-56 rounded-xl" />
                    <Skeleton className="w-full h-56 rounded-xl" />
                    <Skeleton className="w-full h-56 rounded-xl" />
                </div>
           </div>
        </div>
    );
  }

  if (!app) {
    return notFound();
  }
  
  const hasApk = !!app.apkUrl;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
            <Image
                src={app.iconUrl}
                alt={`${app.name} icon`}
                width={192}
                height={192}
                className="rounded-3xl border-4 border-card object-cover aspect-square shadow-lg w-32 h-32 md:w-48 md:h-48"
                data-ai-hint="app icon"
            />
            <div className="flex-1 space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold font-headline">{app.name}</h1>
                <p className="text-lg text-muted-foreground">{app.description}</p>
                
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground pt-2">
                    {app.version && <div className="flex items-center gap-1.5"><Info className="h-4 w-4" /> Version {app.version}</div>}
                    {app.downloads !== undefined && <div className="flex items-center gap-1.5"><Download className="h-4 w-4" /> {app.downloads.toLocaleString()} downloads</div>}
                    {app.createdAt && <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {new Date(app.createdAt.toString()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>}
                </div>

                 {app.tags && app.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {app.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="capitalize">#{tag}</Badge>
                        ))}
                    </div>
                )}
                
                <div className="flex items-center gap-2 pt-4">
                    {hasApk && (
                        <Button size="lg" onClick={handleDownload}>
                            <Download className="mr-2"/>
                            Download APK
                        </Button>
                    )}
                     <Button size="lg" variant="outline" onClick={handleShare}>
                        <Share className="mr-2"/>
                        Share
                    </Button>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12 mt-12">
            <div>
                <Card>
                    <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-4">About this app</h2>
                        <div className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                            {app.featureHighlights}
                        </div>
                    </CardContent>
                </Card>

                {app.screenshots && app.screenshots.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-4">Screenshots</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {app.screenshots.map((url, index) => (
                                <a href={url} target="_blank" rel="noopener noreferrer" key={index}>
                                    <Image
                                        src={url}
                                        alt={`Screenshot ${index + 1} for ${app.name}`}
                                        width={1280}
                                        height={720}
                                        className="rounded-xl border object-cover aspect-video hover:opacity-90 transition-opacity"
                                        data-ai-hint="app screenshot"
                                    />
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
             <div className="space-y-6">
                 <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-semibold mb-4 text-xl">App Details</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                             <div className="flex justify-between">
                                <span className="font-medium text-card-foreground">Version</span>
                                <span>{app.version || 'N/A'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="font-medium text-card-foreground">Updated on</span>
                                <span>{app.createdAt ? new Date(app.createdAt.toString()).toLocaleDateString() : 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium text-card-foreground">Downloads</span>
                                <span>{app.downloads !== undefined ? `${app.downloads.toLocaleString()}+` : 'N/A'}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="font-medium text-card-foreground">Website</span>
                                {app.websiteUrl ? <a href={app.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Visit</a> : <span>N/A</span>}
                            </div>
                        </div>
                    </CardContent>
                 </Card>

                {adSettings?.appDetailPageAdKey && (
                    <div className="flex justify-center pt-4">
                        <AdRenderer adKey={adSettings.appDetailPageAdKey} width={300} height={250} />
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}
