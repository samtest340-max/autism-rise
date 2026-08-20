import { cn } from "@/lib/utils";

type Mood = {
  id: string;
  label: string;
  emoji: string;
  color: string;
};

const MOODS: Mood[] = [
  { id: "happy", label: "Happy", emoji: "😊", color: "bg-success/20 hover:bg-success/35" },
  { id: "calm", label: "Calm", emoji: "😌", color: "bg-primary/20 hover:bg-primary/35" },
  { id: "excited", label: "Excited", emoji: "🤩", color: "bg-warm/30 hover:bg-warm/50" },
  { id: "sad", label: "Sad", emoji: "😢", color: "bg-accent/20 hover:bg-accent/40" },
  { id: "frustrated", label: "Frustrated", emoji: "😠", color: "bg-destructive/15 hover:bg-destructive/25" },
  { id: "worried", label: "Worried", emoji: "😨", color: "bg-secondary/30 hover:bg-secondary/50" },
  { id: "tired", label: "Tired", emoji: "😴", color: "bg-muted hover:bg-muted/70" },
  { id: "confused", label: "Confused", emoji: "😕", color: "bg-accent/15 hover:bg-accent/30" },
];

export function MoodSelector({ onSend }: { onSend: (moodLabel: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">
        How are you feeling right now? Tap one to tell the coach.
      </p>
      <div className="grid grid-cols-4 gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => onSend(`I am feeling ${mood.label.toLowerCase()} right now.`)}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-border/40 p-3 transition-all active:scale-95",
              mood.color,
            )}
            aria-label={`Tell coach I am feeling ${mood.label}`}
          >
            <span className="text-3xl" aria-hidden>{mood.emoji}</span>
            <span className="text-xs font-medium">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
