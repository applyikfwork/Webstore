
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import type { AdSettingsData } from "@/lib/types";


const AdSettingsSchema = z.object({
  homePageAdCode: z.string().optional(),
  appDetailPageAdCode: z.string().optional(),
});

type AdSettingsFormValues = z.infer<typeof AdSettingsSchema>;

export function AdSettings() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    const form = useForm<AdSettingsFormValues>({
        resolver: zodResolver(AdSettingsSchema),
        defaultValues: {
            homePageAdCode: "",
            appDetailPageAdCode: "",
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const docRef = doc(db, "settings", "ads");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const settings = docSnap.data() as AdSettingsData;
                form.setValue("homePageAdCode", settings.homePageAdCode || "");
                form.setValue("appDetailPageAdCode", settings.appDetailPageAdCode || "");
            }
            setLoading(false);
        };
        fetchSettings();
    }, [form]);


    async function onSubmit(data: AdSettingsFormValues) {
        setIsSubmitting(true);
        try {
            await setDoc(doc(db, "settings", "ads"), { 
                homePageAdCode: data.homePageAdCode,
                appDetailPageAdCode: data.appDetailPageAdCode 
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
                <CardDescription>Manage the ad codes for different sections of your website. Paste the HTML/JS code from Adsterra or another provider.</CardDescription>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        
                        <FormField control={form.control} name="homePageAdCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Home Page Ad</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Paste ad code for the home page..." {...field} className="min-h-[120px] font-mono text-xs" />
                                </FormControl>
                                <FormDescription>This ad will be displayed on the main app listing page.</FormDescription>
                                <div className="p-4 border-dashed border-2 rounded-lg mt-2 text-center text-muted-foreground bg-muted/50">
                                    <p className="font-semibold">Ad Preview Area</p>
                                    <p className="text-sm">Your ad will be rendered here (e.g., 728x90)</p>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )} />

                         <FormField control={form.control} name="appDetailPageAdCode" render={({ field }) => (
                            <FormItem>
                                <FormLabel>App Detail Page Ad</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Paste ad code for app detail pages..." {...field} className="min-h-[120px] font-mono text-xs" />
                                </FormControl>
                                <FormDescription>This ad will be displayed on each individual app's page.</FormDescription>
                                 <div className="p-4 border-dashed border-2 rounded-lg mt-2 text-center text-muted-foreground bg-muted/50">
                                    <p className="font-semibold">Ad Preview Area</p>
                                    <p className="text-sm">Your ad will be rendered here (e.g., 300x250)</p>
                                </div>
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
