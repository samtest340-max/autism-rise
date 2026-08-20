import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PALETTES, useTheme } from "@/components/theme-provider";
import { Check } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Bloom" },
      { name: "description", content: "Customize colors and accessibility preferences." },
      { property: "og:title", content: "Settings — Bloom" },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { palette, setPalette, readingLevel, setReadingLevel } = useTheme();

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground">Make Bloom feel like yours.</p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Words &amp; reading</CardTitle>
          <CardDescription>Choose how simple you want the words to be, in the app and in chat.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {([
            { id: "simple", label: "Simple words", desc: "Short sentences. One idea at a time." },
            { id: "standard", label: "Standard words", desc: "Normal sentences with a bit more detail." },
          ] as const).map((opt) => {
            const active = opt.id === readingLevel;
            return (
              <button
                key={opt.id}
                onClick={() => setReadingLevel(opt.id)}
                aria-pressed={active}
                className={`min-h-24 rounded-2xl border-2 p-4 text-left transition-all ${
                  active ? "border-primary ring-2 ring-primary/30" : "border-border/60 hover:shadow-md"
                }`}
              >
                <p className="text-base font-semibold">{opt.label}</p>
                <p className="text-sm text-muted-foreground">{opt.desc}</p>
              </button>
            );
          })}
        </CardContent>
      </Card>


      <Card>
        <CardHeader>
          <CardTitle>Color palette</CardTitle>
          <CardDescription>Pick a palette that feels comfortable. You can change this any time.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {Object.values(PALETTES).map((p) => {
            const active = p.id === palette;
            return (
              <button
                key={p.id}
                onClick={() => setPalette(p.id)}
                className={`group flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${
                  active
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border/60 hover:-translate-y-0.5 hover:shadow-md"
                }`}
              >
                <div className="flex gap-1">
                  {p.swatches.map((c) => (
                    <span
                      key={c}
                      className="h-7 w-7 rounded-full border border-white/70 shadow-sm"
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
                {active && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Bloom</CardTitle>
          <CardDescription>This is a prototype, built with love.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            All of today's data (routine, rewards, conversations) is stored locally in your browser. When you're
            ready, you can enable cloud accounts so families can sync across devices and a parent dashboard can see
            shared progress.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
