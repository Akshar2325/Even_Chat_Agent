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
      <DialogContent className="w-[90vw] max-w-md mx-auto p-4 sm:p-6 max-h-[85vh] overflow-y-auto">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-lg sm:text-xl">
            Understanding Modes
          </DialogTitle>
          <DialogDescription className="text-sm">
            Choose a mode to tailor the AI's response to your needs.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:py-4">
          {modes.map((mode) => (
            <div
              key={mode.id}
              className="grid grid-cols-[auto_1fr] items-start gap-2 sm:gap-3 pb-2 border-b last:border-b-0"
            >
              <div className="flex justify-center items-center w-8 h-8">
                {mode.icon &&
                  React.createElement(mode.icon, {
                    className: "h-5 w-5 text-primary",
                  })}
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">
                  {mode.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {mode.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
