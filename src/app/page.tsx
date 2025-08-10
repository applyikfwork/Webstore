import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { AppCard } from "@/components/app-card";

export const revalidate = 0;

export default async function Home() {
  const appsCollectionRef = collection(db, "apps");
  const q = query(appsCollectionRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const apps = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as App[];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-headline">App Showcase Central</h1>
          <p className="text-lg text-muted-foreground mt-2">Discover the latest apps and websites.</p>
        </div>
        
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
      </main>
    </div>
  );
}
