import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Calendar, Trophy, MessageCircleHeart, Hand, TrendingUp, Sun } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today — Bloom" },
      { name: "description", content: "Your gentle dashboard: today's routine, sensory tools, rewards, and AI companions." },
      { property: "og:title", content: "Today — Bloom" },
    ],
  }),
  component: Index,
});

const routine = [
  { time: "8:00", label: "Wake up & stretch", done: true },
  { time: "8:30", label: "Breakfast", done: true },
  { time: "9:00", label: "School", done: false, current: true },
  { time: "15:00", label: "Quiet time", done: false },
  { time: "18:00", label: "Dinner with family", done: false },
];

function Index() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      {/* Greeting */}
      <section className="rounded-3xl bg-gradient-to-br from-primary/20 via-secondary/30 to-accent/20 p-8">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Sun className="h-4 w-4" /> Good morning
        </div>
        <h1 className="mt-1 text-3xl font-semibold">Hi friend — let's have a gentle day.</h1>
        <p className="mt-2 max-w-xl text-muted-foreground">
          You've kept your routine going for <span className="font-medium text-foreground">5 days in a row</span>.
          That's something to be proud of.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button asChild>
            <Link to="/sensory">Open sensory tools</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/journey">Talk to Bloom</Link>
          </Button>
        </div>
      </section>

      {/* Today's routine */}
      <section className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Today's routine</CardTitle>
              <CardDescription>One small step at a time.</CardDescription>
            </div>
            <Button asChild size="sm" variant="ghost">
              <Link to="/routine">Open</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2">
              {routine.map((step) => (
                <li
                  key={step.time}
                  className={`flex items-center gap-3 rounded-2xl border border-border/60 px-4 py-3 ${
                    step.current ? "bg-primary/10 ring-1 ring-primary/40" : ""
                  }`}
                >
                  <span className="w-14 text-xs font-medium tabular-nums text-muted-foreground">{step.time}</span>
                  <span className={`flex-1 ${step.done ? "text-muted-foreground line-through" : ""}`}>{step.label}</span>
                  {step.done ? (
                    <span className="text-xs font-medium text-success">Done</span>
                  ) : step.current ? (
                    <span className="text-xs font-medium text-primary">Now</span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Soon</span>
                  )}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This week</CardTitle>
            <CardDescription>Calm, kind progress.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Stat label="Routine completion" value={72} suffix="%" />
            <Stat label="Sensory check-ins" value={5} suffix=" / 7" raw />
            <Stat label="Reward stars" value={18} suffix=" ⭐" raw />
          </CardContent>
        </Card>
      </section>

      {/* Quick links */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <QuickLink to="/sensory" icon={Sparkles} title="Sensory Tools" desc="Breathing, calm sounds, fidgets." />
        <QuickLink to="/routine" icon={Calendar} title="My Routine" desc="Visual schedule for the day." />
        <QuickLink to="/rewards" icon={Trophy} title="Rewards" desc="Collect stars for routines & wins." />
        <QuickLink to="/progress" icon={TrendingUp} title="Progress" desc="A view for you and a parent view." />
        <QuickLink to="/journey" icon={MessageCircleHeart} title="My Journey" desc="Bloom reflects on how far you've come." />
        <QuickLink to="/coach" icon={Hand} title="Communication Coach" desc="Talking, ASL, and AAC practice." />
      </section>
    </div>
  );
}

function Stat({ label, value, suffix, raw }: { label: string; value: number; suffix?: string; raw?: boolean }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}
          {suffix}
        </span>
      </div>
      {!raw && <Progress value={value} className="mt-1.5 h-2" />}
    </div>
  );
}

function QuickLink({
  to,
  icon: Icon,
  title,
  desc,
}: {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary transition-colors group-hover:bg-primary/25">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-3 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
    </Link>
  );
}
