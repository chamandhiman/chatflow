import { useState } from "react";
import { usePrototype } from "@/data/prototype-context";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { BotIcon, Status, Field, Segments, EmptyState } from "@/components/chatflow/shared";
import { ChatWidgetPreview } from "@/components/chatflow/chat-widget";
import {
  Monitor,
  Smartphone,
  Save,
  Globe,
  Eye,
  ArrowLeft,
  Settings2,
  Palette,
  MessagesSquare,
  Hand,
  UserRoundPlus,
  Code2,
  Check,
  Upload,
  MessageCircle,
  Bot,
  Headphones,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
export function Studio({ id }: { id: string }) {
  const { bots, setBots } = usePrototype();
  const original = bots.find((b) => b.id === id);
  const [config, setConfig] = useState(original);
  const [tab, setTab] = useState("Appearance");
  const [mobile, setMobile] = useState(false);
  const [questions, setQuestions] = useState("How can I get started?\nWhat plans do you offer?");
  const [avatar, setAvatar] = useState("");
  const [launcher, setLauncher] = useState("Message");
  if (!config)
    return (
      <EmptyState title="Chatbot not found" description="Select an assistant from My Chatbots." />
    );
  const bot = config;
  function update(key: string, value: unknown) {
    setConfig((b) => (b ? { ...b, [key]: value } : b));
  }
  function save(publish = false) {
    setBots((bs) =>
      bs.map((b) => (b.id === id ? { ...bot, status: publish ? "Published" : bot.status } : b)),
    );
    if (publish) update("status", "Published");
    toast.success(publish ? "Published in your prototype workspace" : "Prototype changes saved");
  }
  return (
    <>
      <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/chatbots" aria-label="Back to chatbots">
              <ArrowLeft />
            </Link>
          </Button>
          <BotIcon kind={bot.kind} color={bot.color} />
          <div className="min-w-0">
            <h1 className="truncate font-display text-lg font-bold">{bot.name}</h1>
            <div className="mt-1.5 flex items-center gap-2">
              <Status value={bot.status} />
              <span className="hidden text-[10px] text-muted-foreground sm:block">
                {bot.domain}
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMobile(!mobile);
              toast.info("Preview switched");
            }}
          >
            <Eye />
            <span className="hidden sm:inline">Preview</span>
          </Button>
          <Button variant="outline" size="sm" onClick={() => save()}>
            <Save />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button size="sm" onClick={() => save(true)}>
            <Globe />
            Publish
          </Button>
        </div>
      </div>
      <div className="grid gap-7 xl:grid-cols-[minmax(350px,.9fr)_minmax(0,1.1fr)]">
        <div>
          <div className="mb-6 flex flex-wrap gap-1 border-b border-border pb-3">
            {[
              { name: "General", icon: Settings2 },
              { name: "Appearance", icon: Palette },
              { name: "Chat Behavior", icon: MessagesSquare },
              { name: "Welcome Screen", icon: Hand },
              { name: "Lead Collection", icon: UserRoundPlus },
              { name: "Installation", icon: Code2 },
            ].map((t) => (
              <Button
                key={t.name}
                variant={tab === t.name ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setTab(t.name)}
                className={tab === t.name ? "text-primary" : "text-muted-foreground"}
              >
                <t.icon className="size-3.5" />
                {t.name}
              </Button>
            ))}
          </div>
          <h2 className="mb-2 text-lg font-bold">{tab}</h2>
          <p className="mb-7 text-xs text-muted-foreground">
            {tab === "Appearance"
              ? "Make your assistant feel right at home."
              : "Customize your assistant to suit your business."}
          </p>
          {tab === "Appearance" ? (
            <>
              <Field label="Primary color">
                <div className="flex items-center gap-3">
                  {["violet", "cyan", "amber", "rose"].map((c) => (
                    <Button
                      variant="ghost"
                      key={c}
                      size="icon"
                      aria-label={`${c} widget color`}
                      className={`bot-${c} rounded-full ${bot.color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""}`}
                      onClick={() => update("color", c)}
                    >
                      {bot.color === c && <Check />}
                    </Button>
                  ))}
                </div>
              </Field>
              <Field label="Chat theme">
                <Segments
                  options={["dark", "light"]}
                  value={bot.theme}
                  onChange={(v) => update("theme", v)}
                />
              </Field>
              <Field label="Bot name">
                <input value={bot.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Greeting message">
                <textarea
                  value={bot.greeting}
                  onChange={(e) => update("greeting", e.target.value)}
                />
              </Field>
              <Field label="Launcher icon">
                <Segments
                  options={["Message", "Bot", "Headphones"]}
                  value={launcher}
                  onChange={setLauncher}
                />
              </Field>
              <Field label="Avatar">
                <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-border px-4 py-3">
                  <Upload className="size-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {avatar || "Upload an avatar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAvatar(e.target.files?.[0]?.name || "")}
                  />
                </label>
              </Field>
              <div className="grid grid-cols-2 gap-5">
                <Field label="Widget position">
                  <select value={bot.position} onChange={(e) => update("position", e.target.value)}>
                    <option value="right">Bottom right</option>
                    <option value="left">Bottom left</option>
                  </select>
                </Field>
                <Field label={`Launcher size · ${bot.launcherSize}px`}>
                  <input
                    aria-label="Launcher size"
                    type="range"
                    min={40}
                    max={72}
                    value={bot.launcherSize}
                    onChange={(e) => update("launcherSize", Number(e.target.value))}
                  />
                </Field>
              </div>
            </>
          ) : tab === "General" ? (
            <>
              <Field label="Chatbot name">
                <input value={bot.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Website domain">
                <input value={bot.domain} onChange={(e) => update("domain", e.target.value)} />
              </Field>
              <Field label="Purpose">
                <select>
                  <option>Customer support</option>
                  <option>Sales and leads</option>
                  <option>Booking assistant</option>
                </select>
              </Field>
            </>
          ) : tab === "Chat Behavior" ? (
            <>
              <Field label="Response style">
                <select>
                  <option>Friendly & professional</option>
                  <option>Concise</option>
                  <option>Detailed & educational</option>
                </select>
              </Field>
              <Field label="Suggested questions">
                <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} />
              </Field>
              <div className="flex items-center justify-between border-b border-border py-5">
                <span>Human handoff</span>
                <Switch checked={bot.handoff} onCheckedChange={(v) => update("handoff", v)} />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Behavior controls are placeholders; no AI model is connected.
              </p>
            </>
          ) : tab === "Welcome Screen" ? (
            <>
              <Field label="Welcome message">
                <textarea
                  value={bot.greeting}
                  onChange={(e) => update("greeting", e.target.value)}
                />
              </Field>
              <Field label="Suggested questions">
                <textarea value={questions} onChange={(e) => setQuestions(e.target.value)} />
              </Field>
            </>
          ) : tab === "Lead Collection" ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p>Collect visitor details</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Ask for a name and email before chatting.
                  </p>
                </div>
                <Switch
                  checked={bot.leadCapture}
                  onCheckedChange={(v) => update("leadCapture", v)}
                />
              </div>
              <Field label="Lead prompt">
                <textarea defaultValue="Leave your details so our team can follow up." />
              </Field>
              <Field label="Required fields">
                <select>
                  <option>Name and email</option>
                  <option>Email only</option>
                </select>
              </Field>
            </>
          ) : (
            <>
              <h3 className="mb-3 font-medium">Connect with a copy and paste</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Configure your website and copy the illustrative widget snippet.
              </p>
              <Button asChild>
                <Link to="/install">
                  <Code2 />
                  Open Website Install
                </Link>
              </Button>
            </>
          )}
          <div className="mt-5 border-t border-border pt-5">
            <Button onClick={() => save()} disabled={!bot.name.trim()}>
              <Save />
              Save changes
            </Button>
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="size-1.5 rounded-full bg-success" />
              Live preview
            </div>
            <div className="flex rounded-md border border-border p-1">
              <Button
                variant={!mobile ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Desktop preview"
                onClick={() => setMobile(false)}
              >
                <Monitor />
              </Button>
              <Button
                variant={mobile ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Mobile preview"
                onClick={() => setMobile(true)}
              >
                <Smartphone />
              </Button>
            </div>
          </div>
          <div
            className={`preview-site flex flex-col ${mobile ? "mx-auto w-[340px] max-w-full" : "w-full"}`}
          >
            <div className="flex h-10 items-center gap-1.5 border-b border-border bg-card px-4">
              <span className="size-2 rounded-full bg-rose/60" />
              <span className="size-2 rounded-full bg-amber/60" />
              <span className="size-2 rounded-full bg-success/60" />
              <span className="mx-auto flex items-center gap-1.5 rounded bg-background px-8 py-1 text-[9px] text-muted-foreground">
                <Globe className="size-2.5" />
                {bot.domain}
              </span>
            </div>
            <div className="flex items-center justify-between px-5 py-5">
              <span className="text-sm font-bold">acme.</span>
              <div className="flex gap-4 text-[8px] text-muted-foreground">
                <span>Product</span>
                <span>About</span>
                <span>Contact</span>
              </div>
            </div>
            <div className="px-6">
              <div className="mb-3 h-3 w-3/5 rounded bg-secondary" />
              <div className="mb-2 h-2 w-4/5 rounded bg-secondary/70" />
              <div className="h-2 w-3/5 rounded bg-secondary/70" />
            </div>
            <div
              className={`mt-auto flex p-5 ${bot.position === "right" ? "justify-end" : "justify-start"}`}
            >
              <ChatWidgetPreview
                bot={bot}
                mobile={mobile}
                launcher={launcher}
                questions={questions.split("\n").filter(Boolean)}
              />
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-muted-foreground">
            Interactive sample widget · no live AI or website connection
          </p>
        </div>
      </div>
    </>
  );
}
