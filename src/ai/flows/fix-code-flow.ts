
'use server';
/**
 * @fileOverview An AI agent for fixing code errors.
 *
 * - fixCode - A function that handles code error correction.
 * - FixCodeInput - The input type for the fixCode function.
 * - FixCodeOutput - The return type for the fixCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FixCodeInputSchema = z.object({
  text: z.string().describe('The code snippet with potential errors.'),
});
export type FixCodeInput = z.infer<typeof FixCodeInputSchema>;

const FixCodeOutputSchema = z.object({
  correctedCode: z.string().describe('The corrected code snippet, or original code if no errors found, possibly with a note.'),
});
export type FixCodeOutput = z.infer<typeof FixCodeOutputSchema>;

export async function fixCode(input: FixCodeInput): Promise<FixCodeOutput> {
  return fixCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'fixCodePrompt',
  input: {schema: FixCodeInputSchema},
  output: {schema: FixCodeOutputSchema},
  prompt: `You are an expert code debugger. Analyze the following code snippet and identify any syntax errors or minor logical bugs.
Provide ONLY the corrected code as a direct response.
If the code is already correct and has no obvious errors, respond with the original code and add a brief message on a new line like "Note: The code appears to be correct."
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const fixCodeFlow = ai.defineFlow(
  {
    name: 'fixCodeFlow',
    inputSchema: FixCodeInputSchema,
    outputSchema: FixCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
