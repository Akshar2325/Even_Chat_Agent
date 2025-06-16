
"use client";

import * as React from "react";
import type { AiMode } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

interface ModeExplanationDialogProps {
  modes: AiMode[];
}

export function ModeExplanationDialog({ modes }: ModeExplanationDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Explain modes">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Understanding Modes</DialogTitle>
          <DialogDescription>
            Choose a mode to tailor the AI's response to your needs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {modes.map((mode) => (
            <div key={mode.id} className="grid grid-cols-[auto_1fr] items-start gap-3">
              {mode.icon && React.createElement(mode.icon, { className: "h-5 w-5 mt-1 text-primary" })}
              {!mode.icon && <div className="h-5 w-5 mt-1"></div>}
              <div>
                <h3 className="font-semibold">{mode.name}</h3>
                <p className="text-sm text-muted-foreground">{mode.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
