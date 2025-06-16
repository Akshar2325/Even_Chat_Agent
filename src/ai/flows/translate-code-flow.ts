
'use server';
/**
 * @fileOverview An AI agent for translating code between programming languages.
 *
 * - translateCode - A function that translates code.
 * - TranslateCodeInput - The input type.
 * - TranslateCodeOutput - The output type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateCodeInputSchema = z.object({
  text: z.string().describe('The user request, including the code to translate and the target language, e.g., "Translate this Python code to JavaScript: [code here]"'),
});
export type TranslateCodeInput = z.infer<typeof TranslateCodeInputSchema>;

const TranslateCodeOutputSchema = z.object({
  translatedCode: z.string().describe('The translated code, or an error message if translation is not possible.'),
});
export type TranslateCodeOutput = z.infer<typeof TranslateCodeOutputSchema>;

export async function translateCode(input: TranslateCodeInput): Promise<TranslateCodeOutput> {
  return translateCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'translateCodePrompt',
  input: {schema: TranslateCodeInputSchema},
  output: {schema: TranslateCodeOutputSchema},
  prompt: `You are an expert code translator. The user will provide text that includes the code to translate and the target programming language.
Identify both the code snippet and the target language from the user's input.
Translate the provided code snippet accurately to the target language.
Respond ONLY with the translated code block.
If the target language is ambiguous, not specified, or not supported for translation from the source, state that you cannot perform the translation and briefly explain why.
User's request:
{{{text}}}`,
});

const translateCodeFlow = ai.defineFlow(
  {
    name: 'translateCodeFlow',
    inputSchema: TranslateCodeInputSchema,
    outputSchema: TranslateCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
