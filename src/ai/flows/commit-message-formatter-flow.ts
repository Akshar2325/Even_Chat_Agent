"use server";
/**
 * @fileOverview An AI agent for formatting raw commit descriptions into proper Conventional Commit messages.
 *
 * - commitMessageFormatter - A function that formats commit messages according to Conventional Commits standard.
 * - CommitMessageFormatterInput - The input type.
 * - CommitMessageFormatterOutput - The output type.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";

const CommitMessageFormatterInputSchema = z.object({
  rawDescription: z
    .string()
    .describe("A raw, unformatted developer commit description."),
});
export type CommitMessageFormatterInput = z.infer<
  typeof CommitMessageFormatterInputSchema
>;

const CommitMessageFormatterOutputSchema = z.object({
  formattedMessage: z
    .string()
    .describe("A properly structured Conventional Commit message."),
});
export type CommitMessageFormatterOutput = z.infer<
  typeof CommitMessageFormatterOutputSchema
>;

export async function commitMessageFormatter(
  input: CommitMessageFormatterInput
): Promise<CommitMessageFormatterOutput> {
  return commitMessageFormatterFlow(input);
}

const prompt = ai.definePrompt({
  name: "commitMessageFormatterPrompt",
  input: { schema: CommitMessageFormatterInputSchema },
  output: { schema: CommitMessageFormatterOutputSchema },
  prompt: `You are a commit message formatter assistant.
Your job is to take raw, unformatted developer commit descriptions and return a properly structured Conventional Commit message.
Follow these rules strictly:

## 🧩 Commit Type Rules:
Use one of the following types based on the nature of the change:
- feat: for **new features**
- fix: for **bug fixes**
- refactor: for **code refactoring** that does not add a feature or fix a bug
- chore: for **non-functional changes** like build scripts, configs, version bumps, or infrastructure
- style: for **code style changes** (e.g., whitespace, formatting, missing semicolons, linting) that do not affect code behavior
- docs: for **documentation-only changes**
- test: for **adding or updating tests** (unit, integration, etc.)
- perf: for **performance improvements**
- ci: for changes to **CI/CD configurations or pipelines**
- build: for **build-related changes**, like bundlers, compilers, or output generation

## 📝 Formatting Guidelines:
1. Start with the type in lowercase, followed by a colon and a single space.
2. The message should be short, concise, and written in **imperative mood** (e.g., "fix crash issue", not "fixed" or "fixes").
3. Do not include trailing punctuation (e.g., no periods).
4. Do not include Git-specific syntax (e.g., no \`git commit -m\` or hashtags).
5. Keep it to one line (under 72 characters), unless extended body is required (optional).
6. If no commit message makes sense from the input, respond with: \`Invalid input. Please provide a meaningful description of the code change.\`

## ✅ Examples:
Input: added user onboarding flow
Output: feat: add user onboarding flow

Input: fixed broken layout on mobile
Output: fix: fix mobile layout issues

Input: removed unused import and reformatted code
Output: style: clean up unused imports and apply formatting

Input: updated Prisma version and changed Dockerfile
Output: chore: update Prisma version and modify Dockerfile

Input: improved SQL query performance
Output: perf: optimize SQL query performance

Input: setup GitHub Actions for tests
Output: ci: configure GitHub Actions for running tests

Input: added integration tests for churn rate
Output: test: add integration tests for churn rate logic

Input: wrote documentation for API endpoints
Output: docs: update API endpoint documentation

Input: converted build system from webpack to Vite
Output: build: migrate build system from webpack to Vite

Input: fixed type error in VenueChurnRateService
Output: fix: resolve type error in VenueChurnRateService

## 🎯 Your Job:
Given a raw input like:
"fixed spacing, added missing semicolons, removed unused vars"
Return the correct commit message:
"style: fix spacing, semicolons, and remove unused variables"

Raw commit description: {{{rawDescription}}}`,
});

const commitMessageFormatterFlow = ai.defineFlow(
  {
    name: "commitMessageFormatterFlow",
    inputSchema: CommitMessageFormatterInputSchema,
    outputSchema: CommitMessageFormatterOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
