"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (user.email !== 'xyzapplywork@gmail.com') {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading || !user || user.email !== 'xyzapplywork@gmail.com') {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-muted-foreground">Verifying access...</p>
        </div>
    );
  }

  return <>{children}</>;
}
