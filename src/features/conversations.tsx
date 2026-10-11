import { useState } from "react";
import {
  CheckCheck,
  Info,
  Mail,
  Globe,
  CalendarDays,
  StickyNote,
  MessageSquare,
  ArrowUp,
  ChevronLeft,
  Circle,
} from "lucide-react";
import { usePrototype } from "@/data/prototype-context";
import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import {
  PageHeader,
  SearchInput,
  Segments,
  Status,
  EmptyState,
} from "@/components/chatflow/shared";
import { toast } from "sonner";
export function Conversations() {
  const { conversations, setConversations } = usePrototype();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState("1");
  const [detail, setDetail] = useState(false);
  const [note, setNote] = useState(false);
  const [mobileThread, setMobileThread] = useState(false);
  const shown = conversations.filter(
    (c) =>
      (filter === "All" || c.status === filter) &&
      `${c.name} ${c.preview} ${c.bot}`.toLowerCase().includes(search.toLowerCase()),
  );
  const active = conversations.find((c) => c.id === selected);
  function send(text: string) {
    if (!text.trim() || !active) return;
    setConversations((cs) =>
      cs.map((c) =>
        c.id === selected
          ? { ...c, messages: [...c.messages, { role: "assistant", text, note }], preview: text }
          : c,
      ),
    );
    toast.success(note ? "Internal note added" : "Demo reply added");
  }
  return (
    <>
      <PageHeader title="Conversations" description="Every conversation is a chance to connect.">
        <span className="rounded-md border border-border px-3 py-2 text-xs text-muted-foreground">
          {conversations.filter((c) => c.status !== "Resolved").length} active conversations
        </span>
      </PageHeader>
      <div className="panel flex min-h-[650px] overflow-hidden">
        <div
          className={`w-full shrink-0 border-r border-border md:w-[285px] ${mobileThread ? "hidden md:block" : ""}`}
        >
          <div className="space-y-3 border-b border-border p-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Search conversations…" />
            <Segments
              options={["All", "Open", "Resolved", "Needs Attention"]}
              value={filter}
              onChange={setFilter}
            />
          </div>
          {shown.map((c, i) => (
            <Button
              key={c.id}
              variant="ghost"
              className={`h-auto w-full justify-start rounded-none border-b border-border px-4 py-5 text-left ${selected === c.id ? "border-l-2 border-l-primary bg-primary/5" : ""}`}
              onClick={() => {
                setSelected(c.id);
                setMobileThread(true);
                setConversations((cs) =>
                  cs.map((x) => (x.id === c.id ? { ...x, unread: false } : x)),
                );
              }}
            >
              <span
                className={`grid size-9 shrink-0 place-items-center rounded-full text-[11px] ${["bg-primary/15 text-primary", "bg-cyan/15 text-cyan", "bg-amber/15 text-amber", "bg-rose/15 text-rose"][i % 4]}`}
              >
                {c.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-1">
                  <span className="truncate text-xs font-semibold">{c.name}</span>
                  <span className="text-[8px] text-muted-foreground">{c.time}</span>
                </span>
                <span className="mt-2 block truncate text-[10px] text-muted-foreground">
                  {c.preview}
                </span>
                <span className="mt-2 flex items-center justify-between text-[9px] text-muted-foreground">
                  {c.bot}
                  {c.unread && <span className="size-1.5 rounded-full bg-primary" />}
                </span>
              </span>
            </Button>
          ))}
          {shown.length === 0 && <EmptyState />}
        </div>
        <div className={`min-w-0 flex-1 flex-col ${mobileThread ? "flex" : "hidden md:flex"}`}>
          {active ? (
            <>
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border p-4">
                <div className="flex min-w-0 items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="md:hidden"
                    aria-label="Back to conversation list"
                    onClick={() => setMobileThread(false)}
                  >
                    <ChevronLeft />
                  </Button>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold">{active.name}</h2>
                    <p className="mt-1 truncate text-[10px] text-muted-foreground">
                      {active.bot} · {active.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={active.status === "Resolved"}
                    onClick={() => {
                      setConversations((cs) =>
                        cs.map((c) => (c.id === selected ? { ...c, status: "Resolved" } : c)),
                      );
                      toast.success("Conversation marked resolved");
                    }}
                  >
                    <CheckCheck />
                    <span className="hidden lg:inline">Mark Resolved</span>
                  </Button>
                  <Button
                    variant={detail ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label="Visitor information"
                    onClick={() => setDetail(!detail)}
                  >
                    <Info />
                  </Button>
                </div>
              </div>
              <div className="flex min-h-0 flex-1">
                <div className="flex min-w-0 flex-1 flex-col">
                  <Conversation className="h-[420px] flex-none">
                    <ConversationContent className="gap-6 p-6">
                      <div className="text-center text-[10px] text-muted-foreground">
                        October 11, 2026 · 10:42 AM
                      </div>
                      {active.messages.map((m, i) => (
                        <Message key={i} from={m.role}>
                          <span className="text-[9px] text-muted-foreground">
                            {m.note
                              ? "Internal note · Alex Morgan"
                              : m.role === "user"
                                ? active.name
                                : active.bot}
                          </span>
                          <MessageContent
                            className={
                              m.note
                                ? "rounded-md border border-amber/20 bg-amber/5 p-3"
                                : "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                            }
                          >
                            <MessageResponse>{m.text}</MessageResponse>
                          </MessageContent>
                          <span className="text-[8px] text-muted-foreground">10:{42 + i} AM</span>
                        </Message>
                      ))}
                    </ConversationContent>
                    <ConversationScrollButton />
                  </Conversation>
                  <div className="mt-auto border-t border-border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <Segments
                        options={["Reply", "Internal note"]}
                        value={note ? "Internal note" : "Reply"}
                        onChange={(v) => setNote(v === "Internal note")}
                      />
                      <Status value={active.status} />
                    </div>
                    <PromptInput onSubmit={({ text }) => send(text)}>
                      <PromptInputTextarea
                        aria-label={note ? "Add internal note" : "Reply to visitor"}
                        placeholder={note ? "Add a note for your team…" : "Write a reply…"}
                        className="min-h-16 text-sm"
                      />
                      <PromptInputFooter>
                        <span className="text-[9px] text-muted-foreground">
                          {note
                            ? "Only visible to your team"
                            : "Prototype reply — not sent to a visitor"}
                        </span>
                        <PromptInputSubmit
                          status="ready"
                          aria-label={note ? "Save note" : "Send reply"}
                        >
                          <ArrowUp />
                        </PromptInputSubmit>
                      </PromptInputFooter>
                    </PromptInput>
                  </div>
                </div>
                {detail && (
                  <aside className="hidden w-[220px] shrink-0 border-l border-border p-5 xl:block">
                    <h3 className="mb-6 text-xs font-semibold">Visitor details</h3>
                    <div className="mb-4 grid size-12 place-items-center rounded-full bg-primary/15 text-primary">
                      {active.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <h4 className="text-sm font-medium">{active.name}</h4>
                    <div className="mt-6 space-y-5 text-[10px] text-muted-foreground">
                      <div>
                        <Mail className="mb-2 size-3" />
                        {active.email}
                      </div>
                      <div>
                        <Globe className="mb-2 size-3" />
                        San Francisco, United States
                      </div>
                      <div>
                        <CalendarDays className="mb-2 size-3" />
                        First seen Oct 11, 2026
                      </div>
                      <div>
                        <MessageSquare className="mb-2 size-3" />2 conversations
                      </div>
                    </div>
                  </aside>
                )}
              </div>
              {detail && (
                <div className="border-t border-border p-4 text-xs text-muted-foreground xl:hidden">
                  {active.name} · {active.email}
                  <br />
                  San Francisco · First seen Oct 11, 2026
                </div>
              )}
            </>
          ) : (
            <EmptyState
              title="Select a conversation"
              description="Your visitor messages appear here."
            />
          )}
        </div>
      </div>
    </>
  );
}
