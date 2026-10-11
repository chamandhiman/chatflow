import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/chatflow/app-layout";
import { pageHead } from "@/components/chatflow/shared";
import { Billing } from "@/features/billing";
export const Route = createFileRoute("/billing")({
  head: () =>
    pageHead("Billing & Usage", "Compare example subscription plans and view sample usage."),
  component: Page,
});
function Page() {
  return (
    <AppLayout>
      <Billing />
    </AppLayout>
  );
}
