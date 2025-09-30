'use server';

/**
 * @fileOverview This file defines a Genkit flow for processing a customer's order and generating a notification for the farmer.
 *
 * - processOrder - The function that initiates the order processing flow.
 * - ProcessOrderInput - The input type for the processOrder function.
 * - ProcessOrderOutput - The return type for the processOrder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessOrderInputSchema = z.object({
  farmName: z.string().describe('The name of the farm receiving the order.'),
  productName: z.string().describe('The name of the product being ordered.'),
  quantity: z.number().describe('The quantity of the product being ordered.'),
  total: z.number().describe('The total cost of the order.'),
});
export type ProcessOrderInput = z.infer<typeof ProcessOrderInputSchema>;

const ProcessOrderOutputSchema = z.object({
  orderId: z.string().describe('A unique ID for the newly created order.'),
  farmerNotification: z
    .string()
    .describe('A notification message to be sent to the farmer.'),
});
export type ProcessOrderOutput = z.infer<typeof ProcessOrderOutputSchema>;

export async function processOrder(
  input: ProcessOrderInput
): Promise<ProcessOrderOutput> {
  return processOrderFlow(input);
}

const processOrderPrompt = ai.definePrompt({
  name: 'processOrderPrompt',
  input: {schema: ProcessOrderInputSchema},
  output: {schema: ProcessOrderOutputSchema},
  prompt: `You are an order processing agent for a farm-to-table delivery service. A customer has just placed an order.

Generate a unique order ID and a notification message for the farmer.

Order Details:
- Farm: {{{farmName}}}
- Product: {{{productName}}}
- Quantity: {{{quantity}}}
- Total: {{{total}}}

The order ID should be in the format 'ord_xxxxxxxx'.
The farmer notification should be a short, clear message summarizing the new order.
`,
});

const processOrderFlow = ai.defineFlow(
  {
    name: 'processOrderFlow',
    inputSchema: ProcessOrderInputSchema,
    outputSchema: ProcessOrderOutputSchema,
  },
  async input => {
    // In a real application, you would save the order to a database here.
    // We are simulating that by just returning the generated ID and notification.
    const {output} = await processOrderPrompt(input);
    return output!;
  }
);
