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
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { Wand2, Loader2 } from "lucide-react";
import { generateAppDescription } from "@/ai/flows/generate-app-description";
import { uploadToCloudinary } from "@/lib/cloudinary";


const AppFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  type: z.enum(["website", "apk"], { required_error: "You need to select an app type." }),
  websiteUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  appDetails: z.string().min(10, "Details must be at least 10 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  featureHighlights: z.string().min(10, "Feature highlights must be at least 10 characters."),
  icon: z.any().optional(),
  apk: z.any().optional(),
}).refine(data => data.type === 'website' ? (data.websiteUrl && data.websiteUrl.length > 0) : true, {
  message: "Website URL is required.",
  path: ["websiteUrl"],
});


type AppFormValues = z.infer<typeof AppFormSchema>;

interface AppFormProps {
    initialData?: App | null;
    onFinished: () => void;
}

export function AppForm({ initialData, onFinished }: AppFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    
    const form = useForm<AppFormValues>({
        resolver: zodResolver(AppFormSchema),
        defaultValues: initialData ? { ...initialData, icon: undefined, apk: undefined } : {
            name: "",
            type: "website",
            websiteUrl: "",
            appDetails: "",
            description: "",
            featureHighlights: "",
        },
    });

    const handleGenerateDescription = async () => {
        const appName = form.getValues("name");
        const appDetails = form.getValues("appDetails");
        if (!appName || !appDetails) {
            toast({ variant: "destructive", title: "Missing Info", description: "Please enter an App Name and App Details first." });
            return;
        }
        setIsGenerating(true);
        try {
            const result = await generateAppDescription({ appName, appDetails });
            form.setValue("description", result.description, { shouldValidate: true });
            form.setValue("featureHighlights", result.featureHighlights, { shouldValidate: true });
            toast({ title: "Content Generated", description: "AI-powered content has been added to the form." });
        } catch (error) {
            console.error("AI generation failed", error);
            toast({ variant: "destructive", title: "AI Error", description: "Failed to generate description." });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleFileUpload = async (file: File, resourceType: 'image' | 'raw' | 'video' | 'auto') => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const result = await uploadToCloudinary(formData, resourceType);
            return result.secure_url;
        } catch (error: any) {
            console.error("Upload error:", error.message);
            toast({
                variant: 'destructive',
                title: 'Upload Failed',
                description: error.message || 'An unknown error occurred during file upload.'
            });
            return null;
        }
    };

    async function onSubmit(data: AppFormValues) {
        setIsSubmitting(true);
        try {
            if (!initialData && (!data.icon || data.icon.length === 0)) {
                toast({ variant: 'destructive', title: 'Error', description: 'App Icon is required.' });
                setIsSubmitting(false);
                return;
            }
            if (data.type === 'apk' && !initialData?.apkUrl && (!data.apk || data.apk.length === 0)) {
                toast({ variant: 'destructive', title: 'Error', description: 'APK file is required for new APK app type.' });
                setIsSubmitting(false);
                return;
            }

            let iconUrl = initialData?.iconUrl;
            if (data.icon && data.icon[0]) {
                iconUrl = await handleFileUpload(data.icon[0], 'auto');
                if (!iconUrl) {
                    setIsSubmitting(false);
                    return;
                }
            }

            let apkUrl = initialData?.apkUrl;
            if (data.type === 'apk' && data.apk && data.apk[0]) {
                 apkUrl = await handleFileUpload(data.apk[0], 'raw');
                 if (!apkUrl) {
                    setIsSubmitting(false);
                    return;
                }
            }


            const appPayload: Omit<App, 'id' | 'createdAt'> & { createdAt?: any } = {
                name: data.name,
                type: data.type,
                websiteUrl: data.type === 'website' ? data.websiteUrl : '',
                apkUrl: data.type === 'apk' ? apkUrl : '',
                iconUrl: iconUrl!,
                description: data.description,
                featureHighlights: data.featureHighlights,
            };

            if (initialData?.id) {
                await updateDoc(doc(db, "apps", initialData.id), appPayload);
                toast({ title: "Success", description: "App updated successfully." });
            } else {
                appPayload.createdAt = serverTimestamp();
                await addDoc(collection(db, "apps"), appPayload);
                toast({ title: "Success", description: "App added successfully." });
            }
            onFinished();
        } catch (error) {
            console.error("Form submission error", error);
            toast({ variant: "destructive", title: "Error", description: "Failed to save the app." });
        } finally {
            setIsSubmitting(false);
        }
    }

    const appType = form.watch("type");
    const iconFileRef = form.register("icon");
    const apkFileRef = form.register("apk");

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>App Name</FormLabel><FormControl><Input placeholder="My Awesome App" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem className="space-y-3"><FormLabel>App Type</FormLabel><FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="website" /></FormControl><FormLabel className="font-normal">Website</FormLabel></FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value="apk" /></FormControl><FormLabel className="font-normal">APK</FormLabel></FormItem>
                        </RadioGroup>
                    </FormControl><FormMessage /></FormItem>
                )} />

                {appType === 'website' && <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                    <FormItem><FormLabel>Website URL</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />}
                
                {appType === 'apk' && <FormField control={form.control} name="apk" render={() => (
                    <FormItem><FormLabel>APK File</FormLabel><FormControl><Input type="file" accept=".apk" {...apkFileRef} /></FormControl><FormDescription>{initialData?.apkUrl ? "Leave blank to keep existing file." : ""}</FormDescription><FormMessage /></FormItem>
                )} />}

                <FormField control={form.control} name="icon" render={() => (
                    <FormItem><FormLabel>App Icon</FormLabel><FormControl><Input type="file" accept="image/png, image/jpeg" {...iconFileRef} /></FormControl><FormDescription>{initialData?.iconUrl ? "Leave blank to keep existing icon." : ""}</FormDescription><FormMessage /></FormItem>
                )} />

                <div className="relative">
                    <FormField control={form.control} name="appDetails" render={({ field }) => (
                        <FormItem><FormLabel>App Details for AI</FormLabel><FormControl><Textarea placeholder="Describe what your app does, its main features, target audience, etc." className="resize-y min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                     <Button type="button" size="sm" variant="outline" className="absolute top-0 right-0" onClick={handleGenerateDescription} disabled={isGenerating}>
                        {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4 text-accent" />}
                        Generate
                    </Button>
                </div>
                
                <FormField control={form.control} name="description" render={({ field }) => (
                    <FormItem><FormLabel>Public Description</FormLabel><FormControl><Textarea placeholder="AI-generated description will appear here..." className="resize-y min-h-[100px]" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="featureHighlights" render={({ field }) => (
                    <FormItem><FormLabel>Public Feature Highlights</FormLabel><FormControl><Textarea placeholder="AI-generated feature list will appear here..." className="resize-y" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="ghost" onClick={onFinished}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Save Changes" : "Add App"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
