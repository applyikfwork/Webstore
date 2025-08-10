import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Globe, Download, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Metadata } from 'next'
import { Card, CardContent, CardHeader } from "@/components/ui/card";
 
type Props = {
  params: { id: string }
}
 
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const docRef = doc(db, "apps", params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return {
        title: "App Not Found",
        description: "The app you are looking for does not exist.",
    }
  }
 
  const app = docSnap.data() as App;
 
  return {
    title: `${app.name} | App Showcase`,
    description: app.description,
    openGraph: {
      title: app.name,
      description: app.description,
      images: [
        {
          url: app.iconUrl,
          width: 128,
          height: 128,
          alt: `${app.name} Icon`,
        },
      ],
    },
  }
}

export default async function AppPage({ params }: { params: { id: string } }) {
  const docRef = doc(db, "apps", params.id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    notFound();
  }

  const app = { id: docSnap.id, ...docSnap.data() } as App;
  const hasWebsite = !!app.websiteUrl;
  const hasApk = !!app.apkUrl;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-12">
      <div className="grid md:grid-cols-[300px_1fr] gap-8 items-start">
        <Card className="flex flex-col items-center gap-4 p-6 sticky top-24">
            <Image
                src={app.iconUrl}
                alt={`${app.name} icon`}
                width={150}
                height={150}
                className="rounded-2xl border-4 border-card object-cover aspect-square shadow-lg"
            />
            <div className="text-center">
                <h1 className="text-3xl font-bold font-headline">{app.name}</h1>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4"/>
                    <span>{app.createdAt?.toDate().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
             <div className="flex flex-col gap-2 w-full pt-4">
                {hasWebsite && (
                    <a 
                        href={app.websiteUrl}
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="flex-1"
                    >
                        <Button className="w-full" variant="outline">
                            <Globe className="mr-2 h-4 w-4" />
                            Visit Website
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
                            Download APK
                        </Button>
                    </a>
                 )}
             </div>
             <div className="text-center pt-2">
                {(hasWebsite || hasApk) && <Badge variant="secondary" className="capitalize">
                    {hasWebsite && hasApk ? "Website & APK" : hasWebsite ? "Website" : "APK"} Available
                </Badge>}
            </div>
        </Card>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-semibold text-foreground">Description</h2>
                </CardHeader>
                <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
                    <p>{app.description}</p>
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <h2 className="text-2xl font-semibold text-foreground">Feature Highlights</h2>
                </CardHeader>
                <CardContent className="prose prose-stone dark:prose-invert max-w-none text-muted-foreground">
                    <ul className="list-disc pl-5 space-y-2">
                       {app.featureHighlights.split('\n').map((feature, index) => feature.trim() && <li key={index}>{feature.replace(/•|-/g, '').trim()}</li>)}
                    </ul>
                </CardContent>
            </Card>
        </div>
    </div>
</div>
  );
}
