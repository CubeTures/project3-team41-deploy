import { createFileRoute } from "@tanstack/react-router";
import DataTable from "@/components/DataTable/DataTable";
import { Definition } from "@/components/DataTable/DataTableTypes";
import { z } from "zod";
import { API_URL } from "@/lib/constants";
import { ok } from "@/lib/fetchUtils";

export const Route = createFileRoute("/edit/menu")({
	component: RouteComponent,
});

interface MenuItem {
	item: string;
	price: number;
	description: string;
	ingredients: string[];
}

const definition: Definition<MenuItem>[] = [
	{
		primaryKey: true,
		accessorKey: "item",
		header: "Item",
		sortable: true,
		type: z.string().nonempty(),
	},
	{
		accessorKey: "price",
		header: "Price",
		sortable: true,
		cell: (row) => {
			const amount = parseFloat(row.getValue("price"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div>{formatted}</div>;
		},
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "description",
		header: "Description",
		sortable: true,
		type: z.string().nonempty(),
	},
	{
		accessorKey: "ingredients",
		header: "Ingredients",
		sortable: true,
		cell: (row) => {
			const ingredients = row.getValue<string[]>("ingredients");
			return <div>{ingredients.join(", ")}</div>;
		},
		type: z.preprocess((obj): string[] => {
			if (Array.isArray(obj)) {
				return obj;
			} else if (typeof obj === "string") {
				return obj.split(",");
			} else {
				return [];
			}
		}, z.array(z.string().nonempty()).nonempty()),
	},
];

function RouteComponent() {
	async function onGet(): Promise<MenuItem[]> {
		const res = await ok(
			fetch(`${API_URL}/edit/menu`, {
				method: "GET",
			})
		);
		return res.json();
	}

	async function onCreate(entry: MenuItem) {
		console.log("Create Start");
		await ok(
			fetch(`${API_URL}/edit/menu`, {
				method: "POST",
				body: JSON.stringify(entry),
			})
		);
		console.log("Create End");
	}

	async function onUpdate(from: MenuItem, to: MenuItem) {
		console.log("Update Start");
		await ok(
			fetch(`${API_URL}/edit/menu`, {
				method: "PUT",
				body: JSON.stringify({ from, to }),
			})
		);
		console.log("Update End");
	}

	async function onDelete(entry: MenuItem) {
		console.log("Delete Start");
		await ok(
			fetch(`${API_URL}/edit/menu`, {
				method: "DELETE",
				body: JSON.stringify(entry),
			})
		);
		console.log("Delete End");
	}

	return (
		<div className="px-4 flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Edit Menu</h1>
			<DataTable<MenuItem>
				queryKey={["edit", "menu"]}
				definition={definition}
				defaultValues={{
					item: "",
					price: 0,
					description: "",
					ingredients: [],
				}}
				onGet={onGet}
				onCreate={onCreate}
				onUpdate={onUpdate}
				onDelete={onDelete}
			/>
		</div>
	);
}
