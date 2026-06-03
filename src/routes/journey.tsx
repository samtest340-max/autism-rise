import { createFileRoute } from "@tanstack/react-router";
import { AiChat } from "@/components/ai-chat";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "My Journey — Bloom" },
      { name: "description", content: "An AI companion that reflects on your progress and helps you set tiny next steps." },
      { property: "og:title", content: "My Journey — Bloom" },
    ],
  }),
  component: Journey,
});

function Journey() {
  return (
    <AiChat
      assistant="journey"
      title="My Journey"
      subtitle="Bloom reflects on how far you've come — and what tiny next step feels right."
      emptyTitle="Hi friend 💜"
      emptyHint="Tell me how today is going, or pick a question to start."
      starterPrompts={[
        "How am I doing this week?",
        "I feel overwhelmed right now",
        "Help me set a tiny goal",
        "Remind me of a recent win",
      ]}
      accentClass="from-primary/20 via-secondary/20 to-accent/20"
    />
  );
}
