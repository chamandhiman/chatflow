import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/chatflow/marketing-layout";
import { MarketingSection } from "@/features/marketing";
import { pageHead } from "@/components/chatflow/shared";
export const Route = createFileRoute("/pricing")({
  head: () => pageHead("Pricing", "Explore ChatFlow AI pricing."),
  component: Page,
});
function Page() {
  return (
    <MarketingLayout>
      <MarketingSection section="pricing" />
    </MarketingLayout>
  );
}
