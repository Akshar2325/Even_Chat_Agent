
"use client";

import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import Image from "next/image";

interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const isUser = message.sender === "user";

  return (
    <div
      className={cn(
        "flex items-start gap-3 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage src="/icon.png" alt="AI Icon" />
          <AvatarFallback />
        </Avatar>
      )}
      <div
        className={cn(
          "max-w-[75%] rounded-lg p-3 shadow-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        )}
      >
        <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        {!isUser && message.mode && message.mode !== "general" && (
          <p className="mt-1 text-xs opacity-70">
            Mode: {message.mode.charAt(0).toUpperCase() + message.mode.slice(1)}
          </p>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback>
            <User size={20} />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
