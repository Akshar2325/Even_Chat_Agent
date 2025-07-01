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
} from "lucide-react";

interface ModeSelectorProps {
  selectedMode: AiModeId;
  onModeChange: (modeId: AiModeId) => void;
  modes: AiMode[];
}

const modeIcons: Record<AiModeId, LucideIcon> = {
  general: Sparkles,
  fixgrammar: SpellCheck2,
  summarize: BookText,
  formalize: Briefcase,
  fixCode: Wrench,
  optimizeCode: Zap,
  lintCode: ScanLine,
  explainCodeStepByStep: Milestone,
  analyzeTimeComplexity: Binary,
  suggestDesignPattern: Library,
  translateCode: Languages,
  generatePseudocode: FileText,
  suggestDockerfile: Container,
  gitAssistant: GithubIcon,
  commitMessageFormatter: MessageCircle,
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
      <SelectTrigger className="w-auto min-w-[160px] shrink-0 md:min-w-[180px]">
        {/*
          The SelectValue component renders the content of the selected SelectItem.
          Our SelectItem already contains a div with an icon and the mode name.
          So, we don't need to explicitly render the icon here again.
          It will render the children of the selected SelectItem by default.
        */}
        <SelectValue placeholder="Select mode" />
      </SelectTrigger>
      <SelectContent>
        {modes.map((mode) => {
          // The icon here comes from AVAILABLE_MODES which is passed as props.
          // This ensures consistency with the list.
          const IconComponent = mode.icon || Sparkles;
          return (
            <SelectItem key={mode.id} value={mode.id}>
              <div className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                <span>{mode.name}</span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
