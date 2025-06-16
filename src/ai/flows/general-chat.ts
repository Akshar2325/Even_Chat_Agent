'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneralChatInputSchema = z.object({
  text: z.string().describe('The user input for general conversation.'),
});
export type GeneralChatInput = z.infer<typeof GeneralChatInputSchema>;

const GeneralChatOutputSchema = z.object({
  responseText: z.string().describe('The AI response for general conversation.'),
});
export type GeneralChatOutput = z.infer<typeof GeneralChatOutputSchema>;

export async function generalChat(input: GeneralChatInput): Promise<GeneralChatOutput> {
  return generalChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generalChatPrompt',
  input: {schema: GeneralChatInputSchema},
  output: {schema: GeneralChatOutputSchema},
  prompt: `You are a helpful assistant called ModeChat. Respond to the user's input concisely and friendly.

User: {{{text}}}
Assistant:`,
});

const generalChatFlow = ai.defineFlow(
  {
    name: 'generalChatFlow',
    inputSchema: GeneralChatInputSchema,
    outputSchema: GeneralChatOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
