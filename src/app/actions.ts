"use server";

import type { AiModeId, ChatMessage } from "@/lib/types";
import { fixGrammar } from "@/ai/flows/fix-grammar";
import { summarizeText } from "@/ai/flows/summarize-text";
import { formalizeText } from "@/ai/flows/formalize-text";
import { generalChat } from "@/ai/flows/general-chat";
import { fixCode } from "@/ai/flows/fix-code-flow";
import { optimizeCode } from "@/ai/flows/optimize-code-flow";
import { lintCode } from "@/ai/flows/lint-code-flow";
import { explainCodeStepByStep } from "@/ai/flows/explain-code-step-by-step-flow";
import { analyzeTimeComplexity } from "@/ai/flows/analyze-time-complexity-flow";
import { suggestDesignPattern } from "@/ai/flows/suggest-design-pattern-flow";
import { translateCode } from "@/ai/flows/translate-code-flow";
import { generatePseudocode } from "@/ai/flows/generate-pseudocode-flow";
import { suggestDockerfile } from "@/ai/flows/suggest-dockerfile-flow";
import { gitAssistant } from "@/ai/flows/git-assistant-flow";
import { commitMessageFormatter } from "@/ai/flows/commit-message-formatter-flow";

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
      case "fixCode":
        const fixCodeResult = await fixCode({ text: userInput });
        return fixCodeResult.correctedCode;
      case "optimizeCode":
        const optimizeCodeResult = await optimizeCode({ text: userInput });
        return optimizeCodeResult.suggestions;
      case "lintCode":
        const lintCodeResult = await lintCode({ text: userInput });
        return lintCodeResult.lintingResults;
      case "explainCodeStepByStep":
        const explainResult = await explainCodeStepByStep({ text: userInput });
        return explainResult.explanation;
      case "analyzeTimeComplexity":
        const complexityResult = await analyzeTimeComplexity({
          text: userInput,
        });
        return complexityResult.analysis;
      case "suggestDesignPattern":
        const patternResult = await suggestDesignPattern({ text: userInput });
        return patternResult.suggestion;
      case "translateCode":
        // The user input should contain the target language, e.g., "Translate to Python: [code]"
        const translateResult = await translateCode({ text: userInput });
        return translateResult.translatedCode;
      case "generatePseudocode":
        const pseudocodeResult = await generatePseudocode({ text: userInput });
        return pseudocodeResult.pseudocode;
      case "suggestDockerfile":
        const dockerfileResult = await suggestDockerfile({ text: userInput });
        return dockerfileResult.dockerfileContent;
      case "gitAssistant":
        const gitResult = await gitAssistant({ scenario: userInput });
        return gitResult.suggestion;
      case "commitMessageFormatter":
        const commitResult = await commitMessageFormatter({
          rawDescription: userInput,
        });
        return commitResult.formattedMessage;
      case "general":
      default:
        const generalResult = await generalChat({ text: userInput });
        return generalResult.responseText;
    }
  } catch (error) {
    console.error("AI interaction error:", error);
    // It's better to throw a custom error or a more specific error message
    // that can be caught and displayed nicely on the client.
    throw new Error(
      "An error occurred while processing your request with the AI."
    );
  }
}
