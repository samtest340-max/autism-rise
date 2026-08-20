import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Calendar, Trophy, MessageCircleHeart, Hand, TrendingUp, Sun } from "lucide-react";
import { useWords } from "@/components/theme-provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Bloom" },
      {
        name: "description",
        content: "Big, easy buttons for sensory tools, your routine, rewards, progress, and two friendly AI helpers.",
      },
      { property: "og:title", content: "Today — Bloom" },
      {
        property: "og:description",
        content: "Big, easy buttons for sensory tools, your routine, rewards, progress, and two friendly AI helpers.",
      },
    ],
  }),
  component: Index,
});

type Tile = {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  title: string;
  simple: string;
  standard: string;
  tone: string;
};

const TILES: Tile[] = [
  {
    to: "/sensory",
    icon: Sparkles,
    emoji: "🫧",
    title: "Calm Down",
    simple: "Breathe. Soft sounds. Pop bubbles.",
    standard: "Breathing, calming sounds, and fidget tools.",
    tone: "bg-primary/15 hover:bg-primary/25",
  },
  {
    to: "/routine",
    icon: Calendar,
    emoji: "🗓️",
    title: "My Day",
    simple: "See what happens next.",
    standard: "Your visual schedule for today.",
    tone: "bg-secondary/25 hover:bg-secondary/40",
  },
  {
    to: "/coach",
    icon: Hand,
    emoji: "🙌",
    title: "Let's Talk",
    simple: "Words, signs, and picture boards.",
    standard: "Practice talking, ASL signs, and AAC boards.",
    tone: "bg-accent/25 hover:bg-accent/40",
  },
  {
    to: "/journey",
    icon: MessageCircleHeart,
    emoji: "💜",
    title: "My Buddy",
    simple: "Chat about your day.",
    standard: "Bloom reflects on how far you've come.",
    tone: "bg-warm/30 hover:bg-warm/45",
  },
  {
    to: "/rewards",
    icon: Trophy,
    emoji: "⭐",
    title: "My Stars",
    simple: "See the stars you won.",
    standard: "Quests, stars, and rewards you've earned.",
    tone: "bg-warm/25 hover:bg-warm/40",
  },
  {
    to: "/progress",
    icon: TrendingUp,
    emoji: "📈",
    title: "My Wins",
    simple: "Look how far you came.",
    standard: "Progress for you and a parent view.",
    tone: "bg-success/15 hover:bg-success/25",
  },
];

function Index() {
  const w = useWords();

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 p-4 sm:p-6">
      <section className="rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 p-6 sm:p-8">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sun className="h-4 w-4" aria-hidden /> {w("Good morning", "Good morning")}
        </p>
        <h1 className="mt-2 text-3xl font-bold sm:text-4xl">{w("Hi friend 👋", "Hi friend — let's have a gentle day.")}</h1>
        <p className="mt-2 max-w-xl text-base text-foreground/80 sm:text-lg">
          {w("You did your routine 5 days in a row. That is great.", "You've kept your routine going 5 days in a row — that's something to be proud of.")}
        </p>
      </section>

      <section aria-labelledby="pick-heading">
        <h2 id="pick-heading" className="mb-4 text-xl font-semibold">
          {w("What do you want to do?", "What would you like to do?")}
        </h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((tile) => (
            <li key={tile.to}>
              <Link
                to={tile.to}
                className={`flex min-h-44 flex-col items-center justify-center gap-2 rounded-3xl border-2 border-border/50 p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/50 active:scale-95 ${tile.tone}`}
              >
                <span className="text-5xl" aria-hidden>
                  {tile.emoji}
                </span>
                <span className="flex items-center gap-2 text-xl font-bold">
                  <tile.icon className="h-5 w-5" aria-hidden />
                  {tile.title}
                </span>
                <span className="text-sm text-foreground/70">{w(tile.simple, tile.standard)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
