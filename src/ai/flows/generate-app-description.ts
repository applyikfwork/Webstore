'use server';

/**
 * @fileOverview An AI agent for generating app descriptions and feature highlights.
 *
 * - generateAppDescription - A function that generates app descriptions and feature highlights.
 * - GenerateAppDescriptionInput - The input type for the generateAppDescription function.
 * - GenerateAppDescriptionOutput - The return type for the generateAppDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAppDescriptionInputSchema = z.object({
  appName: z.string().describe('The name of the app.'),
  appDetails: z.string().describe('Detailed information about the app, including its features and functionality.'),
});
export type GenerateAppDescriptionInput = z.infer<typeof GenerateAppDescriptionInputSchema>;

const GenerateAppDescriptionOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging description of the app.'),
  featureHighlights: z.string().describe('A list of key features and highlights of the app.'),
});
export type GenerateAppDescriptionOutput = z.infer<typeof GenerateAppDescriptionOutputSchema>;

export async function generateAppDescription(input: GenerateAppDescriptionInput): Promise<GenerateAppDescriptionOutput> {
  return generateAppDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAppDescriptionPrompt',
  input: {schema: GenerateAppDescriptionInputSchema},
  output: {schema: GenerateAppDescriptionOutputSchema},
  prompt: `You are an AI assistant specialized in generating engaging and informative app descriptions and feature highlights.

  Based on the provided app name and details, create a compelling description and a list of key feature highlights.

  App Name: {{{appName}}}
  App Details: {{{appDetails}}}

  Description:
  Feature Highlights:`, // Ensure the prompt produces both description and feature highlights.
});

const generateAppDescriptionFlow = ai.defineFlow(
  {
    name: 'generateAppDescriptionFlow',
    inputSchema: GenerateAppDescriptionInputSchema,
    outputSchema: GenerateAppDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
