
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { HomeClient } from "@/components/home-client";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: 'MyAppStore - Discover and Download Apps',
    description: 'The ultimate platform for developers to showcase their latest APKs and web applications. Discover, download, and get details on a wide variety of apps.',
};

async function getApps(): Promise<App[]> {
    const appsCollectionRef = collection(db, "apps");
    const q = query(appsCollectionRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    const apps = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate().toISOString(),
        } as App;
    });
    // Sort featured apps to the top
    return apps.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
}

export default async function Home() {
  const apps = await getApps();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <section className="relative flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 dark:from-indigo-950/50 dark:via-background dark:to-fuchsia-950/50">
           <div className="max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-fuchsia-500 drop-shadow-sm">
                    MyAppStore
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-xl mx-auto tracking-wide">
                    Discover the latest and greatest apps and websites, curated just for you.
                </p>
                <div className="mt-8 flex justify-center gap-4">
                    <Button size="lg" asChild>
                        <a href="#apps">
                            Browse Apps
                            <ArrowDown className="ml-2 h-5 w-5"/>
                        </a>
                    </Button>
                </div>
            </div>
        </section>
        
        <section id="apps" className="container mx-auto px-4 py-16">
            <HomeClient apps={apps} />
        </section>

      </main>
    </div>
  );
}
