"use server";
/**
 * @fileOverview An AI agent for improving prompts to get better results from AI systems.
 *
 * - improvePrompt - A function that enhances user prompts.
 * - ImprovePromptInput - The input type.
 * - ImprovePromptOutput - The output type.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const ImprovePromptInputSchema = z.object({
  text: z.string().describe("The original user prompt to improve."),
});
export type ImprovePromptInput = z.infer<typeof ImprovePromptInputSchema>;

const ImprovePromptOutputSchema = z.object({
  improvedPrompt: z.string().describe("The enhanced, more effective prompt."),
  explanation: z
    .string()
    .describe("Brief explanation of how the prompt was improved."),
});
export type ImprovePromptOutput = z.infer<typeof ImprovePromptOutputSchema>;

export async function improvePrompt(
  input: ImprovePromptInput
): Promise<ImprovePromptOutput> {
  return improvePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: "improvePromptPrompt",
  input: { schema: ImprovePromptInputSchema },
  output: { schema: ImprovePromptOutputSchema },
  prompt: `You are an expert prompt engineer who helps users craft more effective prompts for AI systems.

Analyze the following user prompt and create an improved version that will help AI systems better understand the user's intent and produce higher quality responses.

Apply these prompt improvement techniques:
1. Add specificity and context where needed
2. Structure the prompt clearly with appropriate formatting
3. Break complex tasks into steps if necessary
4. Include relevant constraints or requirements
5. Remove ambiguity
6. Maintain the user's original intent and goals

Original prompt:
{{{text}}}

Provide your response as an improved prompt

Provide your response in the following format:

improvedPrompt: (Start with triple backticks) 
Your improved prompt here
(End with triple backticks)`,
});

const improvePromptFlow = ai.defineFlow(
  {
    name: "improvePromptFlow",
    inputSchema: ImprovePromptInputSchema,
    outputSchema: ImprovePromptOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
