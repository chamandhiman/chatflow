import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/chatflow/app-layout";
import { pageHead } from "@/components/chatflow/shared";
import { Settings } from "@/features/settings";
export const Route = createFileRoute("/settings")({
  head: () => pageHead("Team & Settings", "Manage your profile, team, and workspace preferences."),
  component: Page,
});
function Page() {
  return (
    <AppLayout>
      <Settings />
    </AppLayout>
  );
}
