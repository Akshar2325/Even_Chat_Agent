
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
import { Briefcase, BookText, SpellCheck2, Sparkles, type LucideIcon } from "lucide-react";

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
};

export function ModeSelector({ selectedMode, onModeChange, modes }: ModeSelectorProps) {
  return (
    <Select value={selectedMode} onValueChange={(value) => onModeChange(value as AiModeId)}>
      <SelectTrigger className="w-auto min-w-[160px] shrink-0 md:min-w-[180px]">
        {/*
          The SelectValue component renders the content of the selected SelectItem.
          Our SelectItem already contains a div with an icon and the mode name.
          So, we don't need to explicitly render the icon here again.
        */}
        <SelectValue placeholder="Select mode" />
      </SelectTrigger>
      <SelectContent>
        {modes.map((mode) => {
          const IconComponent = modeIcons[mode.id] || Sparkles;
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

