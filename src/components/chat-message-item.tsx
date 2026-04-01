"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import React, { useState } from "react";
import { User, Brain, ChevronDown, ChevronUp } from "lucide-react";
import { getModelById } from "@/lib/models";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === "user";
  const [showReasoning, setShowReasoning] = useState(false);
  const model = message.modelId ? getModelById(message.modelId) : null;

  return (
    <div
      className={cn(
        "flex gap-3 py-3 animate-message-in",
        isUser ? "justify-end items-start" : "justify-start items-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-9 w-9 shrink-0 ring-2 ring-primary/20 shadow-lg shadow-primary/5">
          <Image src="/icon.png" alt="Even AI" width={36} height={36} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
            E
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
          isUser
            ? "user-message-bubble text-white shadow-md"
            : "ai-message-bubble text-foreground border border-border/40"
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
              <div className="mt-2 text-[13px] leading-relaxed text-muted-foreground bg-muted/30 border border-border/50 rounded-lg px-3 py-2.5 whitespace-pre-wrap animate-accordion-down overflow-hidden">
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
          {isUser ? (
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
