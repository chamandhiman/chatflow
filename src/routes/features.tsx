import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/chatflow/marketing-layout";
import { MarketingSection } from "@/features/marketing";
import { pageHead } from "@/components/chatflow/shared";
export const Route = createFileRoute("/features")({
  head: () => pageHead("Features", "Explore ChatFlow AI features."),
  component: Page,
});
function Page() {
  return (
    <MarketingLayout>
      <MarketingSection section="features" />
    </MarketingLayout>
  );
}
