import AppSidebar from "@/components/AppSidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
	component: () => (
		<AppSidebar>
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</AppSidebar>
	),
});
