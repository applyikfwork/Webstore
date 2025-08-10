import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { HomeClient } from "@/components/home-client";

export const dynamic = "force-dynamic";

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
    return apps;
}

export default async function Home() {
  const apps = await getApps();

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">App Showcase Central</h1>
          <p className="text-lg text-muted-foreground mt-2">Discover the latest apps and websites.</p>
        </div>
        
        <HomeClient apps={apps} />

      </main>
    </div>
  );
}
