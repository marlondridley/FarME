'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating recipe suggestions based on a list of produce.
 *
 * - getRecipeSuggestions - The function that initiates the recipe suggestion flow.
 * - GetRecipeSuggestionsInput - The input type for the getRecipeSuggestions function.
 * - GetRecipeSuggestionsOutput - The return type for the getRecipeSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRecipeSuggestionsInputSchema = z.object({
  produce: z
    .string()
    .describe('A list of produce items to generate recipes for.'),
});
export type GetRecipeSuggestionsInput = z.infer<
  typeof GetRecipeSuggestionsInputSchema
>;

const GetRecipeSuggestionsOutputSchema = z.object({
  recipes: z
    .string()
    .describe(
      'A list of 2-3 simple recipe ideas using the provided produce, formatted for easy reading.'
    ),
});
export type GetRecipeSuggestionsOutput = z.infer<
  typeof GetRecipeSuggestionsOutputSchema
>;

export async function getRecipeSuggestions(
  input: GetRecipeSuggestionsInput
): Promise<GetRecipeSuggestionsOutput> {
  return getRecipeSuggestionsFlow(input);
}

const getRecipeSuggestionsPrompt = ai.definePrompt({
  name: 'getRecipeSuggestionsPrompt',
  input: {schema: GetRecipeSuggestionsInputSchema},
  output: {schema: GetRecipeSuggestionsOutputSchema},
  prompt: `You are a creative chef who specializes in simple, delicious recipes using fresh, seasonal ingredients.

A user has the following produce available:
{{{produce}}}

Suggest 2-3 simple and appealing recipe ideas that feature these ingredients. The recipes should be easy to follow for a home cook. For each recipe, provide a name and a brief, enticing description. Do not provide a full ingredient list or step-by-step instructions.
`,
});

const getRecipeSuggestionsFlow = ai.defineFlow(
  {
    name: 'getRecipeSuggestionsFlow',
    inputSchema: GetRecipeSuggestionsInputSchema,
    outputSchema: GetRecipeSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await getRecipeSuggestionsPrompt(input);
    return output!;
  }
);
