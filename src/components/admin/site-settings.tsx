
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save } from "lucide-react";
import Image from "next/image";
import type { SiteSettingsData } from "@/lib/types";
import { Switch } from "../ui/switch";


const SiteSettingsSchema = z.object({
  iconUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tagline: z.string().optional(),
  loginEnabled: z.boolean().default(true),
});

type SiteSettingsFormValues = z.infer<typeof SiteSettingsSchema>;

export function SiteSettings() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentIconUrl, setCurrentIconUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const form = useForm<SiteSettingsFormValues>({
        resolver: zodResolver(SiteSettingsSchema),
        defaultValues: {
            iconUrl: "",
            tagline: "",
            loginEnabled: true,
        }
    });

    useEffect(() => {
        const fetchSettings = async () => {
            setLoading(true);
            const docRef = doc(db, "settings", "site");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const settings = docSnap.data() as SiteSettingsData;
                setCurrentIconUrl(settings.iconUrl || null);
                form.setValue("iconUrl", settings.iconUrl || "");
                form.setValue("tagline", settings.tagline || "");
                form.setValue("loginEnabled", settings.loginEnabled === undefined ? true : settings.loginEnabled);
            }
            setLoading(false);
        };
        fetchSettings();
    }, [form]);


    async function onSubmit(data: SiteSettingsFormValues) {
        setIsSubmitting(true);
        try {
            await setDoc(doc(db, "settings", "site"), { 
                iconUrl: data.iconUrl,
                tagline: data.tagline,
                loginEnabled: data.loginEnabled,
            }, { merge: true });
            
            if(data.iconUrl) setCurrentIconUrl(data.iconUrl);
            
            toast({ title: "Success", description: "Site settings updated successfully." });
        } catch (error) {
            console.error("Form submission error", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to update site settings." });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Site Settings</CardTitle>
            </CardHeader>
            <CardContent>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="flex items-end gap-4">
                             {loading ? (
                                <Loader2 className="h-16 w-16 animate-spin text-muted-foreground" />
                            ) : currentIconUrl && (
                                <div className="space-y-2">
                                    <FormLabel>Current Icon</FormLabel>
                                    <Image src={currentIconUrl} alt="Current Site Icon" width={64} height={64} className="rounded-lg border object-cover" />
                                </div>
                            )}
                            <div className="flex-1">
                                <FormField control={form.control} name="iconUrl" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Site Icon URL</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://example.com/icon.png" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                        </div>

                        <FormField control={form.control} name="tagline" render={({ field }) => (
                            <FormItem>
                                <FormLabel>Site Tagline</FormLabel>
                                <FormControl>
                                    <Input placeholder="Secure, Fast, No Bloat." {...field} />
                                </FormControl>
                                <FormDescription>A short, catchy phrase for your site header.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                        <FormField
                            control={form.control}
                            name="loginEnabled"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                    <FormLabel>Enable User Login</FormLabel>
                                    <FormDescription>
                                    Allow users to log in to the admin panel.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isSubmitting || loading}>
                                {isSubmitting ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="mr-2 h-4 w-4" />
                                )}
                                Save Settings
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
