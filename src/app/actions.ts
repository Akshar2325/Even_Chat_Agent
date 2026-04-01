"use server";

import type { AiModeId } from "@/lib/types";
import { streamNvidiaModel } from "@/ai/nvidia-client";
import { DEFAULT_MODEL_ID, getModelById } from "@/lib/models";
import { getSystemPrompt } from "@/lib/prompts";

export async function handleAiInteractionStream(
  userInput: string,
  mode: AiModeId,
  modelId: string = DEFAULT_MODEL_ID,
): Promise<AsyncGenerator<string, void, unknown>> {
  try {
    const systemPrompt = getSystemPrompt(mode);
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
