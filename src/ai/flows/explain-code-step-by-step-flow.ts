
'use server';
/**
 * @fileOverview An AI agent for explaining code execution step-by-step.
 *
 * - explainCodeStepByStep - A function that explains code.
 * - ExplainCodeInput - The input type for the explainCodeStepByStep function.
 * - ExplainCodeOutput - The return type for the explainCodeStepByStep function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainCodeInputSchema = z.object({
  text: z.string().describe('The code snippet to explain.'),
});
export type ExplainCodeInput = z.infer<typeof ExplainCodeInputSchema>;

const ExplainCodeOutputSchema = z.object({
  explanation: z.string().describe('A detailed, line-by-line or block-by-block explanation of the code execution.'),
});
export type ExplainCodeOutput = z.infer<typeof ExplainCodeOutputSchema>;

export async function explainCodeStepByStep(input: ExplainCodeInput): Promise<ExplainCodeOutput> {
  return explainCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainCodePrompt',
  input: {schema: ExplainCodeInputSchema},
  output: {schema: ExplainCodeOutputSchema},
  prompt: `You are a code explanation expert. Provide a detailed, line-by-line or block-by-block explanation of how the following code executes.
Focus on the logic, data flow, and the purpose of each significant part.
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const explainCodeFlow = ai.defineFlow(
  {
    name: 'explainCodeFlow',
    inputSchema: ExplainCodeInputSchema,
    outputSchema: ExplainCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
