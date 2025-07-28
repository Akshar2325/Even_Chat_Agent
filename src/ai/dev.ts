import { config } from "dotenv";
config();

import "@/ai/flows/formalize-text.ts";
import "@/ai/flows/summarize-text.ts";
import "@/ai/flows/fix-grammar.ts";
import "@/ai/flows/general-chat.ts";
import "@/ai/flows/fix-code-flow.ts";
import "@/ai/flows/optimize-code-flow.ts";
import "@/ai/flows/lint-code-flow.ts";
import "@/ai/flows/explain-code-step-by-step-flow.ts";
import "@/ai/flows/analyze-time-complexity-flow.ts";
import "@/ai/flows/suggest-design-pattern-flow.ts";
import "@/ai/flows/translate-code-flow.ts";
import "@/ai/flows/generate-pseudocode-flow.ts";
import "@/ai/flows/suggest-dockerfile-flow.ts";
import "@/ai/flows/git-assistant-flow.ts";
import "@/ai/flows/improve-prompt-flow.ts";
