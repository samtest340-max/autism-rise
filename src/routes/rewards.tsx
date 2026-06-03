import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Star, Gift, Sparkles, Lock } from "lucide-react";

export const Route = createFileRoute("/rewards")({
  head: () => ({
    meta: [
      { title: "Rewards — Bloom" },
      { name: "description", content: "Collect stars for tiny wins and unlock gentle rewards." },
      { property: "og:title", content: "Rewards — Bloom" },
    ],
  }),
  component: Rewards,
});

const QUESTS = [
  { id: "morning", label: "Finish morning routine", stars: 3 },
  { id: "breath", label: "1 breathing session", stars: 1 },
  { id: "coach", label: "Practice 3 phrases with Coach", stars: 2 },
  { id: "kind", label: "Do something kind", stars: 2 },
];

const REWARDS = [
  { id: "sticker", label: "Bloom sticker pack", cost: 10, icon: Sparkles, unlocked: true },
  { id: "story", label: "Bonus bedtime story", cost: 20, icon: Gift, unlocked: false },
  { id: "park", label: "Trip to the park", cost: 40, icon: Gift, unlocked: false },
];

function Rewards() {
  const [stars, setStars] = useState(18);
  const [doneToday, setDoneToday] = useState<Record<string, boolean>>({});

  const earn = (id: string, amount: number, label: string) => {
    if (doneToday[id]) return;
    setStars((s) => s + amount);
    setDoneToday((d) => ({ ...d, [id]: true }));
    toast.success(`+${amount} ⭐ for "${label}"`);
  };

  const redeem = (cost: number, label: string) => {
    if (stars < cost) {
      toast.error("Not quite enough stars yet — keep going!");
      return;
    }
    setStars((s) => s - cost);
    toast.success(`🎉 Redeemed: ${label}`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="rounded-3xl bg-gradient-to-br from-warm/40 via-secondary/40 to-primary/15 p-8 text-center">
        <p className="text-sm text-muted-foreground">You have</p>
        <p className="mt-1 flex items-center justify-center gap-2 text-5xl font-bold">
          {stars} <Star className="h-8 w-8 fill-yellow-400 text-yellow-500" />
        </p>
        <p className="mt-2 text-sm text-muted-foreground">stars to spend</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's quests</CardTitle>
            <CardDescription>Tap a quest when you finish it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {QUESTS.map((q) => {
              const done = doneToday[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => earn(q.id, q.stars, q.label)}
                  disabled={done}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                    done
                      ? "border-success/40 bg-success/10 text-muted-foreground"
                      : "border-border/60 bg-card hover:-translate-y-0.5 hover:shadow-md"
                  }`}
                >
                  <span className={done ? "line-through" : ""}>{q.label}</span>
                  <span className="flex items-center gap-1 text-sm font-medium">
                    +{q.stars} <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-500" />
                  </span>
                </button>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reward shop</CardTitle>
            <CardDescription>Trade stars for something fun.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {REWARDS.map((r) => {
              const can = stars >= r.cost;
              return (
                <div key={r.id} className="rounded-2xl border border-border/60 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/40">
                      <r.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{r.label}</p>
                      <p className="text-xs text-muted-foreground">{r.cost} ⭐</p>
                    </div>
                    <Button size="sm" disabled={!can} onClick={() => redeem(r.cost, r.label)} variant={can ? "default" : "outline"}>
                      {can ? "Redeem" : <Lock className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                  <Progress value={Math.min(100, (stars / r.cost) * 100)} className="mt-3 h-1.5" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
