import XZReport from "@/components/XZReport";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/report/x")({
	component: RouteComponent,
});

function RouteComponent() {
	return <XZReport report={"xreport"} />;
}
