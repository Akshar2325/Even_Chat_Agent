"use client";

import * as React from "react";
import type { AiMode, AiModeId } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  BookText,
  SpellCheck2,
  Sparkles,
  type LucideIcon,
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
  Wand2,
} from "lucide-react";

interface ModeSelectorProps {
  selectedMode: AiModeId;
  onModeChange: (modeId: AiModeId) => void;
  modes: AiMode[];
}

const modeIcons: Record<AiModeId, LucideIcon> = {
  general: Sparkles,
  fixgrammar: SpellCheck2,
  formalize: Briefcase,
  analyzeTimeComplexity: Binary,
  explainCodeStepByStep: Milestone,
  suggestDesignPattern: Library,
  gitAssistant: GithubIcon,
  commitMessageFormatter: MessageCircle,
  improvePrompt: Lightbulb,
};

export function ModeSelector({
  selectedMode,
  onModeChange,
  modes,
}: ModeSelectorProps) {
  return (
    <Select
      value={selectedMode}
      onValueChange={(value) => onModeChange(value as AiModeId)}
    >
      <SelectTrigger
        className="w-auto min-w-[140px] shrink-0 md:min-w-[160px] h-8 text-xs border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/30 transition-colors"
        id="mode-selector"
      >
        <div className="flex items-center gap-1.5">
          <Wand2 className="h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="Select mode" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {modes.map((mode) => {
          const IconComponent = mode.icon || Sparkles;
          return (
            <SelectItem key={mode.id} value={mode.id} className="cursor-pointer">
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4 text-primary/70" />
                <span className="text-sm">{mode.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
