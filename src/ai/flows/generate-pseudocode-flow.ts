
'use server';
/**
 * @fileOverview An AI agent for generating pseudocode from real code.
 *
 * - generatePseudocode - A function that generates pseudocode.
 * - GeneratePseudocodeInput - The input type.
 * - GeneratePseudocodeOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePseudocodeInputSchema = z.object({
  text: z.string().describe('The code snippet to convert to pseudocode.'),
});
export type GeneratePseudocodeInput = z.infer<typeof GeneratePseudocodeInputSchema>;

const GeneratePseudocodeOutputSchema = z.object({
  pseudocode: z.string().describe('The generated pseudocode.'),
});
export type GeneratePseudocodeOutput = z.infer<typeof GeneratePseudocodeOutputSchema>;

export async function generatePseudocode(input: GeneratePseudocodeInput): Promise<GeneratePseudocodeOutput> {
  return generatePseudocodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePseudocodePrompt',
  input: {schema: GeneratePseudocodeInputSchema},
  output: {schema: GeneratePseudocodeOutputSchema},
  prompt: `You are a code analysis tool. Generate clear and concise pseudocode that represents the logic of the following code snippet.
The pseudocode should be easy to understand and language-agnostic.
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const generatePseudocodeFlow = ai.defineFlow(
  {
    name: 'generatePseudocodeFlow',
    inputSchema: GeneratePseudocodeInputSchema,
    outputSchema: GeneratePseudocodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
