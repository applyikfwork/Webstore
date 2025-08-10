"use client";

import type { App } from "@/lib/types";
import { AppCard } from "@/components/app-card";

interface HomeClientProps {
  apps: App[];
}

export function HomeClient({ apps }: HomeClientProps) {
  return (
    <>
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
