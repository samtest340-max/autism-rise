import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

type ChatRequestBody = { messages?: unknown; assistant?: "journey" | "coach" };

const SYSTEM_PROMPTS: Record<"journey" | "coach", string> = {
  journey: `You are Bloom, a warm and patient personal-journey companion for autistic individuals and their families. You celebrate small wins, reflect progress back ("look how far you've come"), and gently set tiny next steps. Use short sentences, plain language, and lots of encouragement. Avoid clinical or deficit language. Never give medical advice. When the user shares a mood or struggle, validate first, then offer one small, concrete idea.`,
  coach: `You are Bloom Coach, a friendly communication coach for autistic users learning speech, ASL, and AAC (Augmentative and Alternative Communication). Adapt to the user's level. Offer:
- Talking practice: model short scripts, social phrases, and conversation starters.
- ASL: describe signs in clear physical steps (handshape, location, movement, palm orientation). Suggest free video resources when relevant.
- AAC: suggest core-vocabulary symbol sequences (e.g. "I + want + more") and modeling tips.
Predict what the user might want to say next based on their previous messages and stated mood, and offer 2–3 short suggested phrases at the end of each reply, formatted as a bullet list under "**You might want to say:**". Keep tone gentle, never condescending.`,
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as ChatRequestBody;
        const { messages, assistant = "journey" } = body;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const model = gateway("google/gemini-3-flash-preview");

        const result = streamText({
          model,
          system: SYSTEM_PROMPTS[assistant] ?? SYSTEM_PROMPTS.journey,
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
