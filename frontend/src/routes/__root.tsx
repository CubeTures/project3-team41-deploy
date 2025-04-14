import AppSidebar from "@/components/AppSidebar";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Translate } from "@/components/translate";

export const Route = createRootRoute({
	component: () => (
		<div>
		<AppSidebar>
			<Outlet />
			{/* <TanStackRouterDevtools /> */}
		</AppSidebar>

		<Translate/>
		</div>
	),
});
