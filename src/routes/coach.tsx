import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useRef, useState } from "react";
import { AiChat } from "@/components/ai-chat";
import { AacBoard } from "@/components/aac-board";
import { AslCards } from "@/components/asl-cards";
import { MoodSelector } from "@/components/mood-selector";
import { MessageSquare, Hand, LayoutGrid, Heart, ChevronUp, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "Communication Coach — Bloom" },
      { name: "description", content: "Practice talking, ASL, and AAC with interactive tools designed for you." },
      { property: "og:title", content: "Communication Coach — Bloom" },
    ],
  }),
  component: Coach,
});

type Mode = "talking" | "asl" | "aac";

const MODES: {
  id: Mode;
  label: string;
  icon: typeof MessageSquare;
  subtitle: string;
  starters: string[];
}[] = [
  {
    id: "talking",
    label: "Talking",
    icon: MessageSquare,
    subtitle: "Practice short scripts and social phrases.",
    starters: [
      "Help me ask for a break at school",
      "How do I say hi to a new friend?",
      "I want to order food at a restaurant",
      "What can I say if I feel frustrated?",
    ],
  },
  {
    id: "asl",
    label: "ASL Signs",
    icon: Hand,
    subtitle: "Tap a sign card to learn it step by step.",
    starters: [
      "Teach me more signs for greetings",
      "How do I sign 'I need help'?",
      "Show me signs for feelings",
      "How do I sign 'I love you'?",
    ],
  },
  {
    id: "aac",
    label: "AAC Board",
    icon: LayoutGrid,
    subtitle: "Tap words to build a sentence, then send it to the coach.",
    starters: [
      "Help me practice AAC greetings",
      "Suggest core words for asking for help",
      "How do I model AAC at dinner?",
      "Practice short sentences on AAC",
    ],
  },
];

function Coach() {
  const [mode, setMode] = useState<Mode>("talking");
  const [showTools, setShowTools] = useState(false);
  const sendRef = useRef<((text: string) => void) | null>(null);
  const active = MODES.find((m) => m.id === mode)!;

  const handleReady = useCallback((send: (text: string) => void) => {
    sendRef.current = send;
  }, []);

  const handleSend = useCallback((text: string) => {
    sendRef.current?.(text);
  }, []);

  const renderTools = () => {
    if (mode === "aac") return <AacBoard onSend={handleSend} />;
    if (mode === "asl") return <AslCards onSend={handleSend} />;
    if (mode === "talking") return <MoodSelector onSend={handleSend} />;
    return null;
  };

  const toolLabel = mode === "aac" ? "AAC Word Board" : mode === "asl" ? "Sign Library" : "How are you feeling?";
  const ToolIcon = mode === "aac" ? LayoutGrid : mode === "asl" ? Hand : Heart;

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full flex-col">
      <div className="border-b border-border/60 px-4 pt-3 pb-3" role="tablist" aria-label="Communication mode">
        <div className="flex flex-wrap gap-2">
          {MODES.map((m) => {
            const Icon = m.icon;
            const isActive = m.id === mode;
            return (
              <button
                key={m.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  setMode(m.id);
                  setShowTools(false);
                }}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted text-muted-foreground hover:bg-muted/70"
                }`}
              >
                <Icon className="h-4 w-4" />
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1">
        <AiChat
          key={mode}
          assistant="coach"
          title={`Communication Coach · ${active.label}`}
          subtitle={active.subtitle}
          emptyTitle="What would you like to practice?"
          emptyHint="The coach will suggest phrases you might want to say next, based on your messages and mood."
          starterPrompts={active.starters}
          accentClass="from-accent/20 via-primary/15 to-secondary/20"
          onReady={handleReady}
          interactivePanel={
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowTools((s) => !s)}
                className="flex items-center justify-between rounded-xl bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent/10"
                aria-expanded={showTools}
                aria-controls="coach-tools-panel"
              >
                <span className="flex items-center gap-2">
                  <ToolIcon className="h-4 w-4 text-primary" />
                  {toolLabel}
                </span>
                {showTools ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
              </button>
              {showTools && (
                <div id="coach-tools-panel" className="rounded-xl bg-background p-3">
                  {renderTools()}
                </div>
              )}
            </div>
          }
        />
      </div>
    </div>
  );
}
