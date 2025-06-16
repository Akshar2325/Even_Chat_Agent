
"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import { CodeBlock } from "@/components/code-block";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  const renderContent = (content: string): React.ReactNode => {
    // Regex to split by code blocks, keeping the delimiters (code blocks)
    const parts = content.split(/(```(?:[a-zA-Z0-9_.-]*)\n(?:[\s\S]*?)\n```)/g);
    // Example: "text1 ```lang\ncode``` text2"
    // parts -> ["text1 ", "```lang\ncode```", " text2"]

    // Filter out empty strings that can result from split if content starts/ends with a code block
    const filteredParts = parts.filter(part => part.length > 0);

    // Check if there are any code blocks after filtering
    const hasCodeBlocks = filteredParts.some(part => part.startsWith('```') && part.endsWith('```'));

    if (!hasCodeBlocks) {
      // No code blocks, return content as is (will be wrapped by parent's whitespace-pre-wrap)
      return content;
    }

    const codeBlockRegex = /^```(\w*)\n([\s\S]*?)\n```$/;

    return filteredParts.map((part, index) => {
      const match = codeBlockRegex.exec(part);
      if (match) {
        const lang = match[1];
        const code = match[2];
        // Add margin-top if this code block isn't the very first piece of content
        const mt = index > 0 ? 'mt-2' : '';
        return (
          <div key={`code-${index}`} className={mt}>
            <CodeBlock language={lang} code={code} />
          </div>
        );
      } else {
        // It's a text part. It will inherit whitespace-pre-wrap from the parent.
        return <span key={`text-${index}`}>{part}</span>;
      }
    });
  };


  return (
    <div
      className={cn(
        "flex items-start gap-3 py-4",
        isUser ? "justify-end" : "justify-start"
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
           <Image src="/icon.png" alt="User Icon" width={32} height={32} />
          <AvatarFallback>
            {/* Fallback for user icon if needed */}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
