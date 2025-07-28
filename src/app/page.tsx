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
import { handleAiInteraction } from "./actions";
import { ThemeToggle } from "@/components/theme-toggle";
import { ChatMessageItem } from "@/components/chat-message-item";
import { ModeSelector } from "@/components/mode-selector";
import { ModeExplanationDialog } from "@/components/mode-explanation-dialog";
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
  Lightbulb, // Import Lightbulb icon
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
    id: "summarize",
    name: "Summarize",
    description: "Condenses long text into a short summary.",
    icon: BookText,
  },
  {
    id: "formalize",
    name: "Formalize",
    description: "Makes your text sound more professional.",
    icon: Briefcase,
  },
  {
    id: "fixCode",
    name: "Fix Code",
    description: "Auto-corrects syntax errors in code.",
    icon: Wrench,
  },
  {
    id: "optimizeCode",
    name: "Optimize Code",
    description: "Suggests performance/memory improvements for code.",
    icon: Zap,
  },
  {
    id: "lintCode",
    name: "Lint Code",
    description: "Flags style issues in code (e.g., PEP8, ESLint).",
    icon: ScanLine,
  },
  {
    id: "explainCodeStepByStep",
    name: "Explain Code",
    description: "Line-by-line breakdown of how code executes.",
    icon: Milestone,
  },
  {
    id: "analyzeTimeComplexity",
    name: "Time Complexity",
    description: "Analyzes Big-O notation of code.",
    icon: Binary,
  },
  {
    id: "suggestDesignPattern",
    name: "Design Patterns",
    description: "Suggests architectural patterns for code.",
    icon: Library,
  },
  {
    id: "translateCode",
    name: "Translate Code",
    description: "Converts code between programming languages.",
    icon: Languages,
  },
  {
    id: "generatePseudocode",
    name: "Pseudocode",
    description: "Generates pseudocode from real code.",
    icon: FileText,
  },
  {
    id: "suggestDockerfile",
    name: "Dockerize",
    description: "Suggests Dockerfile commands for an app.",
    icon: Container,
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
        ? "Welcome to Even! Select a mode or start typing."
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
          } else {
            const sortedSessions = [...parsedSessions].sort(
              (a, b) => b.createdAt - a.createdAt
            );
            setCurrentSessionId(sortedSessions[0].id);
            setSelectedMode(sortedSessions[0].mode || "general");
          }
        } else {
          handleNewChat(true);
        }
      } else {
        handleNewChat(true);
      }
    } catch (error) {
      console.error("Failed to load chat sessions from localStorage:", error);
      handleNewChat(true); // Fallback to a new chat
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
      timestamp: Date.now(),
    };

    setChatSessions((prevSessions) =>
      prevSessions.map((s) =>
        s.id === currentSessionId
          ? { ...s, messages: [...s.messages, userMessage], mode: selectedMode }
          : s
      )
    );

    const currentInput = inputValue;
    setInputValue("");

    startTransition(async () => {
      try {
        const aiResponseContent = await handleAiInteraction(
          currentInput.trim(),
          selectedMode
        );
        const aiMessage: ChatMessage = {
          id: "ai-" + Date.now(),
          sender: "ai",
          content: aiResponseContent,
          mode: selectedMode,
          timestamp: Date.now(),
        };
        setChatSessions((prevSessions) =>
          prevSessions.map((s) =>
            s.id === currentSessionId
              ? { ...s, messages: [...s.messages, aiMessage] }
              : s
          )
        );

        const currentSession = chatSessions.find(
          (s) => s.id === currentSessionId
        );
        // More robust check for initial chat names
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
          <header className="flex items-center justify-between p-4 border-b sticky top-0 z-10 bg-background">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Image
                src="/icon.png"
                alt="Even App Icon"
                width={32}
                height={32}
                priority
              />
              <h1 className="text-xl font-semibold font-headline">Even</h1>
            </div>
            <ThemeToggle />
          </header>

          <main className="flex-1 overflow-hidden">
            <ScrollArea
              className="h-full p-4"
              ref={scrollAreaRef as React.RefObject<HTMLDivElement>}
            >
              <div className="max-w-3xl mx-auto space-y-2 pb-4">
                {messages.map((msg) => (
                  <ChatMessageItem key={msg.id} message={msg} />
                ))}
                {isPending && (
                  <div className="flex justify-start items-start gap-3 py-4">
                    <div className="h-10 w-10 shrink-0 relative">
                      <Image
                        src="/icon.png"
                        alt="AI Icon"
                        layout="fill"
                        objectFit="contain"
                      />
                    </div>
                    <div className="bg-card text-card-foreground rounded-lg p-3 shadow-md">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  </div>
                )}
                {!currentSessionId &&
                  !isPending &&
                  chatSessions.length === 0 && (
                    <div className="text-center text-muted-foreground pt-10">
                      <MessageSquare size={48} className="mx-auto mb-2" />
                      No chats yet. Start a new one!
                    </div>
                  )}
              </div>
            </ScrollArea>
          </main>

          <footer className="p-4 border-t bg-background sticky bottom-0 z-10">
            <form
              onSubmit={handleSubmit}
              className="max-w-3xl mx-auto flex items-end gap-2"
            >
              <div className="flex-1 grid gap-2">
                <Textarea
                  value={inputValue}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setInputValue(e.target.value)
                  }
                  placeholder="Type your message..."
                  className="min-h-[60px] resize-none"
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
                <div className="flex items-center justify-between gap-2">
                  <ModeSelector
                    selectedMode={selectedMode}
                    onModeChange={handleModeChange}
                    modes={AVAILABLE_MODES}
                  />
                  <ModeExplanationDialog modes={AVAILABLE_MODES} />
                </div>
              </div>
              <Button
                type="submit"
                size="icon"
                disabled={isPending || !inputValue.trim() || !currentSessionId}
                aria-label="Send message"
              >
                {isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
