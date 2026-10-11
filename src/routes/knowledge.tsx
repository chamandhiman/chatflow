import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/chatflow/app-layout";
import { pageHead } from "@/components/chatflow/shared";
import { Knowledge } from "@/features/knowledge";
export const Route = createFileRoute("/knowledge")({
  head: () =>
    pageHead("Knowledge Base", "Organize websites, documents, and FAQs for your AI assistants."),
  component: Page,
});
function Page() {
  return (
    <AppLayout>
      <Knowledge />
    </AppLayout>
  );
}
