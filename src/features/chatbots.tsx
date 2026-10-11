import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Grid2X2,
  List,
  MoreHorizontal,
  Pencil,
  Eye,
  Copy,
  Pause,
  Play,
  Trash2,
  Globe,
  MessagesSquare,
  Database,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePrototype } from "@/data/prototype-context";
import {
  PageHeader,
  CreateButton,
  SearchInput,
  Segments,
  BotIcon,
  Status,
  EmptyState,
} from "@/components/chatflow/shared";
import { ChatWidgetPreview } from "@/components/chatflow/chat-widget";
import type { Chatbot } from "@/types/chatbot";
import { toast } from "sonner";
export function Chatbots() {
  const { bots, setBots } = usePrototype();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [grid, setGrid] = useState(true);
  const [preview, setPreview] = useState<Chatbot | null>(null);
  const visible = bots.filter(
    (b) =>
      (filter === "All" || b.status === filter) &&
      `${b.name} ${b.domain}`.toLowerCase().includes(search.toLowerCase()),
  );
  function duplicate(bot: Chatbot) {
    setBots((b) => [
      ...b,
      {
        ...bot,
        id: `bot-${Date.now()}`,
        name: `${bot.name} (copy)`,
        status: "Draft",
        conversations: 0,
        activity: "Just now",
      },
    ]);
    toast.success("Chatbot duplicated");
  }
  return (
    <>
      <PageHeader title="My Chatbots" description="A little intelligence. A lot of possibilities.">
        <CreateButton />
      </PageHeader>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <SearchInput value={search} onChange={setSearch} placeholder="Search chatbots…" />
        </div>
        <div className="flex flex-wrap gap-3">
          <Segments
            options={["All", "Published", "Draft", "Paused"]}
            value={filter}
            onChange={setFilter}
          />
          <div className="flex rounded-md border border-border p-1">
            <Button
              size="icon-sm"
              variant={grid ? "secondary" : "ghost"}
              aria-label="Grid view"
              onClick={() => setGrid(true)}
            >
              <Grid2X2 />
            </Button>
            <Button
              size="icon-sm"
              variant={!grid ? "secondary" : "ghost"}
              aria-label="List view"
              onClick={() => setGrid(false)}
            >
              <List />
            </Button>
          </div>
        </div>
      </div>
      <div className={grid ? "grid gap-5 md:grid-cols-2 xl:grid-cols-3" : "space-y-4"}>
        {visible.map((b) => (
          <article
            className={`panel p-5 ${!grid ? "sm:flex sm:items-center sm:gap-8" : ""}`}
            key={b.id}
          >
            <div className={`flex items-center justify-between ${!grid ? "sm:w-60" : ""}`}>
              <BotIcon kind={b.kind} color={b.color} />
              <div className="flex items-center gap-2">
                <Status value={b.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm" aria-label={`${b.name} actions`}>
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => duplicate(b)}>
                      <Copy />
                      Duplicate chatbot
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => {
                        setBots((bs) =>
                          bs.map((x) =>
                            x.id === b.id
                              ? { ...x, status: x.status === "Paused" ? "Published" : "Paused" }
                              : x,
                          ),
                        );
                        toast.success("Prototype status updated");
                      }}
                    >
                      {b.status === "Paused" ? <Play /> : <Pause />}
                      {b.status === "Paused" ? "Resume" : "Pause"} chatbot
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onSelect={() => {
                        setBots((bs) => bs.filter((x) => x.id !== b.id));
                        toast.success("Chatbot removed");
                      }}
                    >
                      <Trash2 />
                      Delete chatbot
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className={`mt-5 ${!grid ? "sm:mt-0 sm:min-w-0 sm:flex-1" : ""}`}>
              <Link
                to="/chatbots/$id/studio"
                params={{ id: b.id }}
                className="font-display text-[15px] font-bold hover:text-primary"
              >
                {b.name}
              </Link>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Globe className="size-3" />
                {b.domain}
              </p>
            </div>
            <div className="my-5 grid grid-cols-2 gap-3 border-y border-border py-4">
              <div>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <MessagesSquare className="size-3" />
                  Conversations
                </span>
                <p className="mt-2 text-lg font-semibold">{b.conversations}</p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <Database className="size-3" />
                  Knowledge sources
                </span>
                <p className="mt-2 text-lg font-semibold">{b.sources}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] text-muted-foreground">Active {b.activity}</span>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Preview ${b.name}`}
                  title="Preview chatbot"
                  onClick={() => setPreview(b)}
                >
                  <Eye />
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/chatbots/$id/studio" params={{ id: b.id }}>
                    <Pencil />
                    Edit
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {visible.length === 0 && (
        <EmptyState
          title="No chatbots found"
          description="Try another filter, or create a new assistant."
        />
      )}
      <div className="mt-7 text-[11px] text-muted-foreground">
        {visible.length} of {bots.length} chatbots
      </div>
      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-[390px] bg-background">
          <DialogHeader>
            <DialogTitle>Chatbot preview</DialogTitle>
            <DialogDescription>Sample responses only — no AI connection.</DialogDescription>
          </DialogHeader>
          {preview && <ChatWidgetPreview bot={preview} />}
        </DialogContent>
      </Dialog>
    </>
  );
}
