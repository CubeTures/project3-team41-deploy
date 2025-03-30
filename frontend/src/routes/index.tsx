import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import EmployeeLogin from "@/components/EmployeeLogin";
import { API_URL } from "@/lib/constants";

export const Route = createFileRoute("/")({
	component: Index,
});

// Make index.tsx into the login screen
function Index() {
	// Create a request to the backend at "/" and parse the request
	// useEffect(() => {
	// 	async function getHome() {
	// 		const res = await fetch("http://localhost:3000/");
	// 		const json = await res.json();
	// 		console.log(json["status"]);
	// 	}

	// 	getHome();
	// }, []);

	return (
		<div>
			<h1>Welcome</h1>
			<br />
			<Button
				onClick={() => {
					window.location.href = `${API_URL}/google`;
				}}
			>
				Login with Google
			</Button>

			<Link to="/kiosk">
				<Button>Login as Guest</Button>
			</Link>

			<EmployeeLogin />
		</div>
	);
}
