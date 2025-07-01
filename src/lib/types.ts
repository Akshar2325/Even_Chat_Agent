export type AiModeId =
  | "general"
  | "fixgrammar"
  | "summarize"
  | "formalize"
  | "fixCode"
  | "optimizeCode"
  | "lintCode"
  | "explainCodeStepByStep"
  | "analyzeTimeComplexity"
  | "suggestDesignPattern"
  | "translateCode"
  | "generatePseudocode"
  | "suggestDockerfile"
  | "gitAssistant"
  | "commitMessageFormatter";

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
  mode?: AiModeId;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
  mode?: AiModeId; // Default mode for the session
}
