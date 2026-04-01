"use client";

import * as React from "react";
import { AVAILABLE_MODELS, getModelsByProvider, type AIModel } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";

interface ModelSelectorProps {
  selectedModelId: string;
  onModelChange: (modelId: string) => void;
}

export function ModelSelector({
  selectedModelId,
  onModelChange,
}: ModelSelectorProps) {
  const geminiModels = getModelsByProvider('gemini');
  const nvidiaModels = getModelsByProvider('nvidia');
  const selectedModel = AVAILABLE_MODELS.find((m) => m.id === selectedModelId);

  return (
    <Select value={selectedModelId} onValueChange={onModelChange}>
      <SelectTrigger
        className="model-selector-trigger w-auto min-w-[160px] shrink-0 md:min-w-[200px] h-8 text-xs border-border/50 bg-background/50 backdrop-blur-sm hover:bg-accent/30 transition-colors"
        id="model-selector"
      >
        <div className="flex items-center gap-1.5">
          <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
          <SelectValue placeholder="Select model">
            {selectedModel && (
              <span className="flex items-center gap-1.5">
                <span>{selectedModel.icon}</span>
                <span className="truncate max-w-[120px]">{selectedModel.name}</span>
              </span>
            )}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="model-selector-content">
        {geminiModels.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-xs font-semibold text-primary/80 flex items-center gap-1.5 px-2">
              <span>✦</span> Google Gemini
            </SelectLabel>
            {geminiModels.map((model) => (
              <ModelOption key={model.id} model={model} />
            ))}
          </SelectGroup>
        )}
        {nvidiaModels.length > 0 && (
          <SelectGroup>
            <SelectLabel className="text-xs font-semibold text-green-500/80 flex items-center gap-1.5 px-2 mt-1">
              <span>◆</span> NVIDIA NIM
            </SelectLabel>
            {nvidiaModels.map((model) => (
              <ModelOption key={model.id} model={model} />
            ))}
          </SelectGroup>
        )}
      </SelectContent>
    </Select>
  );
}

function ModelOption({ model }: { model: AIModel }) {
  return (
    <SelectItem value={model.id} className="cursor-pointer">
      <div className="flex items-center gap-2 py-0.5">
        <span className="text-sm">{model.icon}</span>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium">{model.name}</span>
            {model.supportsReasoning && (
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 border-purple-500/50 text-purple-400 bg-purple-500/10"
              >
                reasoning
              </Badge>
            )}
          </div>
          <span className="text-[11px] text-muted-foreground">{model.description}</span>
        </div>
      </div>
    </SelectItem>
  );
}
