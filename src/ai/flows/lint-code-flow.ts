
'use server';
/**
 * @fileOverview An AI agent for linting code and flagging style issues.
 *
 * - lintCode - A function that lints code.
 * - LintCodeInput - The input type for the lintCode function.
 * - LintCodeOutput - The return type for the lintCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LintCodeInputSchema = z.object({
  text: z.string().describe('The code snippet to lint.'),
});
export type LintCodeInput = z.infer<typeof LintCodeInputSchema>;

const LintCodeOutputSchema = z.object({
  lintingResults: z.string().describe('A list of style violations and suggested corrections, or "No style issues found."'),
});
export type LintCodeOutput = z.infer<typeof LintCodeOutputSchema>;

export async function lintCode(input: LintCodeInput): Promise<LintCodeOutput> {
  return lintCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'lintCodePrompt',
  input: {schema: LintCodeInputSchema},
  output: {schema: LintCodeOutputSchema},
  prompt: `You are a code style linter. Analyze the following code snippet for adherence to common style guides and best practices relevant to its language (e.g., PEP8 for Python, ESLint/Prettier for JavaScript/TypeScript, Google Style Guide for Java/C++).
List any style violations found and suggest corrections.
If no style issues are apparent, state "No style issues found."
Input code:
\`\`\`
{{{text}}}
\`\`\``,
});

const lintCodeFlow = ai.defineFlow(
  {
    name: 'lintCodeFlow',
    inputSchema: LintCodeInputSchema,
    outputSchema: LintCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
