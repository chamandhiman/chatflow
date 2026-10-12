import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { Field } from "./shared";
import { toast } from "sonner";
import { Lock, Mail, User, Building, AlertCircle, ArrowRight, Loader2, Sparkles } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "signin" | "signup";
  onSuccess?: () => void;
}

export function AuthModal({
  open,
  onOpenChange,
  defaultTab = "signin",
  onSuccess,
}: AuthModalProps) {
  const { signIn, signUp, isConfigured, setMockMode } = useAuth();
  const [tab, setTab] = useState<"signin" | "signup">(defaultTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [workspace, setWorkspace] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      onOpenChange(false);
      onSuccess?.();
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
    onOpenChange(false);
    toast.info("Continuing in Demo / Mock Workspace Mode");
    onSuccess?.();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border bg-card p-7">
        <DialogHeader>
          <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <Lock className="size-5" />
          </div>
          <DialogTitle className="font-display text-xl">
            {tab === "signin" ? "Welcome back" : "Create your account"}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {tab === "signin"
              ? "Sign in to access your AI assistants and conversations."
              : "Set up your multi-tenant workspace on ChatFlow AI."}
          </DialogDescription>
        </DialogHeader>

        {!isConfigured && (
          <div className="mb-4 rounded-lg border border-amber/30 bg-amber/10 p-3.5 text-xs">
            <div className="flex items-center gap-2 font-medium text-amber">
              <AlertCircle className="size-4 shrink-0" />
              <span>Firebase credentials not configured</span>
            </div>
            <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
              Add your Firebase Web SDK config to <code className="text-foreground">.env.local</code> to test live authentication, or continue immediately in Demo Mode.
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

        <div className="mb-4 flex rounded-md border border-border p-1">
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
      </DialogContent>
    </Dialog>
  );
}
