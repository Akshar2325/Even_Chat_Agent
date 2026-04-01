"use server";

import type { AiModeId } from "@/lib/types";
import { streamNvidiaModel } from "@/ai/nvidia-client";
import { DEFAULT_MODEL_ID, getModelById } from "@/lib/models";
import { getSystemPrompt } from "@/lib/prompts";

export type AiModifier = "retry" | "details" | "concise";

export async function handleAiInteractionStream(
  userInput: string,
  mode: AiModeId,
  modelId: string = DEFAULT_MODEL_ID,
  modifier?: AiModifier
): Promise<AsyncGenerator<string, void, unknown>> {
  try {
    let systemPrompt = getSystemPrompt(mode);
    
    if (modifier === "details") {
      systemPrompt += "\n\nCRITICAL INSTRUCTION: The user has requested ADDED DETAILS for this retry. Expand your explanation significantly, dive deeper into technical specifics, provide more comprehensive reasoning, and include extensive examples.";
    } else if (modifier === "concise") {
      systemPrompt += "\n\nCRITICAL INSTRUCTION: The user has requested a MORE CONCISE response for this retry. Cut out all fluff, conversational filler, and overly verbose explanations. Get straight to the absolute core answer, maintaining technical accuracy while keeping it as brief and direct as possible.";
    }

    const model = getModelById(modelId);
    if (!model) {
      throw new Error(`Model with id ${modelId} not found`);
    }
    return streamNvidiaModel(model.modelId, systemPrompt, userInput);
  } catch (error) {
    console.error("AI interaction error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    throw new Error(`AI processing failed: ${errorMessage}`);
  }
}
