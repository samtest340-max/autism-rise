import { useState } from "react";
import { Hand, ArrowRight, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type AslSign = {
  id: string;
  word: string;
  emoji: string;
  handshape: string;
  location: string;
  movement: string;
  palm: string;
  tip?: string;
};

const ASL_SIGNS: AslSign[] = [
  {
    id: "hello",
    word: "Hello",
    emoji: "👋",
    handshape: "Open hand (like a wave), fingers spread and relaxed",
    location: "Near your forehead, just above your eyebrow",
    movement: "Move your hand away from your forehead in a small wave",
    palm: "Palm facing the person you are greeting",
    tip: "It is just like saluting, but with a friendly wave at the end!",
  },
  {
    id: "thank-you",
    word: "Thank You",
    emoji: "🙏",
    handshape: "Flat hand, fingers together, thumb sticking out a bit",
    location: "Touch your chin with your fingertips",
    movement: "Move your hand forward and slightly down toward the person",
    palm: "Palm facing you at the start, turning toward them as you move",
    tip: "Think of it like giving your thanks from your heart to them.",
  },
  {
    id: "please",
    word: "Please",
    emoji: "🥺",
    handshape: "Flat open hand, fingers together",
    location: "Center of your chest",
    movement: "Make small circles on your chest with your flat hand",
    palm: "Palm facing your chest",
    tip: "Circle clockwise (like polishing a heart).",
  },
  {
    id: "help",
    word: "Help",
    emoji: "🤝",
    handshape: "Thumbs-up fist on your flat palm",
    location: "Both hands in front of your chest",
    movement: "Lift both hands up together toward the sky",
    palm: "The flat palm faces up, the fist rests on it",
    tip: "Like you are lifting something up and offering it!",
  },
  {
    id: "more",
    word: "More",
    emoji: "➕",
    handshape: "Both hands make an O shape (fingers touching thumbs)",
    location: "In front of your chest",
    movement: "Tap your fingertips together a few times",
    palm: "Fingertips facing each other",
    tip: "Like you are squishing something small between your fingers.",
  },
  {
    id: "yes",
    word: "Yes",
    emoji: "✅",
    handshape: "Make a fist (like nodding with your hand)",
    location: "In front of your shoulder",
    movement: "Move your fist up and down, like a head nodding",
    palm: "Palm faces you",
    tip: "Your hand is nodding just like your head does!",
  },
  {
    id: "no",
    word: "No",
    emoji: "❌",
    handshape: "Index and middle finger out (like a peace sign), thumb tucked",
    location: "Near your chin",
    movement: "Snap your fingers down past your chin, like a head shaking",
    palm: "Palm faces you, fingers point up",
    tip: "Like your fingers are saying no way!",
  },
  {
    id: "mom",
    word: "Mom",
    emoji: "👩",
    handshape: "Open hand, thumb sticking out",
    location: "Tap your thumb on your chin",
    movement: "Just a small tap, no big movement needed",
    palm: "Palm faces you",
    tip: "Chin = Mom, forehead = Dad. Tap your thumb there!",
  },
  {
    id: "dad",
    word: "Dad",
    emoji: "👨",
    handshape: "Open hand, thumb sticking out",
    location: "Tap your thumb on your forehead",
    movement: "Just a small tap, no big movement needed",
    palm: "Palm faces you",
    tip: "Forehead = Dad, chin = Mom. Same shape, different spot!",
  },
];

export function AslCards({ onSend }: { onSend: (text: string) => void }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ASL_SIGNS.find((s) => s.id === selectedId) ?? null;

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  if (selected) {
    return (
      <div className="flex flex-col gap-3">
        <Button variant="ghost" size="sm" onClick={() => setSelectedId(null)} className="w-fit">
          ← Back to all signs
        </Button>

        <div className="rounded-2xl border border-border/60 bg-card p-5">
          <div className="flex items-center gap-3">
            <span className="text-5xl" aria-hidden>{selected.emoji}</span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold">{selected.word}</h3>
              <p className="text-sm text-muted-foreground">How to sign "{selected.word}"</p>
            </div>
            <Button variant="outline" size="icon" onClick={() => speak(selected.word)} aria-label={`Hear ${selected.word}`}>
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 space-y-3">
            <Step label="Handshape" value={selected.handshape} />
            <Step label="Location" value={selected.location} />
            <Step label="Movement" value={selected.movement} />
            <Step label="Palm" value={selected.palm} />
          </div>

          {selected.tip && (
            <div className="mt-4 rounded-xl bg-warm/30 p-3 text-sm">
              <span className="font-semibold">Tip: </span>
              {selected.tip}
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="outline"
              onClick={() => {
                const idx = ASL_SIGNS.findIndex((s) => s.id === selectedId);
                const nextIdx = (idx + 1) % ASL_SIGNS.length;
                setSelectedId(ASL_SIGNS[nextIdx].id);
              }}
            >
              Next sign <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              onClick={() =>
                onSend(`I just learned how to sign "${selected.word}"! Can we practice it together?`)
              }
            >
              Practice with coach
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground">Tap a sign to see how to make it step by step.</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {ASL_SIGNS.map((sign) => (
          <button
            key={sign.id}
            onClick={() => setSelectedId(sign.id)}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-border/40 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95"
            aria-label={`Learn sign for ${sign.word}`}
          >
            <span className="text-4xl" aria-hidden>{sign.emoji}</span>
            <span className="flex items-center gap-1 text-sm font-medium">
              <Hand className="h-3.5 w-3.5 text-primary" />
              {sign.word}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
        {label[0]}
      </div>
      <div>
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</span>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
