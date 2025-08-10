
"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

interface AppsTableProps {
    onEdit: (app: App) => void;
}

export function AppsTable({ onEdit }: AppsTableProps) {
    const [apps, setApps] = useState<App[]>([]);
    const [loading, setLoading] = useState(true);
    const [appToDelete, setAppToDelete] = useState<App | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "apps"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const appsData = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return { 
                    id: doc.id, 
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString()
                } as App
            });
            setApps(appsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching apps:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to fetch app data.",
            });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleDelete = async () => {
        if (!appToDelete || !appToDelete.id) return;
        
        try {
            await deleteDoc(doc(db, "apps", appToDelete.id));
            toast({
                title: "Success",
                description: `"${appToDelete.name}" has been deleted.`,
            });
        } catch (error) {
            console.error("Error deleting app:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete the app.",
            });
        } finally {
            setAppToDelete(null);
        }
    };

    const getAppType = (app: App) => {
        if (app.websiteUrl && app.apkUrl) return "Website & APK";
        if (app.websiteUrl) return "Website";
        if (app.apkUrl) return "APK";
        return "N/A";
    }

    if (loading) {
        return (
            <div className="rounded-md border">
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] hidden sm:table-cell">Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                             <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                            <TableCell className="hidden sm:table-cell"><Skeleton className="h-12 w-12 rounded-lg"/></TableCell>
                            <TableCell><Skeleton className="h-4 w-[200px]"/></TableCell>
                            <TableCell><Skeleton className="h-6 w-[120px] rounded-full"/></TableCell>
                            <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto rounded-md"/></TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    return (
        <AlertDialog open={!!appToDelete} onOpenChange={(open) => !open && setAppToDelete(null)}>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px] hidden sm:table-cell">Icon</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead className="hidden md:table-cell">Type</TableHead>
                            <TableHead className="hidden lg:table-cell">Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {apps.map((app) => (
                            <TableRow key={app.id}>
                                <TableCell className="hidden sm:table-cell">
                                    <Image src={app.iconUrl} alt={app.name} width={48} height={48} className="rounded-md object-cover border"/>
                                </TableCell>
                                <TableCell className="font-medium">{app.name}</TableCell>
                                <TableCell className="hidden md:table-cell"><Badge variant="secondary" className="capitalize">{getAppType(app)}</Badge></TableCell>
                                <TableCell className="hidden lg:table-cell text-muted-foreground">
                                    {app.createdAt ? new Date(app.createdAt.toString()).toLocaleDateString() : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onEdit(app)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setAppToDelete(app)} className="text-destructive focus:text-destructive">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete "{appToDelete?.name}" and remove its data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

    