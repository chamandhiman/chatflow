import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Bot,
  Database,
  MessagesSquare,
  Code2,
  ChartNoAxesCombined,
  Users,
  CreditCard,
  CircleHelp,
  ChevronsUpDown,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  Search,
  Bell,
  BookOpen,
  ArrowUpRight,
  X,
  LogOut,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { brand } from "@/data/mockData";
import { usePrototype } from "@/data/prototype-context";
import { Brand, SearchInput } from "./shared";
import { ChatbotWizard } from "./wizard";
import { toast } from "sonner";
const nav = [
  { name: "Overview", to: "/dashboard", icon: LayoutDashboard },
  { name: "My Chatbots", to: "/chatbots", icon: Bot },
  { name: "Knowledge Base", to: "/knowledge", icon: Database },
  { name: "Conversations", to: "/conversations", icon: MessagesSquare },
  { name: "Website Install", to: "/install", icon: Code2 },
  { name: "Analytics", to: "/analytics", icon: ChartNoAxesCombined },
  { name: "Team & Settings", to: "/settings", icon: Users },
  { name: "Billing & Usage", to: "/billing", icon: CreditCard },
  { name: "Help & Support", to: "/help", icon: CircleHelp },
] as const;
export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = nav.find((n) => pathname.startsWith(n.to))?.name || "Chatbot Studio";
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [workspace, setWorkspace] = useState(brand.workspace);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { bots, plan } = usePrototype();
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen w-full bg-background">
      {mobile && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobile(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-sidebar transition-[width,transform] duration-200 ${collapsed ? "lg:w-[76px]" : "lg:w-[238px]"} w-[238px] ${mobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div
          className={`flex h-[75px] shrink-0 items-center ${collapsed ? "justify-center" : "px-23px px-6"}`}
        >
          <Link to="/" aria-label="ChatFlow AI home">
            <Brand compact={collapsed} />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden"
            aria-label="Close navigation"
            onClick={() => setMobile(false)}
          >
            <X />
          </Button>
        </div>
        <div className={collapsed ? "px-3" : "px-4"}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className={`h-[58px] w-full justify-start gap-3 bg-card ${collapsed ? "px-2" : "px-3"}`}
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-secondary font-display text-sm">
                  A
                </span>
                {!collapsed && (
                  <>
                    <span className="min-w-0 text-left">
                      <span className="block truncate text-xs font-semibold">{workspace}</span>
                      <span className="mt-0.5 block text-[10px] text-muted-foreground">
                        {plan} plan{" "}
                        <span className="ml-1 rounded bg-primary/15 px-1 text-primary">PRO</span>
                      </span>
                    </span>
                    <ChevronsUpDown className="ml-auto size-3 text-muted-foreground" />
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Switch workspace</DropdownMenuLabel>
              {[brand.workspace, "Personal Workspace"].map((w) => (
                <DropdownMenuItem key={w} onSelect={() => setWorkspace(w)}>
                  {w}
                  {workspace === w && <Check className="ml-auto size-3" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className={`mt-7 mb-3 ${collapsed ? "text-center" : "px-7"} eyebrow`}>
          {collapsed ? "•••" : "Workspace"}
        </div>
        <nav className="space-y-1 px-3">
          {nav.map((n, i) => (
            <div key={n.to}>
              {i === 6 && <div className="my-5 border-t border-border" />}
              <Link
                to={n.to}
                title={collapsed ? n.name : undefined}
                onClick={() => setMobile(false)}
                className={`nav-link ${pathname.startsWith(n.to) ? "active" : ""} ${collapsed ? "justify-center px-0" : ""}`}
              >
                <n.icon className="size-[17px] shrink-0" />
                {!collapsed && (
                  <>
                    <span className="truncate">{n.name}</span>
                    {n.to === "/chatbots" && (
                      <span className="ml-auto text-[10px] text-muted-foreground">
                        {bots.length}
                      </span>
                    )}
                    {n.to === "/conversations" && (
                      <span className="ml-auto rounded bg-primary/15 px-1.5 py-0.5 text-[10px] text-primary">
                        4
                      </span>
                    )}
                  </>
                )}
              </Link>
            </div>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          {!collapsed && (
            <div className="mx-4 mb-5 rounded-lg border border-border bg-card p-3.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold">Monthly message usage</span>
                <span className="text-muted-foreground">84%</span>
              </div>
              <div className="progress-track mt-3">
                <div className="w-[84%]" />
              </div>
              <div className="mt-2 text-[10px] text-muted-foreground">8,420 of 10,000 messages</div>
              <Link
                to="/billing"
                className="mt-3 flex items-center justify-between text-[11px] text-primary"
              >
                Upgrade your plan
                <ArrowUpRight className="size-3" />
              </Link>
            </div>
          )}
          <div className="border-t border-border p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto w-full justify-start gap-3 p-0 hover:bg-transparent"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber/15 text-xs font-semibold text-amber">
                    AM
                  </span>
                  {!collapsed && (
                    <>
                      <span className="min-w-0 text-left">
                        <span className="block text-xs font-semibold">Alex Morgan</span>
                        <span className="block truncate text-[10px] text-muted-foreground">
                          alex@acme.com
                        </span>
                      </span>
                      <ChevronDown className="ml-auto size-3 text-muted-foreground" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-52">
                <DropdownMenuLabel>Alex Morgan</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => navigate({ to: "/settings" })}>
                  <Users />
                  Account settings
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/" })}>
                  <LogOut />
                  Exit demo workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      <div
        className={`flex min-w-0 flex-1 flex-col transition-[margin] ${collapsed ? "lg:ml-[76px]" : "lg:ml-[238px]"}`}
      >
        <header className="grid h-[75px] grid-cols-[minmax(0,1fr)_auto] items-center border-b border-border px-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle navigation"
              className="text-muted-foreground"
              onClick={() =>
                window.innerWidth < 1024 ? setMobile(!mobile) : setCollapsed(!collapsed)
              }
            >
              <span className="lg:hidden">
                <Menu />
              </span>
              <span className="hidden lg:inline">
                {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
              </span>
            </Button>
            <span className="hidden text-xs text-muted-foreground sm:block">Workspace</span>
            <ChevronRight className="hidden size-3 text-muted-foreground sm:block" />
            <span className="truncate text-xs font-medium">{title}</span>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              className="hidden gap-2 text-xs text-muted-foreground md:flex"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="size-3.5" />
              Search anything…
              <kbd className="ml-6 rounded border border-border px-1.5 py-0.5 text-[9px]">⌘ K</kbd>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Notifications"
                  className="relative text-muted-foreground"
                >
                  <Bell />
                  <span className="absolute right-2 top-1.5 size-1.5 rounded-full bg-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={() => toast.info("Demo usage notification marked as read")}
                >
                  You’ve used 84% of your messages.
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/conversations" })}>
                  2 conversations need your attention.
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="hidden text-muted-foreground sm:inline-flex"
            >
              <Link to="/help" aria-label="Documentation">
                <BookOpen />
              </Link>
            </Button>
            <span className="mx-1 hidden h-6 border-l border-border sm:block" />
            <Button
              variant="ghost"
              asChild
              className="size-8 rounded-full bg-amber/15 p-0 text-[10px] text-amber"
            >
              <Link to="/settings" aria-label="Your profile">
                AM
              </Link>
            </Button>
          </div>
        </header>
        <main className="page-content w-full flex-1 fade-in">{children}</main>
        <footer className="flex justify-between gap-4 border-t border-border px-8 py-4 text-[10px] text-muted-foreground">
          <span>© 2026 ChatFlow AI</span>
          <span className="flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-success" />
            Demo workspace · UI prototype
          </span>
        </footer>
      </div>
      <ChatbotWizard />
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Search your workspace</DialogTitle>
            <DialogDescription>Find a page or assistant.</DialogDescription>
          </DialogHeader>
          <SearchInput value={query} onChange={setQuery} placeholder="Search pages and chatbots…" />
          <div className="space-y-1">
            {nav
              .filter((n) => n.name.toLowerCase().includes(query.toLowerCase()))
              .map((n) => (
                <Button key={n.to} asChild variant="ghost" className="w-full justify-start">
                  <Link to={n.to} onClick={() => setSearchOpen(false)}>
                    <n.icon />
                    {n.name}
                  </Link>
                </Button>
              ))}
            {bots
              .filter((b) => query && b.name.toLowerCase().includes(query.toLowerCase()))
              .map((b) => (
                <Button key={b.id} asChild variant="ghost" className="w-full justify-start">
                  <Link
                    to="/chatbots/$id/studio"
                    params={{ id: b.id }}
                    onClick={() => setSearchOpen(false)}
                  >
                    <Bot />
                    {b.name}
                  </Link>
                </Button>
              ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
