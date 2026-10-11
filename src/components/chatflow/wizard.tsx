import { useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowLeft,
  Globe,
  FileText,
  MessageSquare,
  Upload,
  Bot,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePrototype } from "@/data/prototype-context";
import { Field, Segments } from "./shared";
import { toast } from "sonner";
export function ChatbotWizard() {
  const { wizardOpen, setWizardOpen, setBots } = usePrototype();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("Customer support");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("Website");
  const [greeting, setGreeting] = useState("Hi there! How can I help you today?");
  const [color, setColor] = useState("violet");
  const [position, setPosition] = useState("right");
  const [file, setFile] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  function next() {
    if (step === 0 && (!name.trim() || !/^https?:\/\/[^\s.]+\.[^\s]+$/.test(url))) {
      setError("Enter a chatbot name and a valid website URL, including https://.");
      return;
    }
    if (step === 1 && source === "FAQ" && (!question.trim() || !answer.trim())) {
      setError("Add both a question and an answer.");
      return;
    }
    if (step === 1 && source === "Document" && !file) {
      setError("Choose a sample document.");
      return;
    }
    setError("");
    setStep(step + 1);
  }
  function create() {
    setBots((b) => [
      ...b,
      {
        id: `bot-${Date.now()}`,
        name,
        domain: new URL(url).hostname,
        status: "Draft",
        conversations: 0,
        sources: 1,
        activity: "Just now",
        kind: "support",
        greeting,
        color,
        theme: "dark",
        position: position === "left" ? "left" : "right",
        leadCapture: false,
        handoff: false,
        launcherSize: 56,
      },
    ]);
    setWizardOpen(false);
    setStep(0);
    setName("");
    setUrl("");
    toast.success("Chatbot added to your prototype workspace");
  }
  return (
    <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
      <DialogContent className="max-w-xl border-border bg-card p-7">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Bot />
          </div>
          <DialogTitle className="font-display text-xl">Create your AI assistant</DialogTitle>
          <DialogDescription className="text-xs">
            A new conversation starts here. Let’s make it yours.
          </DialogDescription>
        </DialogHeader>
        <div className="my-3 grid grid-cols-4 gap-2">
          {["Basics", "Knowledge", "Appearance", "Review"].map((s, i) => (
            <div key={s}>
              <div
                className={`mb-2 h-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`}
              />
              <span
                className={`text-[10px] ${i === step ? "text-primary" : "text-muted-foreground"}`}
              >
                {i + 1}. {s}
              </span>
            </div>
          ))}
        </div>
        <div className="min-h-[280px] pt-2">
          {step === 0 ? (
            <>
              <Field label="Chatbot name">
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Customer Success Assistant"
                  autoFocus
                />
              </Field>
              <Field label="Purpose">
                <select value={purpose} onChange={(e) => setPurpose(e.target.value)}>
                  <option>Customer support</option>
                  <option>Sales & lead generation</option>
                  <option>Appointment booking</option>
                  <option>Documentation</option>
                </select>
              </Field>
              <Field label="Website URL">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </Field>
            </>
          ) : step === 1 ? (
            <>
              <div className="mb-5 grid grid-cols-3 gap-3">
                {[
                  { name: "Website", icon: Globe },
                  { name: "FAQ", icon: MessageSquare },
                  { name: "Document", icon: FileText },
                ].map((s) => (
                  <Button
                    key={s.name}
                    variant="outline"
                    className={`h-20 flex-col ${source === s.name ? "border-primary bg-primary/10 text-primary" : ""}`}
                    onClick={() => setSource(s.name)}
                  >
                    <s.icon />
                    {s.name}
                  </Button>
                ))}
              </div>
              {source === "Website" ? (
                <Field label="Source URL">
                  <input defaultValue={url} type="url" />
                </Field>
              ) : source === "FAQ" ? (
                <>
                  <Field label="Question">
                    <input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="What is your return policy?"
                    />
                  </Field>
                  <Field label="Answer">
                    <textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Share a helpful answer…"
                    />
                  </Field>
                </>
              ) : (
                <label className="flex cursor-pointer flex-col items-center gap-3 rounded-lg border border-dashed border-border p-7">
                  <Upload className="text-primary" />
                  <span className="text-xs">{file || "Choose a PDF, DOCX, or TXT file"}</span>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0]?.name || "")}
                  />
                </label>
              )}
              <p className="mt-4 text-[11px] text-muted-foreground">
                Prototype only. Sources are not crawled, processed, or used to train AI.
              </p>
            </>
          ) : step === 2 ? (
            <>
              <Field label="Widget color">
                <div className="flex gap-3">
                  {["violet", "cyan", "amber", "rose"].map((c) => (
                    <Button
                      key={c}
                      size="icon"
                      aria-label={`${c} color`}
                      className={`bot-${c} size-8 rounded-full ${color === c ? "ring-2 ring-primary ring-offset-2 ring-offset-card" : ""}`}
                      variant="ghost"
                      onClick={() => setColor(c)}
                    >
                      {color === c && <Check className="size-4" />}
                    </Button>
                  ))}
                </div>
              </Field>
              <Field label="Welcome message">
                <textarea value={greeting} onChange={(e) => setGreeting(e.target.value)} />
              </Field>
              <Field label="Widget position">
                <Segments options={["right", "left"]} value={position} onChange={setPosition} />
              </Field>
            </>
          ) : (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Ready to meet your new assistant?</h3>
              {[
                ["Name", name],
                ["Purpose", purpose],
                ["Website", url],
                ["Knowledge source", source],
                ["Appearance", `${color} · bottom ${position}`],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between gap-4 border-b border-border pb-3 text-xs"
                >
                  <span className="text-muted-foreground">{l}</span>
                  <span className="truncate">{v}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground">
                Your assistant will be created as a local prototype draft.
              </p>
            </div>
          )}
        </div>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <div className="flex justify-between border-t border-border pt-5">
          <Button
            variant="ghost"
            onClick={() => (step > 0 ? setStep(step - 1) : setWizardOpen(false))}
          >
            <ArrowLeft />
            {step ? "Back" : "Cancel"}
          </Button>
          <Button className="primary-action" onClick={step === 3 ? create : next}>
            {step === 3 ? "Create Chatbot" : "Continue"}
            {step === 3 ? <Check /> : <ArrowRight />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
