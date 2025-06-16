'use server';

/**
 * @fileOverview A text formalization AI agent.
 *
 * - formalizeText - A function that handles the text formalization process.
 * - FormalizeTextInput - The input type for the formalizeText function.
 * - FormalizeTextOutput - The return type for the formalizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FormalizeTextInputSchema = z.object({
  text: z.string().describe('The text to formalize.'),
});
export type FormalizeTextInput = z.infer<typeof FormalizeTextInputSchema>;

const FormalizeTextOutputSchema = z.object({
  formalizedText: z.string().describe('The formalized text.'),
});
export type FormalizeTextOutput = z.infer<typeof FormalizeTextOutputSchema>;

export async function formalizeText(input: FormalizeTextInput): Promise<FormalizeTextOutput> {
  return formalizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'formalizeTextPrompt',
  input: {schema: FormalizeTextInputSchema},
  output: {schema: FormalizeTextOutputSchema},
  prompt: `You are a professional text formalizer. You will take the input text and formalize it.

Input text: {{{text}}}`,
});

const formalizeTextFlow = ai.defineFlow(
  {
    name: 'formalizeTextFlow',
    inputSchema: FormalizeTextInputSchema,
    outputSchema: FormalizeTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
