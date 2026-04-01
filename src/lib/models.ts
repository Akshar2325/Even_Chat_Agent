/**
 * Model Registry — Centralized configuration for all AI models.
 * Add or remove models from the AVAILABLE_MODELS array as needed.
 *
 * To add a new model:
 *   1. Add an entry to the AVAILABLE_MODELS array below.
 *   2. Set the correct `provider` ('gemini' or 'nvidia').
 *   3. Set `modelId` to the exact API model identifier.
 *   4. Set `supportsReasoning` to true if the model outputs <think> tags.
 *
 * To remove a model:
 *   Simply delete or comment out the entry.
 */

export type ModelProvider = 'gemini' | 'nvidia';

export interface AIModel {
  id: string;
  name: string;
  provider: ModelProvider;
  modelId: string;           // Actual model identifier for API calls
  supportsReasoning: boolean;
  description: string;
  icon: string;              // Emoji icon for the model
}

export const AVAILABLE_MODELS: AIModel[] = [
  // ─────────────────────────────────────────────────────────────────
  // NVIDIA NIM Models (via OpenAI-compatible API)
  // Docs: https://build.nvidia.com/models
  // ─────────────────────────────────────────────────────────────────
  {
    id: 'nvidia-nemotron-ultra-253b',
    name: 'Nemotron Ultra 253B',
    provider: 'nvidia',
    modelId: 'nvidia/llama-3.1-nemotron-ultra-253b-v1',
    supportsReasoning: true,
    description: 'NVIDIA flagship, 253B params, reasoning',
    icon: '🟢',
  },
  {
    id: 'nvidia-nemotron-3-super-120b',
    name: 'Nemotron 3 Super 120B',
    provider: 'nvidia',
    modelId: 'nvidia/nemotron-3-super-120b-a12b',
    supportsReasoning: true,
    description: 'Hybrid Mamba-Transformer MoE, 1M context',
    icon: '🔋',
  },
  {
    id: 'nvidia-deepseek-r1',
    name: 'DeepSeek R1',
    provider: 'nvidia',
    modelId: 'deepseek-ai/deepseek-r1',
    supportsReasoning: true,
    description: 'Reasoning-focused, math & coding expert',
    icon: '🔍',
  },
  {
    id: 'nvidia-qwen-3.5-122b',
    name: 'Qwen 3.5 122B',
    provider: 'nvidia',
    modelId: 'qwen/qwen3.5-122b-a10b',
    supportsReasoning: true,
    description: '122B MoE, coding & reasoning, agent-ready',
    icon: '🤖',
  },
  {
    id: 'nvidia-minimax-m2.5',
    name: 'MiniMax M2.5',
    provider: 'nvidia',
    modelId: 'minimaxai/minimax-m2.5',
    supportsReasoning: true,
    description: '230B params, coding, reasoning & office tasks',
    icon: '🧩',
  },
  {
    id: 'nvidia-kimi-k2.5',
    name: 'Kimi K2.5',
    provider: 'nvidia',
    modelId: 'moonshotai/kimi-k2.5',
    supportsReasoning: false,
    description: '1T multimodal MoE by Moonshot AI',
    icon: '🌙',
  },
  {
    id: 'nvidia-mistral-small-119b',
    name: 'Mistral Small 4 119B',
    provider: 'nvidia',
    modelId: 'mistralai/mistral-small-4-119b-2603',
    supportsReasoning: true,
    description: 'Hybrid MoE, instruct + reasoning, 256k ctx',
    icon: '🔶',
  },
  {
    id: 'nvidia-meta-llama-3.3-70b',
    name: 'Meta Llama 3.3 70B',
    provider: 'nvidia',
    modelId: 'meta/llama-3.3-70b-instruct',
    supportsReasoning: false,
    description: 'Meta\'s latest 70B instruct model',
    icon: '🦙',
  },
];

export const DEFAULT_MODEL_ID = 'nvidia-nemotron-3-super-120b';

export function getModelById(id: string): AIModel | undefined {
  return AVAILABLE_MODELS.find((m) => m.id === id);
}

export function getModelsByProvider(provider: ModelProvider): AIModel[] {
  return AVAILABLE_MODELS.filter((m) => m.provider === provider);
}
