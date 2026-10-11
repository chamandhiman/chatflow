import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/chatflow/app-layout";
import { pageHead } from "@/components/chatflow/shared";
import { Conversations } from "@/features/conversations";
export const Route = createFileRoute("/conversations")({
  head: () =>
    pageHead("Conversations", "Review customer conversations and collaborate with your team."),
  component: Page,
});
function Page() {
  return (
    <AppLayout>
      <Conversations />
    </AppLayout>
  );
}
