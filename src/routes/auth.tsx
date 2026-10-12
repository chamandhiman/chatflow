import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/chatflow/marketing-layout";
import { pageHead } from "@/components/chatflow/shared";
import { useAuth } from "@/lib/auth-context";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/chatflow/shared";
import { Lock, Mail, User, Building, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => pageHead("Sign In / Register", "Access your ChatFlow AI workspace."),
  component: AuthPage,
});

function AuthPage() {
  const { user, signIn, signUp, isConfigured, setMockMode } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      navigate({ to: "/dashboard" });
    }
  }, [user, navigate]);

  function mapFirebaseError(errCode: string): string {
    switch (errCode) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
      case "auth/wrong-password":
        return "Invalid email address or password.";
      case "auth/email-already-in-use":
        return "An account with this email already exists.";
      case "auth/weak-password":
        return "Password must be at least 6 characters.";
      case "auth/invalid-email":
        return "Please enter a valid email address.";
      default:
        return errCode || "Authentication failed. Please try again.";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (tab === "signin") {
        await signIn(email, password);
        toast.success("Signed in successfully");
      } else {
        if (!name.trim()) {
          throw new Error("Please enter your name");
        }
        await signUp(email, password, name, workspace);
        toast.success("Account and private workspace created!");
      }
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      const msg = err.code ? mapFirebaseError(err.code) : err.message;
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  function handleDemoMode() {
    setMockMode(true);
    toast.info("Entering Demo / Mock Workspace");
    navigate({ to: "/dashboard" });
  }

  return (
    <MarketingLayout>
      <div className="mx-auto flex min-h-[calc(100vh-160px)] max-w-md items-center justify-center px-4 py-12">
        <div className="panel w-full p-8 shadow-xl">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Lock className="size-6" />
            </div>
            <h1 className="font-display text-2xl font-bold">
              {tab === "signin" ? "Welcome to ChatFlow AI" : "Create your workspace"}
            </h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {tab === "signin"
                ? "Sign in to manage your AI assistants and conversations."
                : "Get started with your multi-tenant AI assistant workspace."}
            </p>
          </div>

          {!isConfigured && (
            <div className="mb-6 rounded-lg border border-amber/30 bg-amber/10 p-4 text-xs">
              <div className="flex items-center gap-2 font-medium text-amber">
                <AlertCircle className="size-4 shrink-0" />
                <span>Firebase credentials not configured</span>
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
                Live authentication connects when you add your Firebase Web SDK config to{" "}
                <code className="text-foreground">.env.local</code>. You can explore all features right now in Demo Mode.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full border-amber/40 text-xs"
                onClick={handleDemoMode}
              >
                <Sparkles className="size-3.5" />
                Continue in Demo Mode
              </Button>
            </div>
          )}

          <div className="mb-6 flex rounded-md border border-border p-1">
            <Button
              type="button"
              variant={tab === "signin" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                setTab("signin");
                setError(null);
              }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant={tab === "signup" ? "secondary" : "ghost"}
              size="sm"
              className="flex-1 text-xs"
              onClick={() => {
                setTab("signup");
                setError(null);
              }}
            >
              Create Account
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "signup" && (
              <>
                <Field label="Full Name">
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      className="pl-9"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                    />
                  </div>
                </Field>
                <Field label="Workspace Name">
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <input
                      className="pl-9"
                      value={workspace}
                      onChange={(e) => setWorkspace(e.target.value)}
                      placeholder="Acme Workspace"
                    />
                  </div>
                </Field>
              </>
            )}

            <Field label="Email Address">
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  className="pl-9"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                />
              </div>
            </Field>

            <Field label="Password">
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <input
                  className="pl-9"
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                />
              </div>
            </Field>

            {error && (
              <p role="alert" className="text-xs text-destructive">
                {error}
              </p>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="primary-action w-full"
                disabled={loading || !isConfigured}
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Please wait…
                  </>
                ) : tab === "signin" ? (
                  <>
                    Sign In
                    <ArrowRight />
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </MarketingLayout>
  );
}
