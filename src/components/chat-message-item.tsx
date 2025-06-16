
"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";
import React from "react";
import { User } from "lucide-react";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  const renderContent = (content: string): React.ReactNode[] => {
    // Regex for full code blocks (```...```), captures the block
    const blockCodeRegex = /(```(?:[a-zA-Z0-9_.-]*\n(?:[\s\S]*?)\n```))/g;
    // Regex for inline code (`...`), captures the segment including backticks
    const inlineCodeRegex = /(`[^`\n]+?`)/g; // Ensure it doesn't match across newlines for inline

    // Split by block code first
    const parts = content.split(blockCodeRegex);

    return parts.map((part, index) => {
      // Check if this part is a block code
      const blockMatch = /^```(\w*)\n([\s\S]*?)\n```$/.exec(part);
      if (blockMatch) {
        const lang = blockMatch[1];
        const code = blockMatch[2];
        // Add margin-top if this code block isn't the very first piece of content and the previous part had visible text
        const isFirstMeaningfulElement = index === 0 || (index > 0 && parts[index -1].trim() === '');
        const mt = !isFirstMeaningfulElement ? 'mt-2' : '';
        return (
          <div key={`block-code-${index}`} className={mt}>
            <CodeBlock language={lang} code={code} />
          </div>
        );
      }

      // If not a block code, it's a text segment that might contain inline code
      // Preserve newlines in text segments for whitespace-pre-wrap to handle
      const textSegments = part.split(inlineCodeRegex).map((segment, segIndex) => {
        if (segment.startsWith('`') && segment.endsWith('`') && !segment.includes('\n')) {
          // It's an inline code segment
          const inlineCodeContent = segment.slice(1, -1); // Remove backticks
          return (
            <code
              key={`inline-code-${index}-${segIndex}`}
              className="bg-muted px-1.5 py-0.5 rounded font-mono text-sm mx-0.5"
            >
              {inlineCodeContent}
            </code>
          );
        }
        // It's a plain text segment, return as is (React.Fragment needed for keys if segment is empty)
        return <React.Fragment key={`text-${index}-${segIndex}`}>{segment}</React.Fragment>;
      });
      return textSegments; // This will be an array of nodes/strings
    }).flat(); // Flatten the array of arrays/nodes
  };


  return (
    <div
      className={cn(
        "flex gap-3 py-4",
        isUser ? "justify-end items-center" : "justify-start items-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 shrink-0">
          <Image src="/icon.png" alt="AI Icon" width={40} height={40} />
          <AvatarFallback></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 shadow-md whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        )}
      >
        <div className="text-sm">{renderContent(message.content)}</div>
        {!isUser && message.mode && message.mode !== "general" && (
          <p className="mt-1 text-xs opacity-70">
            Mode: {message.mode.charAt(0).toUpperCase() + message.mode.slice(1)}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
           <AvatarFallback className="bg-muted text-muted-foreground">
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
