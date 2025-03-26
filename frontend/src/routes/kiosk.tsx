import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/kiosk")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="px-4">Hello "/kiosk"!</div>;
}
