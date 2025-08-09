"use client";

import { useState } from "react";
import type { App } from "@/lib/types";
import { AppsTable } from "@/components/admin/apps-table";
import { AppForm } from "@/components/admin/app-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { PlusCircle } from "lucide-react";

export default function AdminPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingApp, setEditingApp] = useState<App | null>(null);

    const handleEdit = (app: App) => {
        setEditingApp(app);
        setIsFormOpen(true);
    };

    const handleAddNew = () => {
        setEditingApp(null);
        setIsFormOpen(true);
    };
    
    const onFormClose = () => {
        setIsFormOpen(false);
        setEditingApp(null);
    }

    return (
        <div className="min-h-screen">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                    <Button onClick={handleAddNew}>
                        <PlusCircle className="mr-2 h-4 w-4"/>
                        Add New App
                    </Button>
                </div>

                <Dialog open={isFormOpen} onOpenChange={(open) => {
                    if (!open) {
                        onFormClose();
                    } else {
                        setIsFormOpen(true);
                    }
                }}>
                    <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingApp ? "Edit App" : "Add New App"}</DialogTitle>
                        </DialogHeader>
                        <AppForm
                            initialData={editingApp}
                            onFinished={onFormClose}
                        />
                    </DialogContent>
                </Dialog>

                <AppsTable onEdit={handleEdit} />
            </main>
        </div>
    );
}
