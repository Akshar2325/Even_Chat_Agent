
'use server';
/**
 * @fileOverview An AI agent for suggesting code optimizations.
 *
 * - optimizeCode - A function that suggests code optimizations.
 * - OptimizeCodeInput - The input type for the optimizeCode function.
 * - OptimizeCodeOutput - The return type for the optimizeCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeCodeInputSchema = z.object({
  text: z.string().describe('The code snippet to analyze for optimization.'),
});
export type OptimizeCodeInput = z.infer<typeof OptimizeCodeInputSchema>;

const OptimizeCodeOutputSchema = z.object({
  suggestions: z.string().describe('Suggestions for performance and memory improvements, or a statement if well-optimized.'),
});
export type OptimizeCodeOutput = z.infer<typeof OptimizeCodeOutputSchema>;

export async function optimizeCode(input: OptimizeCodeInput): Promise<OptimizeCodeOutput> {
  return optimizeCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeCodePrompt',
  input: {schema: OptimizeCodeInputSchema},
  output: {schema: OptimizeCodeOutputSchema},
  prompt: `You are a code optimization specialist. Analyze the following code for performance (speed) and memory usage.
Provide specific, actionable suggestions for improvement. Explain the reasoning behind each suggestion.
If the code is already well-optimized for its apparent purpose, state that clearly.
Present your suggestions as a list if multiple are found.
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const optimizeCodeFlow = ai.defineFlow(
  {
    name: 'optimizeCodeFlow',
    inputSchema: OptimizeCodeInputSchema,
    outputSchema: OptimizeCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
