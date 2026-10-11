import { type ReactNode, useState } from "react";
import {
  Bot,
  Headphones,
  ShoppingBag,
  CalendarDays,
  BookOpen,
  ChevronDown,
  ArrowUpRight,
  Plus,
  Search,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePrototype } from "@/data/prototype-context";
import type { Chatbot } from "@/types/chatbot";
import { Link } from "@tanstack/react-router";
import mark from "@/assets/chatflow-mark.png";
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <img src={mark} width={34} height={34} alt="" className="size-8 shrink-0 object-contain" />
      {!compact && (
        <span className="font-display text-[19px] font-extrabold">
          ChatFlow<span className="ml-1.5 text-[12px] font-semibold text-primary">AI</span>
        </span>
      )}
    </div>
  );
}
export function BotIcon({
  kind = "support",
  color = "violet",
  small = false,
}: {
  kind?: Chatbot["kind"];
  color?: string;
  small?: boolean;
}) {
  const Icon =
    { support: Headphones, sales: ShoppingBag, appointment: CalendarDays, docs: BookOpen }[kind] ||
    Bot;
  return (
    <div
      className={`bot-${color} grid shrink-0 place-items-center rounded-lg ${small ? "size-8" : "size-10"}`}
    >
      <Icon className={small ? "size-4" : "size-[19px]"} />
    </div>
  );
}
export function Status({ value }: { value: string }) {
  const color = ["Published", "Ready", "Resolved"].includes(value)
    ? "text-success bg-success/10"
    : ["Draft", "Processing", "Needs Attention"].includes(value)
      ? "text-amber bg-amber/10"
      : value === "Failed"
        ? "text-destructive bg-destructive/10"
        : "text-muted-foreground bg-muted";
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded px-2 py-1 text-[10px] font-medium ${color}`}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {value}
    </span>
  );
}
export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div className="min-w-0">
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <div className="flex shrink-0 flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
export function CreateButton() {
  const { setWizardOpen } = usePrototype();
  return (
    <Button className="primary-action h-10 gap-2 text-xs" onClick={() => setWizardOpen(true)}>
      <Plus className="size-4" />
      Create Chatbot
    </Button>
  );
}
export function DateRange() {
  return (
    <div className="relative">
      <CalendarDays className="pointer-events-none absolute left-3 top-3 size-3.5 text-muted-foreground" />
      <select
        aria-label="Date range"
        className="select-control h-10 appearance-none pl-9 pr-8 text-xs"
      >
        <option>Last 30 days</option>
        <option>Last 7 days</option>
        <option>This month</option>
        <option>Last 90 days</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 size-3.5 text-muted-foreground" />
    </div>
  );
}
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative min-w-0">
      <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
      <Input
        aria-label={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 bg-background pl-9 text-xs"
        placeholder={placeholder}
      />
    </div>
  );
}
export function Segments({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex max-w-full flex-wrap gap-1 rounded-md border border-border bg-background p-1">
      {options.map((option) => (
        <Button
          key={option}
          size="sm"
          variant={value === option ? "secondary" : "ghost"}
          onClick={() => onChange(option)}
          className={`text-xs ${value === option ? "text-foreground" : "text-muted-foreground"}`}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}
export function StatCard({
  label,
  value,
  change,
  icon,
  points = "0,29 12,26 22,29 35,19 47,24 59,14 72,20 84,9 96,11",
  color = "success",
}: {
  label: string;
  value: string;
  change: string;
  icon: ReactNode;
  points?: string;
  color?: string;
}) {
  return (
    <div className="panel stat-card">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-foreground">{label}</span>
        <span className="text-muted-foreground">{icon}</span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="flex items-center gap-1.5 text-[10px]">
        <span className={`inline-flex items-center text-${color}`}>
          <ArrowUpRight className="size-3" />
          {change}
        </span>
        <span className="text-muted-foreground">vs. last month</span>
      </div>
      <svg className={`mini-sparkline text-${color}`} viewBox="0 0 96 40" aria-hidden="true">
        <polyline points={points} fill="none" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}
export function PanelHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="panel-heading">
      <div>
        <h2 className="text-[13px] font-bold">{title}</h2>
        {subtitle && <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
export function EmptyState({
  title = "No results found",
  description = "Try another search or filter.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="py-20 text-center">
      <Bot className="mx-auto mb-4 size-9 text-primary" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
export function ViewAll({
  to,
}: {
  to: "/chatbots" | "/conversations" | "/billing" | "/knowledge";
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-primary"
    >
      View all
      <ArrowRight className="size-3" />
    </Link>
  );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
    </label>
  );
}
export function ToggleRow({
  label,
  description,
  initial = true,
}: {
  label: string;
  description: string;
  initial?: boolean;
}) {
  const [on, setOn] = useState(initial);
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <Button
        role="switch"
        aria-checked={on}
        aria-label={label}
        variant="ghost"
        className={`h-5 w-9 shrink-0 rounded-full p-0.5 ${on ? "bg-primary hover:bg-primary" : "bg-secondary hover:bg-secondary"}`}
        onClick={() => setOn(!on)}
      >
        <span
          className={`size-4 rounded-full bg-primary-foreground transition-transform ${on ? "translate-x-2" : "-translate-x-2"}`}
        />
      </Button>
    </div>
  );
}
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — ChatFlow AI` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — ChatFlow AI` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}
