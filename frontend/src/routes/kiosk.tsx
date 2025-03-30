import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/constants";
import { useEffect } from "react";
import { ok } from "@/lib/fetchUtils";

interface MenuItem {
	item: string;
	price: number;
	description: string;
	ingredients: string[];
}


export const Route = createFileRoute("/kiosk")({
	component: RouteComponent,
});

function RouteComponent() {
	async function getMenu() {
		const res = await ok(
			fetch(`${API_URL}/edit/menu`, {
				method: "GET",
			})
		);
		return res.json();
	}
	console.log("Fetching menu...");
	getMenu().then(menu => console.log("Menu fetched: ", menu));
	const buttons = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6", "Item 7", "Item 8", "Item 9"];

	return (
		// <Button style={{width : "10px", height : "10px"}}>
		// 	<Link to="/">Exit</Link>
		// </Button>
		//create a grid of buttons that is similar to a kiosk
		// with a button for each item in the menu
		
		<div className="grid grid-cols-4 gap-4">
			{buttons.map((label, index) => (
				<Button
					key={index}
					className="col-span-1"
					onClick={() => window.location.href = `/${label.toLowerCase()}`}
				>
					{label}
				</Button>
			))}
		</div>
	);
}
