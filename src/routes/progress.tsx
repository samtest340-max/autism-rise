import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — Bloom" },
      { name: "description", content: "Two views: a kind summary for you, and a richer view for parents." },
      { property: "og:title", content: "Progress — Bloom" },
    ],
  }),
  component: Progress_,
});

const weekData = [
  { day: "Mon", routine: 80, sensory: 3, mood: 4 },
  { day: "Tue", routine: 60, sensory: 5, mood: 3 },
  { day: "Wed", routine: 95, sensory: 2, mood: 5 },
  { day: "Thu", routine: 70, sensory: 4, mood: 4 },
  { day: "Fri", routine: 100, sensory: 1, mood: 5 },
  { day: "Sat", routine: 50, sensory: 6, mood: 3 },
  { day: "Sun", routine: 85, sensory: 2, mood: 4 },
];

const milestones = [
  { id: 1, label: "Tried a new food", date: "May 28" },
  { id: 2, label: "5-day routine streak", date: "Jun 1" },
  { id: 3, label: "Said hello to a friend", date: "Jun 2" },
];

function Progress_() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Progress</h1>
        <p className="text-muted-foreground">A view for you, and a view for a parent.</p>
      </header>

      <Tabs defaultValue="me">
        <TabsList>
          <TabsTrigger value="me">My view</TabsTrigger>
          <TabsTrigger value="parent">Parent view</TabsTrigger>
        </TabsList>

        {/* CHILD VIEW */}
        <TabsContent value="me" className="space-y-6">
          <Card className="bg-gradient-to-br from-primary/15 to-accent/15">
            <CardHeader>
              <CardTitle>Look how far you've come 💜</CardTitle>
              <CardDescription>This week, gently.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <Stat label="Routine done" value="78%" hint="Up from 65% last week" />
              <Stat label="Calm tools used" value="23" hint="Whenever you needed" />
              <Stat label="New things tried" value="3" hint="Brave!" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wins this week</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {milestones.map((m) => (
                <Badge key={m.id} variant="secondary" className="rounded-full px-3 py-1 text-sm">
                  ⭐ {m.label}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* PARENT VIEW */}
        <TabsContent value="parent" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Routine completion</CardTitle>
                <CardDescription>Last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 90)" />
                    <XAxis dataKey="day" stroke="oklch(0.5 0.02 250)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0.02 250)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="routine" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sensory regulation</CardTitle>
                <CardDescription>Tool uses per day (lower trend = more regulated)</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weekData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 90)" />
                    <XAxis dataKey="day" stroke="oklch(0.5 0.02 250)" fontSize={12} />
                    <YAxis stroke="oklch(0.5 0.02 250)" fontSize={12} />
                    <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                    <Bar dataKey="sensory" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Goals</CardTitle>
              <CardDescription>Small, achievable goals tracked weekly.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Goal label="Independent morning routine" value={72} />
              <Goal label="3 communication-coach sessions / week" value={66} />
              <Goal label="Self-regulation: use a tool before escalation" value={48} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Milestones</CardTitle>
            </CardHeader>
            <CardContent className="divide-y divide-border/60">
              {milestones.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-3 text-sm">
                  <span>⭐ {m.label}</span>
                  <span className="text-muted-foreground">{m.date}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-background/60 p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-semibold">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Goal({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <Progress value={value} className="mt-1.5 h-2" />
    </div>
  );
}
