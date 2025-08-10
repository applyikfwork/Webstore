
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { notFound } from "next/navigation";
import { AppDetailClient } from "@/components/app-detail-client";
import type { Metadata } from "next";

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

const mapTagToCategory = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return "SoftwareApplication";
    const lowerCaseTags = tags.map(t => t.toLowerCase());
    if (lowerCaseTags.includes("game")) return "GameApplication";
    if (lowerCaseTags.includes("business")) return "BusinessApplication";
    if (lowerCaseTags.includes("productivity")) return "ProductivityApplication";
    if (lowerCaseTags.includes("social")) return "SocialNetworkingApplication";
    if (lowerCaseTags.includes("travel")) return "TravelApplication";
    return "SoftwareApplication"; // Default
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const app = await getAppDetails(params.id);

    if (!app) {
        return {
            title: "App Not Found",
        }
    }

    return {
        title: `${app.name} | MyAppStore`,
        description: app.metaDescription || app.description,
        keywords: app.metaKeywords || app.tags?.join(', '),
    }
}

export default async function AppPage({ params }: { params: { id: string } }) {
  const initialApp = await getAppDetails(params.id);

  if (!initialApp) {
    notFound();
  }

  // Basic structured data for SEO.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": initialApp.name,
    "description": initialApp.description,
    "operatingSystem": "ANDROID", // Assuming Android, can be made dynamic if needed
    "applicationCategory": mapTagToCategory(initialApp.tags),
    "screenshot": initialApp.screenshots?.map(s => s) || [],
    "image": initialApp.iconUrl,
    "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
    },
    ...(initialApp.version && { "softwareVersion": initialApp.version }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AppDetailClient initialApp={initialApp} appId={params.id} />
    </>
  );
}
