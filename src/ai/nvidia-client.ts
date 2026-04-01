"use server";

import OpenAI from "openai";

let nvidiaClient: OpenAI | null = null;

function getNvidiaClient(): OpenAI {
  if (!nvidiaClient) {
    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey || apiKey === "your_nvidia_api_key_here") {
      throw new Error(
        "NVIDIA_API_KEY is not configured. Please add your NVIDIA API key to .env file.",
      );
    }
    nvidiaClient = new OpenAI({
      baseURL: "https://integrate.api.nvidia.com/v1",
      apiKey: apiKey,
    });
  }
  return nvidiaClient;
}

/**
 * Stream an NVIDIA model via OpenAI-compatible API.
 */
export async function* streamNvidiaModel(
  modelId: string,
  systemPrompt: string,
  userMessage: string,
): AsyncGenerator<string, void, unknown> {
  const client = getNvidiaClient();

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userMessage },
  ];

  const stream = await client.chat.completions.create({
    model: modelId,
    messages,
    temperature: 0.7,
    max_tokens: 4096,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content;
    if (content) {
      yield content;
    }
  }
}
