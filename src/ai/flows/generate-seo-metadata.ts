'use server';

/**
 * @fileOverview An AI agent for generating SEO-optimized metadata.
 *
 * - generateSeoMetadata - A function that generates a meta description and keywords.
 * - GenerateSeoMetadataInput - The input type for the function.
 * - GenerateSeoMetadataOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSeoMetadataInputSchema = z.object({
  appName: z.string().describe('The name of the app.'),
  appDescription: z.string().describe('The detailed description of the app.'),
});
export type GenerateSeoMetadataInput = z.infer<typeof GenerateSeoMetadataInputSchema>;

const GenerateSeoMetadataOutputSchema = z.object({
  metaDescription: z.string().describe('A concise, SEO-friendly meta description (max 160 characters).'),
  metaKeywords: z.string().describe('A comma-separated string of relevant SEO keywords.'),
});
export type GenerateSeoMetadataOutput = z.infer<typeof GenerateSeoMetadataOutputSchema>;

export async function generateSeoMetadata(input: GenerateSeoMetadataInput): Promise<GenerateSeoMetadataOutput> {
  return generateSeoMetadataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateSeoMetadataPrompt',
  input: {schema: GenerateSeoMetadataInputSchema},
  output: {schema: GenerateSeoMetadataOutputSchema},
  prompt: `You are an SEO expert specializing in the mobile app market. Your task is to generate optimized metadata for an app store listing.

  Based on the app's name and description, create:
  1. A compelling meta description (under 160 characters) that includes strong keywords and a call-to-action.
  2. A comma-separated list of 5-7 highly relevant SEO keywords that a user might search for to find this app.

  App Name: {{{appName}}}
  App Description: {{{appDescription}}}

  Generate the meta description and keywords.`,
});

const generateSeoMetadataFlow = ai.defineFlow(
  {
    name: 'generateSeoMetadataFlow',
    inputSchema: GenerateSeoMetadataInputSchema,
    outputSchema: GenerateSeoMetadataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
