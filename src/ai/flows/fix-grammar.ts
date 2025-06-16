'use server';
/**
 * @fileOverview A grammar correction AI agent.
 *
 * - fixGrammar - A function that handles the grammar correction process.
 * - FixGrammarInput - The input type for the fixGrammar function.
 * - FixGrammarOutput - The return type for the fixGrammar function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FixGrammarInputSchema = z.object({
  text: z.string().describe('The text to fix grammar and improve clarity.'),
});
export type FixGrammarInput = z.infer<typeof FixGrammarInputSchema>;

const FixGrammarOutputSchema = z.object({
  correctedText: z.string().describe('The text with improved grammar and clarity.'),
});
export type FixGrammarOutput = z.infer<typeof FixGrammarOutputSchema>;

export async function fixGrammar(input: FixGrammarInput): Promise<FixGrammarOutput> {
  return fixGrammarFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fixGrammarPrompt',
  input: {schema: FixGrammarInputSchema},
  output: {schema: FixGrammarOutputSchema},
  prompt: `You are a grammar expert. Please correct the grammar and improve the clarity of the following text:\n\n{{{text}}}`,
});

const fixGrammarFlow = ai.defineFlow(
  {
    name: 'fixGrammarFlow',
    inputSchema: FixGrammarInputSchema,
    outputSchema: FixGrammarOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
