
"use client";

import type { App } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Globe, Download, Eye } from "lucide-react";
import Link from "next/link";

export function AppCard({ app }: { app: App }) {
    const hasWebsite = !!app.websiteUrl;
    const hasApk = !!app.apkUrl;

    const getBadgeLabel = () => {
        if (hasWebsite && hasApk) return "Website & APK";
        if (hasWebsite) return "Website";
        if (hasApk) return "APK";
        return "App";
    }

    return (
        <Card className="flex flex-col w-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 bg-card">
            <CardHeader className="flex-row items-start gap-4 p-4">
                <Image
                    src={app.iconUrl}
                    alt={`${app.name} icon`}
                    width={64}
                    height={64}
                    className="rounded-lg border object-cover h-16 w-16"
                    data-ai-hint="app icon"
                />
                <div className="flex-1">
                    <CardTitle className="text-xl font-headline">{app.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1 capitalize">
                        {getBadgeLabel()}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="flex-1 px-4 pb-4 text-sm space-y-4">
                <div>
                  <h4 className="font-semibold mb-1 text-card-foreground">Description</h4>
                  <p className="text-muted-foreground line-clamp-3">{app.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-card-foreground">Features</h4>
                  <p className="text-muted-foreground line-clamp-2">{app.featureHighlights}</p>
                </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4 mt-auto">
               <div className="w-full flex flex-col sm:flex-row gap-2">
                 <Link href={`/app/${app.id}`} className="flex-1">
                    <Button className="w-full" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
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
                                <Globe className="mr-2 h-4 w-4" />
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
                                <Download className="mr-2 h-4 w-4" />
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
