import { useState } from "react";
import { cn } from "@/lib/utils";
import { Trash2, Volume2, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type AacWord = { word: string; emoji: string };

type AacCategory = {
  id: string;
  label: string;
  color: string;
  words: AacWord[];
};

const AAC_CATEGORIES: AacCategory[] = [
  {
    id: "feelings",
    label: "Feelings",
    color: "bg-accent/30 hover:bg-accent/50",
    words: [
      { word: "happy", emoji: "😊" },
      { word: "sad", emoji: "😢" },
      { word: "frustrated", emoji: "😠" },
      { word: "scared", emoji: "😨" },
      { word: "calm", emoji: "😌" },
      { word: "excited", emoji: "🤩" },
      { word: "tired", emoji: "😴" },
      { word: "confused", emoji: "😕" },
    ],
  },
  {
    id: "needs",
    label: "I need",
    color: "bg-primary/20 hover:bg-primary/35",
    words: [
      { word: "I want", emoji: "🙋" },
      { word: "help", emoji: "🤝" },
      { word: "break", emoji: "⏸️" },
      { word: "water", emoji: "💧" },
      { word: "food", emoji: "🍎" },
      { word: "bathroom", emoji: "🚻" },
      { word: "hug", emoji: "🤗" },
      { word: "quiet", emoji: "🤫" },
    ],
  },
  {
    id: "people",
    label: "People",
    color: "bg-secondary/30 hover:bg-secondary/50",
    words: [
      { word: "mom", emoji: "👩" },
      { word: "dad", emoji: "👨" },
      { word: "friend", emoji: "🧑" },
      { word: "teacher", emoji: "🧑‍🏫" },
      { word: "doctor", emoji: "🩺" },
      { word: "me", emoji: "🙋" },
      { word: "you", emoji: "👉" },
      { word: "family", emoji: "👨‍👩‍👧" },
    ],
  },
  {
    id: "actions",
    label: "Actions",
    color: "bg-warm/30 hover:bg-warm/50",
    words: [
      { word: "go", emoji: "🏃" },
      { word: "stop", emoji: "✋" },
      { word: "play", emoji: "🎮" },
      { word: "eat", emoji: "🍽️" },
      { word: "sleep", emoji: "🛏️" },
      { word: "read", emoji: "📖" },
      { word: "listen", emoji: "👂" },
      { word: "look", emoji: "👀" },
    ],
  },
  {
    id: "social",
    label: "Social",
    color: "bg-accent/20 hover:bg-accent/40",
    words: [
      { word: "hello", emoji: "👋" },
      { word: "bye", emoji: "👋" },
      { word: "thank you", emoji: "🙏" },
      { word: "please", emoji: "🥺" },
      { word: "sorry", emoji: "💙" },
      { word: "yes", emoji: "✅" },
      { word: "no", emoji: "❌" },
      { word: "more", emoji: "➕" },
    ],
  },
  {
    id: "things",
    label: "Things",
    color: "bg-primary/15 hover:bg-primary/30",
    words: [
      { word: "book", emoji: "📚" },
      { word: "toy", emoji: "🧸" },
      { word: "phone", emoji: "📱" },
      { word: "music", emoji: "🎵" },
      { word: "blanket", emoji: "🛌" },
      { word: "snack", emoji: "🍪" },
      { word: "outside", emoji: "🌳" },
      { word: "home", emoji: "🏠" },
    ],
  },
];

export function AacBoard({ onSend }: { onSend: (text: string) => void }) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [sentence, setSentence] = useState<AacWord[]>([]);

  const category = AAC_CATEGORIES[activeCategory];

  const addWord = (word: string, emoji: string) => {
    setSentence((prev) => [...prev, { word, emoji }]);
  };

  const removeLast = () => setSentence((prev) => prev.slice(0, -1));
  const clearAll = () => setSentence([]);

  const sentenceText = sentence.map((s) => s.word).join(" ");

  const speak = (text: string) => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    }
  };

  const handleSend = () => {
    if (!sentenceText.trim()) return;
    onSend(sentenceText);
    clearAll();
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-3 min-h-[64px]">
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
          {sentence.length === 0 ? (
            <span className="text-sm text-muted-foreground">Tap words below to build a sentence…</span>
          ) : (
            sentence.map((s, i) => (
              <button
                key={i}
                onClick={() => setSentence((prev) => prev.filter((_, idx) => idx !== i))}
                className="flex items-center gap-1 rounded-xl bg-primary/15 px-3 py-2 text-base font-medium transition-colors hover:bg-primary/25"
                aria-label={`Remove ${s.word}`}
              >
                <span className="text-xl" aria-hidden>{s.emoji}</span>
                <span>{s.word}</span>
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            ))
          )}
        </div>
        {sentence.length > 0 && (
          <Button size="icon" variant="ghost" onClick={removeLast} aria-label="Remove last word" className="shrink-0">
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
        {sentence.length > 0 && (
          <Button size="icon" variant="ghost" onClick={() => speak(sentenceText)} aria-label="Speak sentence" className="shrink-0">
            <Volume2 className="h-4 w-4" />
          </Button>
        )}
        <Button onClick={handleSend} disabled={!sentenceText.trim()} className="shrink-0" aria-label="Send to coach">
          <Send className="h-4 w-4" />
          Send
        </Button>
      </div>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="AAC categories">
        {AAC_CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={i === activeCategory}
            onClick={() => setActiveCategory(i)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-all",
              i === activeCategory
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/70",
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {category.words.map((w) => (
          <button
            key={w.word}
            onClick={() => addWord(w.word, w.emoji)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 rounded-2xl border border-border/40 p-3 transition-all active:scale-95",
              category.color,
            )}
            aria-label={`Add word: ${w.word}`}
          >
            <span className="text-3xl" aria-hidden>{w.emoji}</span>
            <span className="text-sm font-medium">{w.word}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
