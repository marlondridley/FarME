
'use server';

/**
 * @fileOverview A Genkit flow that converts a zip code into latitude and longitude coordinates.
 *
 * - geocode - The function that initiates the geocoding flow.
 * - GeocodeInput - The input type for the geocode function.
 * - GeocodeOutput - The return type for the geocode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeocodeInputSchema = z.object({
  zipCode: z.string().describe('The zip code to convert to coordinates.'),
});
export type GeocodeInput = z.infer<typeof GeocodeInputSchema>;

const GeocodeOutputSchema = z.object({
  latitude: z.number().optional().describe('The latitude of the zip code.'),
  longitude: z.number().optional().describe('The longitude of the zip code.'),
});
export type GeocodeOutput = z.infer<typeof GeocodeOutputSchema>;

export async function geocode(input: GeocodeInput): Promise<GeocodeOutput> {
  return geocodeFlow(input);
}

const geocodePrompt = ai.definePrompt({
  name: 'geocodePrompt',
  input: {schema: GeocodeInputSchema},
  output: {schema: GeocodeOutputSchema},
  prompt: `You are a geocoding expert. Given the following zip code, provide the corresponding latitude and longitude.

Zip Code: {{{zipCode}}}

Only return the numerical latitude and longitude.
`,
});

const geocodeFlow = ai.defineFlow(
  {
    name: 'geocodeFlow',
    inputSchema: GeocodeInputSchema,
    outputSchema: GeocodeOutputSchema,
  },
  async input => {
    const {output} = await geocodePrompt(input);
    return output!;
  }
);
