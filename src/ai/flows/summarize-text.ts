// Summarize Text Flow
'use server';
/**
 * @fileOverview Text summarization AI agent.
 *
 * - summarizeText - A function that handles the text summarization process.
 * - SummarizeTextFlowInput - The input type for the summarizeText function.
 * - SummarizeTextFlowOutput - The return type for the summarizeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTextFlowInputSchema = z.object({
  text: z.string().describe('The text to summarize.'),
});
export type SummarizeTextFlowInput = z.infer<typeof SummarizeTextFlowInputSchema>;

const SummarizeTextFlowOutputSchema = z.object({
  summary: z.string().describe('The summarized text.'),
});
export type SummarizeTextFlowOutput = z.infer<typeof SummarizeTextFlowOutputSchema>;

export async function summarizeText(input: SummarizeTextFlowInput): Promise<SummarizeTextFlowOutput> {
  return summarizeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeTextPrompt',
  input: {schema: SummarizeTextFlowInputSchema},
  output: {schema: SummarizeTextFlowOutputSchema},
  prompt: `Summarize the following text:\n\n{{text}}`,
});

const summarizeTextFlow = ai.defineFlow(
  {
    name: 'summarizeTextFlow',
    inputSchema: SummarizeTextFlowInputSchema,
    outputSchema: SummarizeTextFlowOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
