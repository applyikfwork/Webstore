
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { notFound } from "next/navigation";
import { AppDetailClient } from "@/components/app-detail-client";

// This function runs on the server to fetch initial data
async function getAppDetails(id: string): Promise<App | null> {
    try {
        const docRef = doc(db, "apps", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Ensure createdAt is a string for serialization
            return { 
                id: docSnap.id, 
                ...data,
                createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
            } as App;
        }
    } catch (error) {
        console.error("Error fetching app details for SSR:", error);
    }
    return null;
}

export default async function AppPage({ params }: { params: { id: string } }) {
  const initialApp = await getAppDetails(params.id);

  if (!initialApp) {
    notFound();
  }

  return <AppDetailClient initialApp={initialApp} appId={params.id} />;
}


// This function now correctly runs in a Server Component
export async function generateMetadata({ params }: { params: { id: string }}) {
    const app = await getAppDetails(params.id);

    if (!app) {
        return {
            title: "App Not Found",
        }
    }

    return {
        title: `${app.name} | App Showcase`,
        description: app.description,
    }
}
