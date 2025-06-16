
'use server';
/**
 * @fileOverview An AI agent for suggesting Dockerfile commands.
 *
 * - suggestDockerfile - A function that suggests Dockerfile content.
 * - SuggestDockerfileInput - The input type.
 * - SuggestDockerfileOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDockerfileInputSchema = z.object({
  text: z.string().describe('A description or code snippet of the application for which to suggest a Dockerfile.'),
});
export type SuggestDockerfileInput = z.infer<typeof SuggestDockerfileInputSchema>;

const SuggestDockerfileOutputSchema = z.object({
  dockerfileContent: z.string().describe('Suggested Dockerfile commands with explanations.'),
});
export type SuggestDockerfileOutput = z.infer<typeof SuggestDockerfileOutputSchema>;

export async function suggestDockerfile(input: SuggestDockerfileInput): Promise<SuggestDockerfileOutput> {
  return suggestDockerfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDockerfilePrompt',
  input: {schema: SuggestDockerfileInputSchema},
  output: {schema: SuggestDockerfileOutputSchema},
  prompt: `You are a DevOps expert specializing in containerization. Based on the following application description or code snippet, suggest a basic Dockerfile to containerize it.
Detect the language/framework if possible and use appropriate base images and commands.
Explain each significant Dockerfile command briefly.
If the input is too vague to create a meaningful Dockerfile, ask for more details about the application stack.
Application context:
{{{text}}}`,
});

const suggestDockerfileFlow = ai.defineFlow(
  {
    name: 'suggestDockerfileFlow',
    inputSchema: SuggestDockerfileInputSchema,
    outputSchema: SuggestDockerfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
