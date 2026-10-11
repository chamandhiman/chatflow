import { useState } from "react";
import { Save, Upload, Plus, Trash2, Copy, ShieldCheck, Users, Bell, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader, Segments, Field, ToggleRow, PanelHeading } from "@/components/chatflow/shared";
import { toast } from "sonner";
export function Settings() {
  const [tab, setTab] = useState("Profile");
  const [name, setName] = useState("Alex Morgan");
  const [email, setEmail] = useState("alex@acme.com");
  const [workspace, setWorkspace] = useState("Acme Workspace");
  const [invite, setInvite] = useState("");
  const [team, setTeam] = useState([
    { name: "Alex Morgan", email: "alex@acme.com", role: "Owner" },
    { name: "Jordan Lee", email: "jordan@acme.com", role: "Admin" },
    { name: "Taylor Smith", email: "taylor@acme.com", role: "Member" },
  ]);
  const [avatar, setAvatar] = useState("");
  const [saved, setSaved] = useState(false);
  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    toast.success("Settings saved for this prototype session");
  }
  return (
    <>
      <PageHeader title="Team & Settings" description="Your workspace, your way." />
      <div className="mb-8">
        <Segments
          options={["Profile", "Workspace", "Team", "Notifications", "Security", "API Keys"]}
          value={tab}
          onChange={setTab}
        />
      </div>
      <div className="max-w-3xl">
        <h2 className="mb-2 text-lg font-bold">{tab === "Profile" ? "Personal profile" : tab}</h2>
        <p className="mb-7 text-xs text-muted-foreground">
          {tab === "Profile"
            ? "Manage your personal information and preferences."
            : `Manage your ${tab.toLowerCase()} preferences for this workspace.`}
        </p>
        <form onSubmit={save}>
          {tab === "Profile" ? (
            <>
              <div className="mb-7 flex items-center gap-5">
                <span className="grid size-16 place-items-center rounded-full bg-amber/15 text-xl font-semibold text-amber">
                  AM
                </span>
                <label className="cursor-pointer rounded-md border border-border px-3 py-2 text-xs">
                  <span className="flex items-center gap-2">
                    <Upload className="size-3.5" />
                    {avatar || "Change avatar"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setAvatar(e.target.files?.[0]?.name || "")}
                  />
                </label>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setSaved(false);
                    }}
                  />
                </Field>
                <Field label="Email address">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
              </div>
              <Field label="Job title">
                <input placeholder="e.g. Customer Success Manager" defaultValue="Founder & CEO" />
              </Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Timezone">
                  <select>
                    <option>Pacific Time (UTC−08:00)</option>
                    <option>UTC</option>
                    <option>India Standard Time (UTC+05:30)</option>
                    <option>Central European Time</option>
                  </select>
                </Field>
                <Field label="Language">
                  <select>
                    <option>English</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Spanish</option>
                  </select>
                </Field>
              </div>
            </>
          ) : tab === "Workspace" ? (
            <>
              <Field label="Workspace name">
                <input required value={workspace} onChange={(e) => setWorkspace(e.target.value)} />
              </Field>
              <Field label="Company website">
                <input type="url" defaultValue="https://example.com" />
              </Field>
              <Field label="Industry">
                <select>
                  <option>Software & technology</option>
                  <option>E-commerce</option>
                  <option>Healthcare</option>
                  <option>Professional services</option>
                </select>
              </Field>
              <Field label="Workspace description">
                <textarea defaultValue="Our customer support and sales assistants, all in one place." />
              </Field>
            </>
          ) : tab === "Team" ? (
            <>
              <div className="mb-6 flex gap-3">
                <input
                  className="select-control min-w-0 flex-1"
                  aria-label="Invite email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={invite}
                  onChange={(e) => setInvite(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invite)) {
                      toast.error("Enter a valid email address");
                      return;
                    }
                    setTeam((t) => [
                      ...t,
                      { name: "Pending invite", email: invite, role: "Member" },
                    ]);
                    setInvite("");
                    toast.success("Sample invitation added — no email sent");
                  }}
                >
                  <Plus />
                  Invite member
                </Button>
              </div>
              <div className="panel overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Member</th>
                      <th>Role</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    {team.map((t, i) => (
                      <tr key={t.email}>
                        <td>
                          <span className="font-medium">{t.name}</span>
                          <span className="mt-1 block text-[10px] text-muted-foreground">
                            {t.email}
                          </span>
                        </td>
                        <td>
                          <select
                            aria-label={`Role for ${t.name}`}
                            disabled={i === 0}
                            value={t.role}
                            onChange={(e) =>
                              setTeam((ts) =>
                                ts.map((x) =>
                                  x.email === t.email ? { ...x, role: e.target.value } : x,
                                ),
                              )
                            }
                            className="rounded border border-border bg-background p-1.5 text-xs"
                          >
                            <option>Owner</option>
                            <option>Admin</option>
                            <option>Member</option>
                          </select>
                        </td>
                        <td>
                          {i > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Remove ${t.name}`}
                              onClick={() => setTeam((ts) => ts.filter((x) => x.email !== t.email))}
                            >
                              <Trash2 />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : tab === "Notifications" ? (
            <>
              <ToggleRow
                label="New conversations"
                description="Receive an alert when a visitor starts a conversation."
              />
              <ToggleRow
                label="Lead captured"
                description="Get notified about new leads from your assistants."
              />
              <ToggleRow
                label="Usage alerts"
                description="Know when you are approaching your message limit."
              />
              <ToggleRow
                label="Weekly summary"
                description="Get a weekly snapshot of your workspace."
              />
              <ToggleRow
                label="Product updates"
                description="News about ChatFlow AI."
                initial={false}
              />
            </>
          ) : tab === "Security" ? (
            <>
              <div className="mb-5 flex gap-3 rounded-lg border border-border bg-card p-5">
                <ShieldCheck className="shrink-0 text-success" />
                <div>
                  <h3 className="font-semibold">Workspace security</h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Security controls are UI examples only; no authentication provider is connected.
                  </p>
                </div>
              </div>
              <ToggleRow
                label="Two-factor authentication"
                description="Example two-step sign-in preference."
                initial={false}
              />
              <Field label="Current password">
                <input
                  type="password"
                  placeholder="Enter current password"
                  autoComplete="current-password"
                />
              </Field>
              <Field label="New password">
                <input
                  type="password"
                  minLength={8}
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
                />
              </Field>
            </>
          ) : (
            <div className="panel p-7">
              <KeyRound className="mb-4 size-8 text-primary" />
              <h3 className="mb-2 font-bold">Connect your custom workflows</h3>
              <p className="mb-5 text-xs text-muted-foreground">
                API access will be available when a real service is connected. No secrets are
                created or stored in this prototype.
              </p>
              <div className="mb-5 rounded-md border border-border bg-background p-4 font-mono text-xs text-muted-foreground">
                API key placeholder · not configured
              </div>
              <Button type="button" variant="outline" disabled>
                Create API key
              </Button>
            </div>
          )}
          {tab !== "API Keys" && (
            <div className="mt-7 flex items-center gap-3 border-t border-border pt-6">
              <Button type="submit">
                <Save />
                Save changes
              </Button>
              {saved && (
                <span role="status" className="text-xs text-success">
                  Saved for this session
                </span>
              )}
            </div>
          )}
        </form>
      </div>
    </>
  );
}
