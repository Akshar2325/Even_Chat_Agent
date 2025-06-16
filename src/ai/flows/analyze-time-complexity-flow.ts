
'use server';
/**
 * @fileOverview An AI agent for analyzing the time complexity of code.
 *
 * - analyzeTimeComplexity - A function that analyzes code complexity.
 * - AnalyzeTimeComplexityInput - The input type.
 * - AnalyzeTimeComplexityOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeTimeComplexityInputSchema = z.object({
  text: z.string().describe('The code snippet for time complexity analysis.'),
});
export type AnalyzeTimeComplexityInput = z.infer<typeof AnalyzeTimeComplexityInputSchema>;

const AnalyzeTimeComplexityOutputSchema = z.object({
  analysis: z.string().describe('The Big-O notation time complexity analysis with reasoning.'),
});
export type AnalyzeTimeComplexityOutput = z.infer<typeof AnalyzeTimeComplexityOutputSchema>;

export async function analyzeTimeComplexity(input: AnalyzeTimeComplexityInput): Promise<AnalyzeTimeComplexityOutput> {
  return analyzeTimeComplexityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeTimeComplexityPrompt',
  input: {schema: AnalyzeTimeComplexityInputSchema},
  output: {schema: AnalyzeTimeComplexityOutputSchema},
  prompt: `You are a computational complexity analyst. Analyze the time complexity (Big-O notation) of the following code snippet.
Clearly state the Big-O complexity and explain your reasoning by identifying the dominant operations and how they scale with input size.
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const analyzeTimeComplexityFlow = ai.defineFlow(
  {
    name: 'analyzeTimeComplexityFlow',
    inputSchema: AnalyzeTimeComplexityInputSchema,
    outputSchema: AnalyzeTimeComplexityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
