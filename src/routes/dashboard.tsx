import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/chatflow/app-layout";
import { pageHead } from "@/components/chatflow/shared";
import { Dashboard } from "@/features/dashboard";
export const Route = createFileRoute("/dashboard")({
  head: () =>
    pageHead("Overview", "Your AI assistants, conversation activity, and workspace usage."),
  component: Page,
});
function Page() {
  return (
    <AppLayout>
      <Dashboard />
    </AppLayout>
  );
}
