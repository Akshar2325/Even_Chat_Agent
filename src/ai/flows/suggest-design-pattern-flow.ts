
'use server';
/**
 * @fileOverview An AI agent for suggesting design patterns for code.
 *
 * - suggestDesignPattern - A function that suggests design patterns.
 * - SuggestDesignPatternInput - The input type.
 * - SuggestDesignPatternOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestDesignPatternInputSchema = z.object({
  text: z.string().describe('The code snippet to analyze for design pattern suggestions.'),
});
export type SuggestDesignPatternInput = z.infer<typeof SuggestDesignPatternInputSchema>;

const SuggestDesignPatternOutputSchema = z.object({
  suggestion: z.string().describe('Suggested design patterns with explanation, or a statement if no specific pattern is immediately applicable.'),
});
export type SuggestDesignPatternOutput = z.infer<typeof SuggestDesignPatternOutputSchema>;

export async function suggestDesignPattern(input: SuggestDesignPatternInput): Promise<SuggestDesignPatternOutput> {
  return suggestDesignPatternFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDesignPatternPrompt',
  input: {schema: SuggestDesignPatternInputSchema},
  output: {schema: SuggestDesignPatternOutputSchema},
  prompt: `You are a software architect. Analyze the following code snippet.
If applicable, suggest relevant design patterns (e.g., Factory, Singleton, Observer, Strategy, etc.) that could improve its structure, maintainability, or scalability.
Explain why the suggested pattern(s) are suitable and briefly how they might be applied.
If no specific design pattern seems immediately beneficial or necessary, state that.
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const suggestDesignPatternFlow = ai.defineFlow(
  {
    name: 'suggestDesignPatternFlow',
    inputSchema: SuggestDesignPatternInputSchema,
    outputSchema: SuggestDesignPatternOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
