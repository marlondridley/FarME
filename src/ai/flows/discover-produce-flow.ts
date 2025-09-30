'use server';

/**
 * @fileOverview This file defines a Genkit flow for providing produce discovery suggestions to consumers.
 *
 * The flow considers the time of year, geographic area, and user preferences to suggest seasonal products to try.
 *
 * - discoverProduce - The function that initiates the produce discovery flow.
 * - DiscoverProduceInput - The input type for the discoverProduce function.
 * - DiscoverProduceOutput - The return type for the discoverProduce function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiscoverProduceInputSchema = z.object({
  timeOfYear: z
    .string()
    .describe('The current time of year (e.g., Spring, Summer, Fall, Winter).'),
  geographicArea: z
    .string()
    .describe('The geographic area or region where the user is located.'),
  tastePreferences: z
    .string()
    .describe(
      'A description of the user\'s taste preferences (e.g., "I like sweet fruits and spicy vegetables.").'
    ),
  cookingHabits: z
    .string()
    .optional()
    .describe(
      'Optional: A description of the user\'s cooking habits (e.g., "I mostly make salads and smoothies, but I like to grill on weekends.").'
    ),
});
export type DiscoverProduceInput = z.infer<typeof DiscoverProduceInputSchema>;

const DiscoverProduceOutputSchema = z.object({
  suggestedProducts: z
    .string()
    .describe(
      'A list of 3-5 suggested produce items to look for at local farms and markets.'
    ),
  reasoning: z
    .string()
    .describe(
      'Explanation of why these products are suggested, referencing seasonality, location, and user preferences.'
    ),
});
export type DiscoverProduceOutput = z.infer<
  typeof DiscoverProduceOutputSchema
>;

export async function discoverProduce(
  input: DiscoverProduceInput
): Promise<DiscoverProduceOutput> {
  return discoverProduceFlow(input);
}

const discoverProducePrompt = ai.definePrompt({
  name: 'discoverProducePrompt',
  input: {schema: DiscoverProduceInputSchema},
  output: {schema: DiscoverProduceOutputSchema},
  prompt: `You are a helpful assistant for a farm-to-table app. Your goal is to help users discover new and interesting local produce.

Based on the following user preferences, suggest 3-5 seasonal products they should look for at their local farms or markets.

Time of Year: {{{timeOfYear}}}
Geographic Area: {{{geographicArea}}}
User's Taste Preferences: {{{tastePreferences}}}
User's Cooking Habits: {{{cookingHabits}}}

Your suggestions should be tailored to what is likely to be fresh and available in their area at this time of year. Provide a friendly and engaging response.
`,
});

const discoverProduceFlow = ai.defineFlow(
  {
    name: 'discoverProduceFlow',
    inputSchema: DiscoverProduceInputSchema,
    outputSchema: DiscoverProduceOutputSchema,
  },
  async input => {
    const {output} = await discoverProducePrompt(input);
    return output!;
  }
);
