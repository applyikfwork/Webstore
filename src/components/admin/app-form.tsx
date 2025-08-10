
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
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, storage } from "@/lib/firebase";
import type { App } from "@/lib/types";
import { Wand2, Loader2, Upload } from "lucide-react";
import { generateAppDescription } from "@/ai/flows/generate-app-description";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Progress } from "@/components/ui/progress";


const AppFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  websiteUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  apkFile: z.any().optional(),
  apkUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  iconUrl: z.string().url("Please enter a valid URL for the icon."),
  appDetails: z.string().min(10, "Details must be at least 10 characters."),
  description: z.string().min(10, "Description must be at least 10 characters."),
  featureHighlights: z.string().min(10, "Feature highlights must be at least 10 characters."),
}).refine(data => data.websiteUrl || data.apkUrl || (data.apkFile && data.apkFile.length > 0), {
  message: "Either a Website URL, an existing APK URL, or a new APK file is required.",
  path: ["websiteUrl"], // You can adjust the path to where the error message should appear.
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
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    
    const form = useForm<AppFormValues>({
        resolver: zodResolver(AppFormSchema),
        defaultValues: initialData ? {
            ...initialData,
            apkFile: undefined,
        } : {
            name: "",
            websiteUrl: "",
            apkUrl: "",
            apkFile: undefined,
            iconUrl: "",
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

    const uploadApk = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const storageRef = ref(storage, `apks/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Upload failed:", error);
            reject(error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    }

    async function onSubmit(data: AppFormValues) {
        setIsSubmitting(true);
        setUploadProgress(null);

        try {
            let apkUrl = data.apkUrl;
            const apkFile = data.apkFile?.[0];

            if (apkFile) {
                 if (apkFile.type !== 'application/vnd.android.package-archive') {
                    toast({
                        variant: "destructive",
                        title: "Invalid File Type",
                        description: "Please upload a valid .apk file.",
                    });
                    setIsSubmitting(false);
                    return;
                }
                toast({ title: "Uploading APK...", description: "Please wait for the file to upload." });
                apkUrl = await uploadApk(apkFile);
                setUploadProgress(100);
            }

            const appPayload: Omit<App, 'id' | 'createdAt'> & { createdAt?: any } = {
                name: data.name,
                websiteUrl: data.websiteUrl,
                apkUrl: apkUrl,
                iconUrl: data.iconUrl,
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
            setUploadProgress(null);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>App Name</FormLabel><FormControl><Input placeholder="My Awesome App" {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="websiteUrl" render={({ field }) => (
                    <FormItem><FormLabel>Website URL (Optional)</FormLabel><FormControl><Input placeholder="https://example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                
                <FormField
                  control={form.control}
                  name="apkFile"
                  render={({ field: { value, onChange, ...fieldProps } }) => (
                    <FormItem>
                      <FormLabel>APK File (Optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                            <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                            {...fieldProps}
                            placeholder="Upload APK"
                            type="file"
                            accept=".apk"
                            onChange={(event) => onChange(event.target.files)}
                            className="pl-9"
                            />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {initialData?.apkUrl ? "Uploading a new file will replace the existing one." : "Upload the .apk file for your app."}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {uploadProgress !== null && (
                    <Progress value={uploadProgress} className="w-full" />
                )}

                <FormField control={form.control} name="iconUrl" render={({ field }) => (
                    <FormItem><FormLabel>App Icon URL</FormLabel><FormControl><Input placeholder="https://example.com/icon.png" {...field} /></FormControl><FormMessage /></FormItem>
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
                    <Button type="button" variant="ghost" onClick={onFinished} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {initialData ? "Save Changes" : "Add App"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
