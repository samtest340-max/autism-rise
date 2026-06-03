import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AiChat } from "@/components/ai-chat";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Communication Coach — Bloom" },
      { name: "description", content: "Practice talking, ASL, and AAC. The coach predicts what you might want to say." },
      { property: "og:title", content: "Communication Coach — Bloom" },
    ],
  }),
  component: Coach,
});

type Mode = "talking" | "asl" | "aac";

const MODES: { id: Mode; label: string; subtitle: string; starters: string[] }[] = [
  {
    id: "talking",
    label: "Talking",
    subtitle: "Practice short scripts and social phrases.",
    starters: [
      "Help me ask for a break at school",
      "How do I say hi to a new friend?",
      "I want to order food at a restaurant",
      "What can I say if I feel angry?",
    ],
  },
  {
    id: "asl",
    label: "ASL",
    subtitle: "Learn signs step by step (handshape · location · movement).",
    starters: [
      "Teach me how to sign 'hello'",
      "How do I sign 'I need help'?",
      "Show me family signs (mom, dad, sister)",
      "How do I sign 'thank you'?",
    ],
  },
  {
    id: "aac",
    label: "AAC",
    subtitle: "Core-vocabulary sequences and modeling tips.",
    starters: [
      "Build an AAC sentence for 'I want snack'",
      "Suggest core words for asking for help",
      "How do I model AAC at dinner?",
      "Practice greetings on AAC",
    ],
  },
];

function Coach() {
  const [mode, setMode] = useState<Mode>("talking");
  const active = MODES.find((m) => m.id === mode)!;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full flex-col">
      <div className="border-b border-border/60 px-6 pt-4">
        <div className="flex gap-2">
          {MODES.map((m) => (
            <Button
              key={m.id}
              variant={m.id === mode ? "default" : "ghost"}
              size="sm"
              onClick={() => setMode(m.id)}
              className="rounded-full"
            >
              {m.label}
            </Button>
          ))}
        </div>
      </div>
      <div className="flex-1">
        {/* Remount chat when mode changes so threads scope per mode. */}
        <AiChat
          key={mode}
          assistant="coach"
          title={`Communication Coach · ${active.label}`}
          subtitle={active.subtitle}
          emptyTitle="What would you like to practice?"
          emptyHint="The coach will suggest phrases you might want to say next, based on your messages and mood."
          starterPrompts={active.starters}
          accentClass="from-accent/20 via-primary/15 to-secondary/20"
        />
      </div>
    </div>
  );
}
