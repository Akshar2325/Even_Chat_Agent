"use server";

import type { AiModeId, ChatMessage } from "@/lib/types";
import { fixGrammar } from "@/ai/flows/fix-grammar";
import { summarizeText } from "@/ai/flows/summarize-text";
import { formalizeText } from "@/ai/flows/formalize-text";
import { generalChat } from "@/ai/flows/general-chat";

export async function handleAiInteraction(
  userInput: string,
  mode: AiModeId
): Promise<string> {
  try {
    switch (mode) {
      case "fixgrammar":
        const grammarResult = await fixGrammar({ text: userInput });
        return grammarResult.correctedText;
      case "summarize":
        const summarizeResult = await summarizeText({ text: userInput });
        return summarizeResult.summary;
      case "formalize":
        const formalizeResult = await formalizeText({ text: userInput });
        return formalizeResult.formalizedText;
      case "general":
      default:
        const generalResult = await generalChat({ text: userInput });
        return generalResult.responseText;
    }
  } catch (error) {
    console.error("AI interaction error:", error);
    // It's better to throw a custom error or a more specific error message
    // that can be caught and displayed nicely on the client.
    throw new Error("An error occurred while processing your request with the AI.");
  }
}
