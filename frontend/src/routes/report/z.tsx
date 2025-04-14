import { Button } from "@/components/ui/button";
import XZReport from "@/components/XZReport";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/report/z")({
	component: RouteComponent,
});

function RouteComponent() {
	const [show, setShow] = useState(false);

	return (
		<div>
			{show === false ? (
				<div className="flex justify-center">
					<Button onClick={() => setShow(true)}>Create Report</Button>
				</div>
			) : (
				<XZReport report={"zreport"} />
			)}
		</div>
	);
}
