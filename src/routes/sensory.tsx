import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Waves, Droplets, Wind, Flame, Sparkles, Hand } from "lucide-react";

export const Route = createFileRoute("/sensory")({
  head: () => ({
    meta: [
      { title: "Sensory Tools — Bloom" },
      { name: "description", content: "Calming sensory tools: breathing visualizer, calm colors, white noise, and fidget play." },
      { property: "og:title", content: "Sensory Tools — Bloom" },
    ],
  }),
  component: Sensory,
});

function Sensory() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Sensory tools</h1>
        <p className="text-muted-foreground">
          Pick whatever feels good right now. You can use one tool or several together.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <BreathingCard />
        <CalmColorsCard />
        <SoundsCard />
        <FidgetCard />
      </div>
    </div>
  );
}

function BreathingCard() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<"in" | "hold" | "out">("in");

  useEffect(() => {
    if (!running) return;
    const cycle: { phase: "in" | "hold" | "out"; ms: number }[] = [
      { phase: "in", ms: 4000 },
      { phase: "hold", ms: 2000 },
      { phase: "out", ms: 6000 },
    ];
    let i = 0;
    setPhase(cycle[0].phase);
    const tick = () => {
      i = (i + 1) % cycle.length;
      setPhase(cycle[i].phase);
    };
    const id = window.setInterval(tick, cycle[0].ms);
    return () => window.clearInterval(id);
  }, [running]);

  const scale = phase === "in" ? "scale-100" : phase === "hold" ? "scale-100" : "scale-50";
  const label = phase === "in" ? "Breathe in" : phase === "hold" ? "Hold" : "Breathe out";

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wind className="h-5 w-5 text-primary" /> Breathing
        </CardTitle>
        <CardDescription>Follow the circle. In · hold · out.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
          <div
            className={`absolute h-56 w-56 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 transition-transform ease-in-out ${scale}`}
            style={{ transitionDuration: phase === "in" ? "4s" : phase === "out" ? "6s" : "0s" }}
            aria-hidden
          />
          <div className="relative text-center">
            <p className="text-2xl font-semibold">{label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{running ? "You're doing great" : "Tap start when ready"}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <Button onClick={() => setRunning((r) => !r)} variant={running ? "outline" : "default"}>
            {running ? <Pause className="mr-1.5 h-4 w-4" /> : <Play className="mr-1.5 h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = [
  { name: "Sage", from: "from-[oklch(0.86_0.06_160)]", to: "to-[oklch(0.78_0.07_160)]" },
  { name: "Sky", from: "from-[oklch(0.9_0.05_220)]", to: "to-[oklch(0.78_0.08_220)]" },
  { name: "Sunset", from: "from-[oklch(0.92_0.07_60)]", to: "to-[oklch(0.82_0.13_50)]" },
  { name: "Lavender", from: "from-[oklch(0.9_0.05_300)]", to: "to-[oklch(0.78_0.09_300)]" },
];

function CalmColorsCard() {
  const [idx, setIdx] = useState(0);
  const c = COLORS[idx];
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" /> Calm colors
        </CardTitle>
        <CardDescription>Soft gradients to settle your eyes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`h-56 rounded-2xl bg-gradient-to-br ${c.from} ${c.to} animate-in fade-in duration-500`} aria-label={`${c.name} gradient`} />
        <div className="mt-4 flex flex-wrap gap-2">
          {COLORS.map((color, i) => (
            <button
              key={color.name}
              onClick={() => setIdx(i)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                i === idx ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/70"
              }`}
            >
              {color.name}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

type SoundId = "rain" | "ocean" | "fire" | "white";
const SOUNDS: { id: SoundId; label: string; icon: React.ComponentType<{ className?: string }>; url: string }[] = [
  { id: "rain", label: "Rain", icon: Droplets, url: "https://cdn.pixabay.com/audio/2022/03/15/audio_db1bbf42b3.mp3" },
  { id: "ocean", label: "Ocean", icon: Waves, url: "https://cdn.pixabay.com/audio/2022/10/30/audio_347111d224.mp3" },
  { id: "fire", label: "Fireplace", icon: Flame, url: "https://cdn.pixabay.com/audio/2022/03/24/audio_07b2bf3a37.mp3" },
  { id: "white", label: "White noise", icon: Wind, url: "https://cdn.pixabay.com/audio/2022/03/10/audio_270f49b83a.mp3" },
];

function SoundsCard() {
  const [active, setActive] = useState<SoundId | null>(null);
  const [volume, setVolume] = useState(40);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  const play = (sound: (typeof SOUNDS)[number]) => {
    if (active === sound.id) {
      audioRef.current?.pause();
      setActive(null);
      return;
    }
    audioRef.current?.pause();
    const a = new Audio(sound.url);
    a.loop = true;
    a.volume = volume / 100;
    audioRef.current = a;
    a.play().catch(() => {});
    setActive(sound.id);
  };

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [volume]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="h-5 w-5 text-primary" /> Calming sounds
        </CardTitle>
        <CardDescription>Tap to play. Tap again to stop.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {SOUNDS.map((s) => {
            const on = active === s.id;
            return (
              <button
                key={s.id}
                onClick={() => play(s)}
                className={`flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border transition-colors ${
                  on
                    ? "border-primary bg-primary/15 text-primary"
                    : "border-border/60 bg-muted/40 hover:bg-muted"
                }`}
              >
                <s.icon className="h-6 w-6" />
                <span className="text-sm font-medium">{s.label}</span>
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Volume</span>
            <span>{volume}%</span>
          </div>
          <Slider value={[volume]} max={100} step={1} onValueChange={(v) => setVolume(v[0])} />
        </div>
      </CardContent>
    </Card>
  );
}

function FidgetCard() {
  const [pops, setPops] = useState<Record<number, boolean>>({});
  const reset = () => setPops({});
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Hand className="h-5 w-5 text-primary" /> Pop fidget
          </CardTitle>
          <CardDescription>Tap each bubble. Reset when you're done.</CardDescription>
        </div>
        <Button size="sm" variant="ghost" onClick={reset}>
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: 30 }).map((_, i) => {
            const popped = !!pops[i];
            return (
              <button
                key={i}
                aria-label={popped ? "popped" : "bubble"}
                onClick={() => setPops((p) => ({ ...p, [i]: true }))}
                className={`aspect-square rounded-full transition-all ${
                  popped
                    ? "scale-90 bg-muted shadow-inner"
                    : "bg-gradient-to-br from-secondary to-primary/60 shadow-md hover:scale-105 active:scale-95"
                }`}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
