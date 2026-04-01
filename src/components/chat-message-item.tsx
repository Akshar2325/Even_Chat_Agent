"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import React, { useState } from "react";
import { User, Brain, ChevronDown, ChevronUp, Copy, ThumbsUp, ThumbsDown, RefreshCcw, Check, ListPlus, Minimize2, MoreHorizontal } from "lucide-react";
import { getModelById } from "@/lib/models";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import type { AiModifier } from "@/app/actions";
import { Button } from "@/components/ui/button";

interface ChatMessageItemProps {
  message: ChatMessage;
  onRetry?: (messageId: string, modifier?: AiModifier) => void;
}

export function ChatMessageItem({ message, onRetry }: ChatMessageItemProps) {
  const isUser = message.sender === "user";
  const [showReasoning, setShowReasoning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [feedback, setFeedback] = useState<"good" | "bad" | null>(null);

  const model = message.modelId ? getModelById(message.modelId) : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex gap-3 py-2 animate-message-in group",
        isUser ? "justify-end items-start" : "justify-start items-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-transparent transition-all hover:ring-primary/20 hover:shadow-lg hover:shadow-primary/5">
          <AvatarFallback className="bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10">
            <Image
              src="/icon.png"
              alt="Even"
              width={24}
              height={24}
              className="dark:invert drop-shadow-sm"
            />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          "flex flex-col gap-1.5 transition-all duration-200",
          isUser ? "items-end max-w-[85%] md:max-w-xl ml-auto" : "items-start max-w-[92%] md:max-w-xl"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-5 py-3.5 shadow-sm relative",
            isUser
              ? "bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 text-foreground border border-primary/20 rounded-tr-sm"
              : "bg-muted/30 hover:bg-muted/40 transition-colors text-foreground rounded-tl-sm border border-border/40"
          )}
        >
        {!isUser && model && (
          <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-border/40">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <span>{model.icon}</span>
              {model.name}
            </span>
          </div>
        )}

        {message.reasoning && (
          <div className="mb-3">
            <button
              onClick={() => setShowReasoning(!showReasoning)}
              className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 hover:text-purple-300 transition-colors bg-purple-500/10 px-2 py-1.5 rounded-md w-fit border border-purple-500/20"
              aria-expanded={showReasoning}
            >
              <Brain className="h-3.5 w-3.5" />
              <span>Thinking Process</span>
              {showReasoning ? (
                <ChevronUp className="h-3.5 w-3.5 ml-1 opacity-70" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 ml-1 opacity-70" />
              )}
            </button>
            {showReasoning && (
              <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground bg-muted/30 border border-border/50 rounded-lg px-3 py-2.5 whitespace-pre-wrap animate-accordion-down overflow-y-auto max-h-[250px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
                {message.reasoning}
              </div>
            )}
          </div>
        )}

          <div
            className={cn(
              "text-[15px] leading-relaxed break-words",
              isUser ? "text-white/95 whitespace-pre-wrap" : "text-foreground/90 markdown-body"
            )}
          >
            {message.content === "..." ? (
              <div className="flex space-x-1.5 h-6 items-center px-1">
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            ) : isUser ? (
              message.content
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isMultiline = String(children).includes("\n");

                    if (match || isMultiline) {
                      return (
                        <div className="mt-3 overflow-hidden rounded-xl border border-border/40">
                          <CodeBlock
                            language={match ? match[1] : "text"}
                            code={String(children).replace(/\n$/, "")}
                          />
                        </div>
                      );
                    }

                    return (
                      <code
                        className="bg-muted px-1.5 py-0.5 rounded-md font-mono text-[13px] text-primary"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  pre({ children }: any) {
                    return <>{children}</>;
                  },
                  p({ children }: any) {
                    return <p className="mb-3 last:mb-0">{children}</p>;
                  },
                  ul({ children }: any) {
                    return <ul className="list-disc pl-5 mb-3 space-y-1">{children}</ul>;
                  },
                  ol({ children }: any) {
                    return <ol className="list-decimal pl-5 mb-3 space-y-1">{children}</ol>;
                  },
                  h1({ children }: any) {
                    return <h1 className="text-xl font-bold mb-3 mt-4 text-foreground">{children}</h1>;
                  },
                  h2({ children }: any) {
                    return <h2 className="text-lg font-bold mb-2 mt-4 text-foreground">{children}</h2>;
                  },
                  h3({ children }: any) {
                    return <h3 className="text-base font-semibold mb-2 mt-3 text-foreground">{children}</h3>;
                  },
                  blockquote({ children }: any) {
                    return <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground mb-3">{children}</blockquote>;
                  },
                  a({ children, href }: any) {
                    return <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>;
                  },
                  table({ children }: any) {
                    return <div className="overflow-x-auto mb-3"><table className="w-full text-sm border-collapse">{children}</table></div>;
                  },
                  th({ children }: any) {
                    return <th className="border border-border/50 bg-muted/50 px-3 py-2 text-left font-semibold">{children}</th>;
                  },
                  td({ children }: any) {
                    return <td className="border border-border/50 px-3 py-2">{children}</td>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>

          {!isUser && message.content !== "..." && (
             <div className="flex items-center gap-1 mt-3 pt-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                <div className="flex items-center bg-background/50 backdrop-blur-md rounded-lg border border-border/40 p-0.5 shadow-sm">
                   <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50" 
                      onClick={handleCopy}
                      title={isCopied ? "Copied!" : "Copy response"}
                   >
                      {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                   </Button>
                   
                   <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn("h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50", feedback === "good" && "text-primary bg-primary/10")} 
                      onClick={() => setFeedback(feedback === "good" ? null : "good")}
                      title="Good response"
                   >
                      <ThumbsUp size={14} className={feedback === "good" ? "fill-current" : ""} />
                   </Button>
                   
                   <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn("h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50", feedback === "bad" && "text-destructive bg-destructive/10")} 
                      onClick={() => setFeedback(feedback === "bad" ? null : "bad")}
                      title="Bad response"
                   >
                      <ThumbsDown size={14} className={feedback === "bad" ? "fill-current" : ""} />
                   </Button>

                   {onRetry && (
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50" title="Ask to change response">
                               <RefreshCcw size={14} />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="start" className="w-[200px] p-1.5 border-border shadow-md">
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground pb-2 px-2 flex justify-between items-center bg-transparent">
                               Ask to change response
                               <ChevronUp size={12} className="opacity-50" />
                            </DropdownMenuLabel>
                            
                            <DropdownMenuItem 
                               onClick={() => onRetry(message.id, "retry")}
                               className="flex items-center gap-2 cursor-pointer rounded-sm py-2"
                            >
                               <RefreshCcw size={14} className="opacity-70" />
                               <span>Try again</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator className="my-1 bg-border/40" />
                            
                            <DropdownMenuItem 
                               onClick={() => onRetry(message.id, "details")}
                               className="flex items-center gap-2 cursor-pointer rounded-sm py-2"
                            >
                               <ListPlus size={14} className="opacity-70" />
                               <span>Add details</span>
                            </DropdownMenuItem>
                            
                            <DropdownMenuItem 
                               onClick={() => onRetry(message.id, "concise")}
                               className="flex items-center gap-2 cursor-pointer rounded-sm py-2"
                            >
                               <Minimize2 size={14} className="opacity-70" />
                               <span>More concise</span>
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   )}
                </div>
             </div>
          )}
        </div>
      </div>
      {isUser && (
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20 shadow-lg shadow-primary/5">
          <AvatarFallback className="bg-primary/10 text-primary">
            <User size={18} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
