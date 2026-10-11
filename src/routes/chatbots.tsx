import { createFileRoute, Outlet } from "@tanstack/react-router";
export const Route = createFileRoute("/chatbots")({ component: Layout });
function Layout() {
  return <Outlet />;
}
