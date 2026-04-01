export type AiModeId =
  | "general"
  | "fixgrammar"
  | "formalize"
  | "analyzeTimeComplexity"
  | "explainCodeStepByStep"
  | "suggestDesignPattern"
  | "gitAssistant"
  | "commitMessageFormatter"
  | "improvePrompt";

export interface AiMode {
  id: AiModeId;
  name: string;
  description: string;
  icon?: React.ElementType;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  content: string;
  reasoning?: string;
  mode?: AiModeId;
  modelId?: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
  mode?: AiModeId;
  modelId?: string;
}
