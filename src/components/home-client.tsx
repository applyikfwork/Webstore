
"use client";

import type { App, AdSettingsData } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Globe, Download, Eye, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { AdRenderer } from "./ad-renderer";
import { cn } from "@/lib/utils";


function AppCard({ app }: { app: App }) {
    const hasWebsite = !!app.websiteUrl;
    const hasApk = !!app.apkUrl;

    const getBadgeLabel = () => {
        if (hasWebsite && hasApk) return "Website & APK";
        if (hasWebsite) return "Website";
        if (hasApk) return "APK";
        return "App";
    }

    return (
        <Card className={cn(
            "flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-card border group relative",
             app.featured && "border-primary/50 shadow-lg ring-2 ring-primary/20"
             )}>
            {app.featured && (
                <div className="absolute top-2 right-2 z-10">
                    <Badge variant="default" className="bg-amber-400 text-amber-900 hover:bg-amber-400/90 shadow-md">
                        <Star className="h-3 w-3 mr-1.5 fill-amber-900"/>
                        Featured
                    </Badge>
                </div>
            )}
            <CardHeader className="flex-row items-center gap-4 p-4">
                 <Image
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    width={64}
                    height={64}
                    className="rounded-full border-2 object-cover h-16 w-16"
                    data-ai-hint="app icon"
                />
                <div className="flex-1">
                    <CardTitle className="text-xl font-headline group-hover:text-primary transition-colors">{app.name}</CardTitle>
                    <Badge variant="outline" className="mt-1 capitalize">
                        {getBadgeLabel()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 px-4 pb-4 text-sm">
                <p className="text-muted-foreground line-clamp-3">{app.description}</p>
            </CardContent>
            <CardFooter className="bg-muted/30 p-4 mt-auto border-t">
               <div className="w-full flex flex-col sm:flex-row gap-2">
                 <Link href={`/app/${app.id}`} className="flex-1">
                    <Button className="w-full" variant="outline">
                        <Eye />
                        View
                    </Button>
                 </Link>
                 <div className="flex-1 flex gap-2">
                     {hasWebsite && (
                        <a
                            href={app.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button className="w-full" variant="outline">
                                <Globe />
                                Website
                            </Button>
                        </a>
                     )}
                     {hasApk && (
                        <a
                            href={app.apkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button className="w-full">
                                <Download />
                                APK
                            </Button>
                        </a>
                     )}
                 </div>
               </div>
            </CardFooter>
        </Card>
    );
}


interface HomeClientProps {
  apps: App[];
}

export function HomeClient({ apps }: HomeClientProps) {
  const [adSettings, setAdSettings] = useState<AdSettingsData | null>(null);

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

  return (
    <>
      {adSettings?.homePageAdKey && (
        <div className="my-12 flex justify-center p-6 bg-card border rounded-lg shadow-sm">
            <AdRenderer adKey={adSettings.homePageAdKey} width={728} height={90} />
        </div>
      )}
      {apps.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">No apps to display yet.</p>
          <p className="text-muted-foreground">The admin can add some from the admin panel.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {apps.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </>
  );
}
