
'use server';
/**
 * @fileOverview An AI agent for assisting with Git commands and scenarios.
 *
 * - gitAssistant - A function that provides Git assistance.
 * - GitAssistantInput - The input type.
 * - GitAssistantOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GitAssistantInputSchema = z.object({
  scenario: z.string().describe('A description of a Git-related problem or question.'),
});
export type GitAssistantInput = z.infer<typeof GitAssistantInputSchema>;

const GitAssistantOutputSchema = z.object({
  suggestion: z.string().describe('A suggested Git command or explanation to address the scenario.'),
});
export type GitAssistantOutput = z.infer<typeof GitAssistantOutputSchema>;

export async function gitAssistant(input: GitAssistantInput): Promise<GitAssistantOutput> {
  return gitAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gitAssistantPrompt',
  input: {schema: GitAssistantInputSchema},
  output: {schema: GitAssistantOutputSchema},
  prompt: `You are an expert Git assistant. The user is asking for help with a Git scenario.
Based on their description, provide a concise and accurate Git command or a short, clear explanation to help them.
If the scenario is unclear, ask for clarification.
User's scenario:
{{{scenario}}}`,
});

const gitAssistantFlow = ai.defineFlow(
  {
    name: 'gitAssistantFlow',
    inputSchema: GitAssistantInputSchema,
    outputSchema: GitAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
