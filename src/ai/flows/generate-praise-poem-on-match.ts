'use server';
/**
 * @fileOverview A Genkit flow for generating a 'Nhetembo' (Praise Poem) based on matched animal totems.
 *
 * - generatePraisePoemOnMatch - A function that handles the generation of the praise poem.
 * - GeneratePraisePoemOnMatchInput - The input type for the generatePraisePoemOnMatch function.
 * - GeneratePraisePoemOnMatchOutput - The return type for the generatePraisePoemOnMatch function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePraisePoemOnMatchInputSchema = z.object({
  animalTotemName: z
    .string()
    .describe("The name of the animal totem for which to generate a Nhetembo (Praise Poem)."),
});
export type GeneratePraisePoemOnMatchInput = z.infer<typeof GeneratePraisePoemOnMatchInputSchema>;

const GeneratePraisePoemOnMatchOutputSchema = z.object({
  nhetemboPoem: z.string().describe("The generated Nhetembo (Praise Poem)."),
});
export type GeneratePraisePoemOnMatchOutput = z.infer<typeof GeneratePraisePoemOnMatchOutputSchema>;

export async function generatePraisePoemOnMatch(
  input: GeneratePraisePoemOnMatchInput
): Promise<GeneratePraisePoemOnMatchOutput> {
  return generatePraisePoemOnMatchFlow(input);
}

const praisePoemPrompt = ai.definePrompt({
  name: 'generatePraisePoemPrompt',
  input: { schema: GeneratePraisePoemOnMatchInputSchema },
  output: { schema: GeneratePraisePoemOnMatchOutputSchema },
  prompt: `You are a wise griot, a storyteller and praise singer, specializing in traditional African 'Nhetembo' (Praise Poems).

Generate a short, evocative praise poem (Nhetembo) in a few concise stanzas for the animal totem named: {{{animalTotemName}}}.
Focus on the animal's characteristics, strengths, beauty, and its significance within nature and Zimbabwean culture.
Make it inspiring and celebratory.

Here is an example structure:

Oh, Lion, King of the Savanna,
Your roar shakes the earth,
Your courage, unmatched.

Strong is your heart,
Graceful your stride,
Protector of your pride.

Let the praise poem be for the {{{animalTotemName}}} totem.`,
});

const generatePraisePoemOnMatchFlow = ai.defineFlow(
  {
    name: 'generatePraisePoemOnMatchFlow',
    inputSchema: GeneratePraisePoemOnMatchInputSchema,
    outputSchema: GeneratePraisePoemOnMatchOutputSchema,
  },
  async (input) => {
    const { output } = await praisePoemPrompt(input);
    return output!;
  }
);
