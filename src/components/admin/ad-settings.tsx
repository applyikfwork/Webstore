
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import type { AdSettingsData } from "@/lib/types";


const AdSettingsSchema = z.object({
  homePageAdKey: z.string().optional(),
  appDetailPageAdKey: z.string().optional(),
});

type AdSettingsFormValues = z.infer<typeof AdSettingsSchema>;

export function AdSettings() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const form = useForm<AdSettingsFormValues>({
        resolver: zodResolver(AdSettingsSchema),
        defaultValues: {
            homePageAdKey: "",
            appDetailPageAdKey: "",
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const docRef = doc(db, "settings", "ads");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const settings = docSnap.data() as AdSettingsData;
                form.setValue("homePageAdKey", settings.homePageAdKey || "");
                form.setValue("appDetailPageAdKey", settings.appDetailPageAdKey || "");
            }
            setLoading(false);
        };
        fetchSettings();
    }, [form]);


    async function onSubmit(data: AdSettingsFormValues) {
        setIsSubmitting(true);
        try {
            await setDoc(doc(db, "settings", "ads"), { 
                homePageAdKey: data.homePageAdKey,
                appDetailPageAdKey: data.appDetailPageAdKey 
            }, { merge: true });
            
            toast({ title: "Success", description: "Ad settings updated successfully." });
        } catch (error) {
            console.error("Form submission error", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update ad settings." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Advertisement Settings</CardTitle>
                <CardDescription>Manage the ad keys for different sections of your website. Paste the key from Adsterra.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <FormField control={form.control} name="homePageAdKey" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Home Page Ad Key</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., e25102b7dcf781e429599a169bfcf76e" {...field} className="font-mono text-xs" />
                                </FormControl>
                                <FormDescription>This ad will be displayed on the main app listing page.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                         <FormField control={form.control} name="appDetailPageAdKey" render={({ field }) => (
                            <FormItem>
                                <FormLabel>App Detail Page Ad Key</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., e25102b7dcf781e429599a169bfcf76e" {...field} className="font-mono text-xs" />
                                </FormControl>
                                <FormDescription>This ad will be displayed on each individual app's page.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting || loading}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Ad Settings
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
