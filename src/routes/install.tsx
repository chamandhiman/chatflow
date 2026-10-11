import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/chatflow/app-layout";
import { pageHead } from "@/components/chatflow/shared";
import { Install } from "@/features/install";
export const Route = createFileRoute("/install")({
  head: () =>
    pageHead(
      "Website Installation",
      "Configure and preview an illustrative website widget installation.",
    ),
  component: Page,
});
function Page() {
  return (
    <AppLayout>
      <Install />
    </AppLayout>
  );
}
