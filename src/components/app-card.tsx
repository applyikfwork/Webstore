import type { App } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { Globe, Download } from "lucide-react";

export function AppCard({ app }: { app: App }) {
    return (
        <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-accent/20 hover:-translate-y-1 bg-card">
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
                    <Badge variant={app.type === 'apk' ? 'default' : 'secondary'} className="mt-1 capitalize">
                        {app.type}
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
            <CardFooter className="bg-muted/30 p-4">
                <a 
                    href={app.type === 'apk' ? app.apkUrl : app.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="w-full"
                >
                    <Button className="w-full text-white" style={{backgroundColor: 'hsl(var(--accent))'}}>
                        {app.type === 'apk' ? <Download className="mr-2 h-4 w-4" /> : <Globe className="mr-2 h-4 w-4" />}
                        {app.type === 'apk' ? 'Download APK' : 'Visit Website'}
                    </Button>
                </a>
            </CardFooter>
        </Card>
    );
}
