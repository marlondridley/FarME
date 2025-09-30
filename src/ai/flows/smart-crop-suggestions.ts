'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing smart crop suggestions to farmers.
 *
 * The flow considers weather patterns, time of year, trending customer preferences, and geographic area to suggest optimal crop planning.
 *
 * @remarks
 *   - smartCropSuggestions - The function that initiates the crop suggestion flow.
 *   - SmartCropSuggestionsInput - The input type for the smartCropSuggestions function.
 *   - SmartCropSuggestionsOutput - The return type for the smartCropSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartCropSuggestionsInputSchema = z.object({
  weatherPatterns: z
    .string()
    .describe('Description of recent and predicted weather patterns in the area.'),
  timeOfYear: z
    .string()
    .describe('The current time of year (e.g., Spring, Summer, Fall, Winter).'),
  trendingPreferences: z
    .string()
    .describe('A description of trending customer preferences for local produce.'),
  geographicArea: z
    .string()
    .describe('The geographic area or region where the farm is located.'),
  farmHistory: z
    .string()
    .optional()
    .describe(
      'Optional: A description of the farm history, including past crops and yields.'
    ),
});
export type SmartCropSuggestionsInput = z.infer<
  typeof SmartCropSuggestionsInputSchema
>;

const SmartCropSuggestionsOutputSchema = z.object({
  suggestedCrops: z
    .string()
    .describe(
      'A list of suggested crops to plant, considering the input factors.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why these crops are suggested, referencing the input factors.'
    ),
});
export type SmartCropSuggestionsOutput = z.infer<
  typeof SmartCropSuggestionsOutputSchema
>;

export async function smartCropSuggestions(
  input: SmartCropSuggestionsInput
): Promise<SmartCropSuggestionsOutput> {
  return smartCropSuggestionsFlow(input);
}

const smartCropSuggestionsPrompt = ai.definePrompt({
  name: 'smartCropSuggestionsPrompt',
  input: {schema: SmartCropSuggestionsInputSchema},
  output: {schema: SmartCropSuggestionsOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the following information, provide a list of suggested crops for the farmer to plant and a brief explanation of your reasoning.

Weather Patterns: {{{weatherPatterns}}}
Time of Year: {{{timeOfYear}}}
Trending Customer Preferences: {{{trendingPreferences}}}
Geographic Area: {{{geographicArea}}}
Farm History (if available): {{{farmHistory}}}

Consider all factors to provide the best possible recommendations.
`,
});

const smartCropSuggestionsFlow = ai.defineFlow(
  {
    name: 'smartCropSuggestionsFlow',
    inputSchema: SmartCropSuggestionsInputSchema,
    outputSchema: SmartCropSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await smartCropSuggestionsPrompt(input);
    return output!;
  }
);
