"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useTransition,
  FormEvent,
  ChangeEvent,
  useCallback,
} from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import type { ChatMessage, AiModeId, AiMode, ChatSession } from "@/lib/types";
import { handleAiInteractionStream } from "./actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatMessageItem } from "@/components/chat-message-item";
import { ModeSelector } from "@/components/mode-selector";
import { ModelSelector } from "@/components/model-selector";
import { ModeExplanationDialog } from "@/components/mode-explanation-dialog";
import { DEFAULT_MODEL_ID } from "@/lib/models";
import {
  Send,
  Sparkles,
  SpellCheck2,
  BookText,
  Briefcase,
  Loader2,
  MessageSquare,
  Wrench,
  Zap,
  ScanLine,
  Milestone,
  Binary,
  Library,
  Languages,
  FileText,
  Container,
  GithubIcon,
  MessageCircle,
  Lightbulb,
} from "lucide-react";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatHistorySidebar } from "@/components/chat-history-sidebar";

const AVAILABLE_MODES: AiMode[] = [
  {
    id: "general",
    name: "General Chat",
    description: "Engage in a freeform conversation.",
    icon: Sparkles,
  },
  {
    id: "fixgrammar",
    name: "Fix Grammar",
    description: "Improves grammar and clarity of your text.",
    icon: SpellCheck2,
  },
  {
    id: "formalize",
    name: "Formalize",
    description: "Makes your text sound more professional.",
    icon: Briefcase,
  },
  {
    id: "analyzeTimeComplexity",
    name: "Time Complexity",
    description: "Analyzes Big-O notation of code.",
    icon: Binary,
  },
  {
    id: "explainCodeStepByStep",
    name: "Explain Code",
    description: "Line-by-line breakdown of how code executes.",
    icon: Milestone,
  },
  {
    id: "suggestDesignPattern",
    name: "Design Patterns",
    description: "Suggests architectural patterns for code.",
    icon: Library,
  },
  {
    id: "gitAssistant",
    name: "Git Assistant",
    description: "Helps with Git commands and scenarios.",
    icon: GithubIcon,
  },
  {
    id: "commitMessageFormatter",
    name: "Commit Formatter",
    description:
      "Formats raw commit descriptions into proper Conventional Commit messages.",
    icon: MessageCircle,
  },
  {
    id: "improvePrompt",
    name: "Prompt Engineer",
    description: "Enhances prompts to get better results from AI systems.",
    icon: Lightbulb,
  },
];

const getModeById = (modeId: AiModeId): AiMode | undefined =>
  AVAILABLE_MODES.find((m) => m.id === modeId);

export default function ModeChatPage() {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedMode, setSelectedMode] = useState<AiModeId>("general");
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const messages = React.useMemo(() => {
    if (!currentSessionId) return [];
    const currentSession = chatSessions.find((s) => s.id === currentSessionId);
    return currentSession ? currentSession.messages : [];
  }, [chatSessions, currentSessionId]);

  const handleNewChat = useCallback(
    (isInitial: boolean = false, modeId: AiModeId = "general") => {
      const newSessionId = "session-" + Date.now();
      const mode = getModeById(modeId) || AVAILABLE_MODES[0];
      const initialMessageContent = isInitial
        ? "Welcome to Even! I'm your AI assistant — select a mode and model, then start chatting. ✨"
        : `New ${mode.name} chat started. What can I help you with?`;

      const newSession: ChatSession = {
        id: newSessionId,
        name: isInitial
          ? "Welcome Chat"
          : `${mode.name} Chat - ${new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`,
        messages: [
          {
            id: "ai-init-" + Date.now(),
            sender: "ai",
            content: initialMessageContent,
            timestamp: Date.now(),
            mode: mode.id,
          },
        ],
        createdAt: Date.now(),
        mode: mode.id,
      };
      setChatSessions((prevSessions) => [newSession, ...prevSessions]);
      setCurrentSessionId(newSessionId);
      setInputValue("");
      setSelectedMode(mode.id);
    },
    []
  );

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem("chatSessions");
      if (storedSessions) {
        const parsedSessions: ChatSession[] = JSON.parse(storedSessions);
        if (parsedSessions.length > 0) {
          setChatSessions(parsedSessions);
          const storedCurrentId = localStorage.getItem("currentSessionId");
          if (
            storedCurrentId &&
            parsedSessions.some((s) => s.id === storedCurrentId)
          ) {
            setCurrentSessionId(storedCurrentId);
            const currentSession = parsedSessions.find(
              (s) => s.id === storedCurrentId
            );
            setSelectedMode(currentSession?.mode || "general");
            setSelectedModelId(currentSession?.modelId || DEFAULT_MODEL_ID);
          } else {
            const sortedSessions = [...parsedSessions].sort(
              (a, b) => b.createdAt - a.createdAt
            );
            setCurrentSessionId(sortedSessions[0].id);
            setSelectedMode(sortedSessions[0].mode || "general");
            setSelectedModelId(sortedSessions[0].modelId || DEFAULT_MODEL_ID);
          }
        } else {
          handleNewChat(true);
        }
      } else {
        handleNewChat(true);
      }
    } catch (error) {
      console.error("Failed to load chat sessions from localStorage:", error);
      handleNewChat(true);
    }
  }, [handleNewChat]);

  useEffect(() => {
    if (chatSessions.length > 0) {
      localStorage.setItem("chatSessions", JSON.stringify(chatSessions));
    }
    if (currentSessionId) {
      localStorage.setItem("currentSessionId", currentSessionId);
    }
  }, [chatSessions, currentSessionId]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSelectSession = (sessionId: string) => {
    const session = chatSessions.find((s) => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setSelectedMode(session.mode || "general");
      setSelectedModelId(session.modelId || DEFAULT_MODEL_ID);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const newSessions = chatSessions.filter((s) => s.id !== sessionId);
    setChatSessions(newSessions);
    if (currentSessionId === sessionId) {
      if (newSessions.length > 0) {
        const sortedRemaining = [...newSessions].sort(
          (a, b) => b.createdAt - a.createdAt
        );
        setCurrentSessionId(sortedRemaining[0].id);
        setSelectedMode(sortedRemaining[0].mode || "general");
      } else {
        handleNewChat(true);
      }
    }
  };

  const handleRenameSession = (sessionId: string, newName: string) => {
    setChatSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === sessionId ? { ...s, name: newName } : s
      )
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim() || !currentSessionId) return;

    const userMessage: ChatMessage = {
      id: "user-" + Date.now(),
      sender: "user",
      content: inputValue.trim(),
      mode: selectedMode,
      modelId: selectedModelId,
      timestamp: Date.now(),
    };

    setChatSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, userMessage], mode: selectedMode, modelId: selectedModelId }
          : s
      )
    );

    const currentInput = inputValue;
    setInputValue("");

    startTransition(async () => {
      try {
        const stream = await handleAiInteractionStream(
          currentInput.trim(),
          selectedMode,
          selectedModelId
        );

        const aiMessageId = "ai-" + Date.now();
        const initialAiMessage: ChatMessage = {
          id: aiMessageId,
          sender: "ai",
          content: "",
          reasoning: undefined,
          mode: selectedMode,
          modelId: selectedModelId,
          timestamp: Date.now(),
        };

        setChatSessions((prevSessions) =>
          prevSessions.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, initialAiMessage] }
              : s
          )
        );

        let fullRawContent = "";
        for await (const chunk of stream) {
          fullRawContent += chunk;

          let displayContent = fullRawContent;
          let displayReasoning = "";

          const thinkStartIdx = fullRawContent.indexOf("<think>");
          if (thinkStartIdx !== -1) {
             const parts = fullRawContent.split("<think>");
             const afterThink = parts[1] || "";
             
             const thinkEndIdx = afterThink.indexOf("</think>");
             if (thinkEndIdx !== -1) {
                const subParts = afterThink.split("</think>");
                displayReasoning = subParts[0];
                displayContent = parts[0] + (subParts[1] || "");
             } else {
                displayReasoning = afterThink;
                displayContent = parts[0];
             }
          }

          setChatSessions((prevSessions) =>
            prevSessions.map((s) => {
              if (s.id !== currentSessionId) return s;
              return {
                ...s,
                messages: s.messages.map((m) => 
                  m.id === aiMessageId ? 
                    { ...m, content: displayContent, reasoning: displayReasoning || undefined } 
                    : m
                )
              };
            })
          );
        }

        const currentSession = chatSessions.find(
          (s) => s.id === currentSessionId
        );
        const modeName = getModeById(selectedMode)?.name || "Chat";
        const isDefaultName =
          currentSession &&
          (currentSession.name === "Welcome Chat" ||
            currentSession.name.startsWith(`${modeName} Chat - `) ||
            AVAILABLE_MODES.some((m) =>
              currentSession.name.startsWith(`${m.name} Chat - `)
            ));

        if (
          currentSession &&
          isDefaultName &&
          currentSession.messages.filter((m) => m.sender === "user").length ===
            1
        ) {
          const firstUserMessage = currentInput.trim();
          const newNamePrefix =
            firstUserMessage.substring(0, 25) +
            (firstUserMessage.length > 25 ? "..." : "");
          handleRenameSession(
            currentSessionId,
            `${modeName}: ${newNamePrefix}`
          );
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An unknown error occurred.";
        toast({
          variant: "destructive",
          title: "Error",
          description: errorMessage,
        });
        const systemErrorMessage: ChatMessage = {
          id: "error-" + Date.now(),
          sender: "ai",
          content: "Sorry, I couldn't process that. Please try again.",
          timestamp: Date.now(),
        };
        setChatSessions((prevSessions) =>
          prevSessions.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, systemErrorMessage] }
              : s
          )
        );
      }
    });
  };

  const handleModeChange = (newMode: AiModeId) => {
    setSelectedMode(newMode);
    if (currentSessionId) {
      setChatSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === currentSessionId ? { ...s, mode: newMode } : s
        )
      );
    }
  };

  const handleModelChange = (newModelId: string) => {
    setSelectedModelId(newModelId);
    if (currentSessionId) {
      setChatSessions((prevSessions) =>
        prevSessions.map((s) =>
          s.id === currentSessionId ? { ...s, modelId: newModelId } : s
        )
      );
    }
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <ChatHistorySidebar
        chatSessions={chatSessions}
        currentSessionId={currentSessionId}
        onSelectSession={handleSelectSession}
        onNewChat={(mode) => handleNewChat(false, mode)}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />
      <SidebarInset>
        <div className="flex flex-col h-full bg-background">
          {/* Gradient accent line */}
          <div className="header-gradient-line" />

          {/* Header */}
          <header className="flex items-center justify-between px-5 py-3 border-b border-border/50 sticky top-0 z-10 bg-background/80 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-muted/50 transition-colors" />
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Image
                    src="/icon.png"
                    alt="Even App Icon"
                    width={32}
                    height={32}
                    priority
                    className="rounded-lg shadow-md"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-background" />
                </div>
                <div>
                  <h1 className="text-lg font-bold gradient-text leading-tight">Even</h1>
                  <p className="text-[10px] text-muted-foreground leading-tight">AI Chat Agent</p>
                </div>
              </div>
            </div>
            <ThemeToggle />
          </header>

          {/* Messages */}
          <main className="flex-1 overflow-hidden">
            <ScrollArea
              className="h-full px-4 py-2"
              ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
            >
              <div className="max-w-3xl mx-auto space-y-1 pb-4">
                {messages.map((msg) => {
                  const isGenerating = msg.sender === "ai" && !msg.content && !msg.reasoning && isPending;
                  if (isGenerating) {
                    return (
                      <div key={msg.id} className="flex justify-start items-start gap-3 py-3 animate-message-in">
                        <div className="h-9 w-9 shrink-0 relative">
                          <Image
                            src="/icon.png"
                            alt="AI Icon"
                            fill
                            style={{ objectFit: 'contain' }}
                            className="rounded-lg"
                          />
                        </div>
                        <div className="ai-message-bubble rounded-2xl px-5 py-4 shadow-sm">
                          <div className="thinking-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return <ChatMessageItem key={msg.id} message={msg} />;
                })}
                {!currentSessionId &&
                  !isPending &&
                  chatSessions.length === 0 && (
                    <div className="text-center text-muted-foreground pt-20 animate-fade-in">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                        <MessageSquare size={32} className="text-primary" />
                      </div>
                      <p className="text-lg font-medium">No chats yet</p>
                      <p className="text-sm mt-1">Start a new conversation to get going!</p>
                    </div>
                  )}
              </div>
            </ScrollArea>
          </main>

          {/* Footer / Input Area */}
          <footer className="px-4 pb-4 pt-3 border-t border-border/50 bg-background/80 backdrop-blur-xl sticky bottom-0 z-10">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto"
            >
              {/* Input */}
              <div className="input-glow rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-200 shadow-sm">
                <Textarea
                  value={inputValue}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setInputValue(e.target.value)
                  }
                  placeholder="Type your message..."
                  className="min-h-[56px] resize-none border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 rounded-2xl px-4 py-3 text-sm"
                  rows={1}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as any);
                    }
                  }}
                  aria-label="Chat message input"
                  disabled={!currentSessionId || isPending}
                />

                {/* Bottom bar with selectors */}
                <div className="flex items-center justify-between px-3 pb-2">
                  <div className="flex items-center gap-2">
                    <ModeSelector
                      selectedMode={selectedMode}
                      onModeChange={handleModeChange}
                      modes={AVAILABLE_MODES}
                    />
                    <ModelSelector
                      selectedModelId={selectedModelId}
                      onModelChange={handleModelChange}
                    />
                    <ModeExplanationDialog modes={AVAILABLE_MODES} />
                  </div>
                  <Button
                    type="submit"
                    size="icon"
                    disabled={isPending || !inputValue.trim() || !currentSessionId}
                    className="send-btn h-9 w-9 rounded-xl shrink-0"
                    aria-label="Send message"
                  >
                    {isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </form>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
