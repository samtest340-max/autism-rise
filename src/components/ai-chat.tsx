/**
 * Reusable AI chat surface for Journey + Coach.
 * Single-conversation per assistant, persisted to localStorage.
 *
 * Conversation shape is per user's choice: multiple threads saved with account.
 * For this first prototype it uses localStorage threads keyed per assistant.
 * Switching to Lovable Cloud (account + database) is a follow-up.
 */
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Plus, Trash2 } from "lucide-react";
import type { ReactNode } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

export type AssistantId = "journey" | "coach";

type Thread = {
  id: string;
  title: string;
  updatedAt: number;
  messages: UIMessage[];
};

function storageKey(assistant: AssistantId) {
  return `bloom.chat.${assistant}`;
}

function loadThreads(assistant: AssistantId): Thread[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(assistant));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Thread[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveThreads(assistant: AssistantId, threads: Thread[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(storageKey(assistant), JSON.stringify(threads));
}

function newThread(): Thread {
  return {
    id: crypto.randomUUID(),
    title: "New conversation",
    updatedAt: Date.now(),
    messages: [],
  };
}

export function AiChat({
  assistant,
  title,
  subtitle,
  emptyTitle,
  emptyHint,
  starterPrompts = [],
  accentClass = "from-primary/15 to-accent/15",
  interactivePanel,
  onReady,
}: {
  assistant: AssistantId;
  title: string;
  subtitle: string;
  emptyTitle: string;
  emptyHint: string;
  starterPrompts?: string[];
  accentClass?: string;
  interactivePanel?: ReactNode;
  onReady?: (send: (text: string) => void) => void;
}) {
  const initialized = useRef(false);
  const [threads, setThreadsState] = useState<Thread[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Bootstrap idempotently on mount.
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    if (typeof window === "undefined") return;
    const existing = loadThreads(assistant);
    if (existing.length === 0) {
      const first = newThread();
      saveThreads(assistant, [first]);
      setThreadsState([first]);
      setActiveId(first.id);
    } else {
      setThreadsState(existing);
      setActiveId(existing[0].id);
    }
  }, [assistant]);

  const active = useMemo(() => threads.find((t) => t.id === activeId) ?? null, [threads, activeId]);

  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat", body: { assistant } }), [assistant]);

  const { messages, sendMessage, status, setMessages } = useChat({
    id: active?.id ?? "empty",
    messages: active?.messages ?? [],
    transport,
  });

  // Persist messages back into the active thread when they change.
  useEffect(() => {
    if (!active) return;
    if (messages === active.messages) return;
    setThreadsState((prev) => {
      const next = prev.map((t) =>
        t.id === active.id
          ? {
              ...t,
              messages,
              updatedAt: Date.now(),
              title: deriveTitle(messages) ?? t.title,
            }
          : t,
      );
      saveThreads(assistant, next);
      return next;
    });
  }, [messages, active, assistant]);

  const handleNewThread = useCallback(() => {
    const t = newThread();
    setThreadsState((prev) => {
      const next = [t, ...prev];
      saveThreads(assistant, next);
      return next;
    });
    setActiveId(t.id);
    setMessages([]);
  }, [assistant, setMessages]);

  const handleSelect = useCallback(
    (id: string) => {
      const t = threads.find((x) => x.id === id);
      if (!t) return;
      setActiveId(id);
      setMessages(t.messages);
    },
    [threads, setMessages],
  );

  const handleDelete = useCallback(
    (id: string) => {
      setThreadsState((prev) => {
        const next = prev.filter((t) => t.id !== id);
        if (next.length === 0) {
          const first = newThread();
          saveThreads(assistant, [first]);
          setActiveId(first.id);
          setMessages([]);
          return [first];
        }
        saveThreads(assistant, next);
        if (id === activeId) {
          setActiveId(next[0].id);
          setMessages(next[0].messages);
        }
        return next;
      });
    },
    [assistant, activeId, setMessages],
  );

  const sendText = useCallback(
    (text: string) => {
      if (!text.trim()) return;
      void sendMessage({ text });
    },
    [sendMessage],
  );

  useEffect(() => {
    onReady?.(sendText);
  }, [onReady, sendText]);

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] w-full">
      {/* Thread list */}
      <aside className="hidden w-64 flex-col border-r border-border/60 bg-sidebar/40 md:flex">
        <div className="flex items-center justify-between px-3 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Conversations</span>
          <Button size="icon-sm" variant="ghost" onClick={handleNewThread} aria-label="New conversation">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {threads.map((t) => (
            <div
              key={t.id}
              className={`group mb-1 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm transition-colors ${
                t.id === activeId ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent/60"
              }`}
            >
              <button
                onClick={() => handleSelect(t.id)}
                className="flex-1 truncate text-left"
                aria-current={t.id === activeId ? "true" : undefined}
              >
                {t.title}
              </button>
              <button
                onClick={() => handleDelete(t.id)}
                className="rounded p-1 opacity-0 transition-opacity hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                aria-label={`Delete ${t.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Chat column */}
      <div className="flex flex-1 flex-col">
        <div className={`border-b border-border/60 bg-gradient-to-br ${accentClass} px-6 py-4`}>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>

        <Conversation className="flex-1">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState title={emptyTitle} description={emptyHint}>
                {starterPrompts.length > 0 && (
                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    {starterPrompts.map((p) => (
                      <Button key={p} variant="outline" size="sm" onClick={() => sendText(p)}>
                        {p}
                      </Button>
                    ))}
                  </div>
                )}
              </ConversationEmptyState>
            ) : (
              messages.map((m) => (
                <Message from={m.role} key={m.id}>
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-2xl text-foreground [&_p]:my-1.5 [&_ul]:my-2 [&_li]:my-0.5">
                      <ReactMarkdown>{messageText(m)}</ReactMarkdown>
                    </div>
                  ) : (
                    <MessageContent>{messageText(m)}</MessageContent>
                  )}
                </Message>
              ))
            )}
            {status === "submitted" && (
              <Message from="assistant">
                <Shimmer>Thinking…</Shimmer>
              </Message>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {interactivePanel && (
          <div className="border-t border-border/60 bg-muted/30 p-3">
            {interactivePanel}
          </div>
        )}
        <div className="border-t border-border/60 bg-background p-3">
          <ChatComposer
            disabled={isLoading}
            onSubmit={(text) => sendText(text)}
          />
        </div>
      </div>
    </div>
  );
}

function deriveTitle(messages: UIMessage[]): string | null {
  const first = messages.find((m) => m.role === "user");
  if (!first) return null;
  const text = messageText(first);
  return text.slice(0, 48) + (text.length > 48 ? "…" : "");
}

function messageText(m: UIMessage): string {
  return m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
}

function ChatComposer({ disabled, onSubmit }: { disabled: boolean; onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");

  return (
    <PromptInput
      onSubmit={(msg) => {
        const text = (msg.text ?? value).trim();
        if (!text) return;
        onSubmit(text);
        setValue("");
      }}
    >
      <PromptInputTextarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Type a message…"
        autoFocus
      />
      <PromptInputFooter className="justify-end">
        <PromptInputSubmit status={disabled ? "submitted" : undefined} disabled={disabled || !value.trim()} />
      </PromptInputFooter>
    </PromptInput>
  );
}
