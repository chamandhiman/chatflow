import { createFileRoute } from "@tanstack/react-router";
import { MarketingLayout } from "@/components/chatflow/marketing-layout";
import { MarketingSection } from "@/features/marketing";
import { pageHead } from "@/components/chatflow/shared";
export const Route = createFileRoute("/product")({
  head: () => pageHead("Product", "Explore ChatFlow AI product."),
  component: Page,
});
function Page() {
  return (
    <MarketingLayout>
      <MarketingSection section="product" />
    </MarketingLayout>
  );
}
