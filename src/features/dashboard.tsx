import {
  Bot,
  MessagesSquare,
  UserRoundPlus,
  Zap,
  ArrowUpRight,
  ArrowRight,
  MoreHorizontal,
  ChevronRight,
  CircleHelp,
  Globe,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { usePrototype } from "@/data/prototype-context";
import { trend } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import {
  BotIcon,
  CreateButton,
  DateRange,
  PageHeader,
  PanelHeading,
  StatCard,
  Status,
  ViewAll,
} from "@/components/chatflow/shared";
export function TrendChart({ short = false }: { short?: boolean }) {
  return (
    <div className={short ? "h-[170px]" : "h-[244px]"}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={trend} margin={{ top: 15, right: 12, left: -25, bottom: 0 }}>
          <defs>
            <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.23} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 4" vertical={false} />
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            ticks={[1, 5, 10, 15, 20, 25, 30]}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            tickFormatter={(v) => `Oct ${v}`}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
            ticks={[0, 50, 100, 150, 200]}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              fontSize: 11,
            }}
            labelFormatter={(v) => `October ${v}`}
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="previous"
            name="Previous period"
            stroke="var(--muted-foreground)"
            strokeDasharray="4 4"
            strokeWidth={1.4}
            fill="transparent"
          />
          <Area
            isAnimationActive={false}
            type="monotone"
            dataKey="conversations"
            name="Conversations"
            stroke="var(--primary)"
            strokeWidth={2.2}
            fill="url(#chart-fill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
export function BotTable() {
  const { bots } = usePrototype();
  return (
    <div className="overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th>Chatbot</th>
            <th>Status</th>
            <th>Conversations</th>
            <th>Last active</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {bots.map((b) => (
            <tr key={b.id}>
              <td>
                <Link
                  to="/chatbots/$id/studio"
                  params={{ id: b.id }}
                  className="flex items-center gap-3"
                >
                  <BotIcon kind={b.kind} color={b.color} small />
                  <div>
                    <div className="font-medium">{b.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Globe className="size-2.5" />
                      {b.domain}
                    </div>
                  </div>
                </Link>
              </td>
              <td>
                <Status value={b.status} />
              </td>
              <td>
                <span className="font-semibold">{b.conversations}</span>
                <span className="ml-2 text-[9px] text-success">↗ 12.8%</span>
              </td>
              <td className="text-muted-foreground">{b.activity}</td>
              <td>
                <Button asChild size="icon-sm" variant="ghost">
                  <Link
                    to="/chatbots/$id/studio"
                    params={{ id: b.id }}
                    aria-label={`Edit ${b.name}`}
                  >
                    <MoreHorizontal />
                  </Link>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Dashboard({ preview = false }: { preview?: boolean }) {
  const { bots, conversations } = usePrototype();
  return (
    <>
      <PageHeader
        title="Good morning, Alex"
        description="Here's what's happening with your AI assistants."
      >
        <DateRange />
        <CreateButton />
      </PageHeader>
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Chatbots"
          value={`${bots.length}`}
          change="+2 this month"
          icon={<Bot className="size-4" />}
        />
        <StatCard
          label="Conversations"
          value="1,284"
          change="18.6%"
          icon={<MessagesSquare className="size-4" />}
          points="0,30 10,26 20,29 30,17 40,20 50,10 60,15 70,7 80,13 96,3"
        />
        <StatCard
          label="Leads Captured"
          value="186"
          change="24.2%"
          icon={<UserRoundPlus className="size-4" />}
        />
        <StatCard
          label="AI Messages Used"
          value="8,420"
          change="12.8%"
          color="cyan"
          icon={<Zap className="size-4" />}
        />
      </div>
      <div className="mb-6 grid gap-5 xl:grid-cols-[minmax(0,2.2fr)_minmax(270px,1fr)]">
        <section className="panel min-w-0">
          <PanelHeading
            title="Conversations over time"
            subtitle="A little more connected, every day."
          >
            <div className="hidden items-center gap-4 text-[10px] sm:flex">
              <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-primary" />
                This month
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <span className="size-1.5 rounded-full bg-muted-foreground" />
                Last month
              </span>
            </div>
          </PanelHeading>
          <div className="px-5 pt-5 pb-6">
            <div className="mb-2 flex items-end gap-3">
              <span className="font-display text-[25px] font-bold">1,284</span>
              <span className="mb-1 flex items-center gap-1 rounded bg-success/10 px-1.5 py-0.5 text-[10px] text-success">
                <ArrowUpRight className="size-3" />
                18.6%
              </span>
            </div>
            <TrendChart short={preview} />
          </div>
        </section>
        <section className="panel">
          <PanelHeading title="Monthly usage">
            <CircleHelp className="size-3.5 text-muted-foreground" />
          </PanelHeading>
          <div className="p-5">
            <div className="mb-5 flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Zap className="size-4" />
              </div>
              <span className="text-xs font-medium">AI messages</span>
              <span className="ml-auto rounded border border-border px-2 py-0.5 text-[9px] text-muted-foreground">
                Business plan
              </span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="font-display text-[29px] font-bold">8,420</span>
                <span className="ml-1 text-xs text-muted-foreground">/ 10,000</span>
              </div>
              <span className="mb-1 text-xs text-primary">84.2%</span>
            </div>
            <div className="progress-track mt-4">
              <div className="w-[84.2%]" />
            </div>
            <p className="mt-3 text-[10px] text-muted-foreground">
              Your usage resets on November 1, 2026
            </p>
            <div className="mt-5 flex gap-2 border-t border-border pt-4 text-[11px] leading-relaxed text-muted-foreground">
              <Zap className="mt-0.5 size-3.5 shrink-0 text-amber" />
              <p>
                You’re getting close to your limit. Keep the conversations flowing with an upgrade.
              </p>
            </div>
            <Button variant="outline" className="mt-4 h-9 w-full text-[11px]" asChild>
              <Link to="/billing">
                Upgrade plan
                <ArrowUpRight />
              </Link>
            </Button>
          </div>
        </section>
      </div>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,2.2fr)_minmax(270px,1fr)]">
        <section className="panel min-w-0">
          <PanelHeading title="Your chatbots" subtitle="Your team of always-on assistants.">
            <ViewAll to="/chatbots" />
          </PanelHeading>
          <BotTable />
        </section>
        <section className="panel">
          <PanelHeading title="Recent conversations">
            <ViewAll to="/conversations" />
          </PanelHeading>
          <div className="px-5">
            {conversations.slice(0, 4).map((c, i) => (
              <Link
                to="/conversations"
                key={c.id}
                className="grid grid-cols-[32px_minmax(0,1fr)_auto] items-start gap-3 border-b border-border py-[19px] last:border-0"
              >
                <span
                  className={`flex size-8 items-center justify-center rounded-full text-[10px] font-medium ${["bg-primary/15 text-primary", "bg-cyan/15 text-cyan", "bg-amber/15 text-amber", "bg-rose/15 text-rose"][i]}`}
                >
                  {c.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </span>
                <div className="min-w-0">
                  <div className="text-[11px] font-medium">{c.name}</div>
                  <p className="mt-1.5 truncate text-[10px] text-muted-foreground">{c.preview}</p>
                  <span className="mt-1.5 block text-[9px] text-muted-foreground">{c.bot}</span>
                </div>
                <span className="text-[8px] text-muted-foreground">{c.time}</span>
              </Link>
            ))}
          </div>
          <Link
            to="/conversations"
            className="flex items-center justify-center gap-1.5 border-t border-border py-3 text-[10px] text-muted-foreground"
          >
            Open conversation inbox
            <ArrowRight className="size-3" />
          </Link>
        </section>
      </div>
      {!preview && (
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-primary/20 bg-primary/5 px-5 py-4">
          <div className="flex items-center gap-3">
            <BookOpenIcon />
            <div>
              <h3 className="text-xs font-semibold">Make your assistants even more helpful</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Keep your knowledge fresh. Add your latest content to your knowledge base.
              </p>
            </div>
          </div>
          <Button variant="ghost" className="text-xs text-primary" asChild>
            <Link to="/knowledge">
              Manage knowledge
              <ChevronRight />
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
function BookOpenIcon() {
  return (
    <div className="grid size-9 place-items-center rounded-md bg-primary/10 text-primary">
      <Bot className="size-4" />
    </div>
  );
}
