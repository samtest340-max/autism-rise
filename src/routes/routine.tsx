import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Plus, Sunrise, Sun, Sunset, Moon, Trash2 } from "lucide-react";

export const Route = createFileRoute("/routine")({
  head: () => ({
    meta: [
      { title: "My Routine — Bloom" },
      { name: "description", content: "A visual daily schedule. Check things off as you go." },
      { property: "og:title", content: "My Routine — Bloom" },
    ],
  }),
  component: Routine,
});

type Block = "morning" | "afternoon" | "evening" | "night";
type Task = { id: string; block: Block; time: string; label: string; done: boolean };

const BLOCKS: { id: Block; label: string; icon: React.ComponentType<{ className?: string }>; tint: string }[] = [
  { id: "morning", label: "Morning", icon: Sunrise, tint: "from-warm/40 to-primary/15" },
  { id: "afternoon", label: "Afternoon", icon: Sun, tint: "from-primary/20 to-accent/15" },
  { id: "evening", label: "Evening", icon: Sunset, tint: "from-secondary/40 to-accent/15" },
  { id: "night", label: "Night", icon: Moon, tint: "from-accent/30 to-primary/15" },
];

const SEED: Task[] = [
  { id: "1", block: "morning", time: "8:00", label: "Brush teeth", done: true },
  { id: "2", block: "morning", time: "8:30", label: "Breakfast", done: true },
  { id: "3", block: "morning", time: "9:00", label: "Get ready for school", done: false },
  { id: "4", block: "afternoon", time: "15:00", label: "Snack & quiet time", done: false },
  { id: "5", block: "afternoon", time: "16:00", label: "Homework (15 min)", done: false },
  { id: "6", block: "evening", time: "18:00", label: "Dinner with family", done: false },
  { id: "7", block: "evening", time: "19:30", label: "Pick clothes for tomorrow", done: false },
  { id: "8", block: "night", time: "20:30", label: "Bath & story", done: false },
  { id: "9", block: "night", time: "21:00", label: "Lights out", done: false },
];

const KEY = "bloom.routine";

function Routine() {
  const [tasks, setTasks] = useState<Task[]>(SEED);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Task[]) => {
    setTasks(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  const toggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
    if (task && !task.done) toast.success(`Nice work — "${task.label}" ⭐`);
  };

  const remove = (id: string) => persist(tasks.filter((t) => t.id !== id));

  const add = (block: Block, time: string, label: string) => {
    if (!label.trim()) return;
    persist([...tasks, { id: crypto.randomUUID(), block, time: time || "—:—", label: label.trim(), done: false }]);
  };

  const done = tasks.filter((t) => t.done).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My routine</h1>
          <p className="text-muted-foreground">
            {done} of {tasks.length} done today.
          </p>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {BLOCKS.map((block) => (
          <BlockCard
            key={block.id}
            block={block}
            tasks={tasks.filter((t) => t.block === block.id)}
            onToggle={toggle}
            onRemove={remove}
            onAdd={(time, label) => add(block.id, time, label)}
          />
        ))}
      </div>
    </div>
  );
}

function BlockCard({
  block,
  tasks,
  onToggle,
  onRemove,
  onAdd,
}: {
  block: (typeof BLOCKS)[number];
  tasks: Task[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onAdd: (time: string, label: string) => void;
}) {
  const [label, setLabel] = useState("");
  const [time, setTime] = useState("");
  return (
    <Card className={`overflow-hidden bg-gradient-to-br ${block.tint}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <block.icon className="h-5 w-5" /> {block.label}
        </CardTitle>
        <CardDescription>{tasks.length} steps</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {tasks.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-3 rounded-xl bg-background/70 px-3 py-2 backdrop-blur"
          >
            <Checkbox checked={t.done} onCheckedChange={() => onToggle(t.id)} aria-label={`Mark ${t.label}`} />
            <span className="w-14 text-xs font-medium tabular-nums text-muted-foreground">{t.time}</span>
            <span className={`flex-1 text-sm ${t.done ? "text-muted-foreground line-through" : ""}`}>{t.label}</span>
            <button
              onClick={() => onRemove(t.id)}
              className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
              aria-label={`Delete ${t.label}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAdd(time, label);
            setLabel("");
            setTime("");
          }}
          className="flex items-center gap-2 pt-1"
        >
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-8 w-24 bg-background/70 text-xs"
          />
          <Input
            placeholder="Add a step…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="h-8 bg-background/70 text-sm"
          />
          <Button type="submit" size="icon-sm" variant="ghost" aria-label="Add step">
            <Plus className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
