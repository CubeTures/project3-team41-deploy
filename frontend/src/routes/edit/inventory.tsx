import { createFileRoute } from "@tanstack/react-router";
import DataTable from "@/components/DataTable/DataTable";
import { Definition } from "@/components/DataTable/DataTableTypes";
import { z } from "zod";
import { API_URL } from "@/lib/constants";
import { ok } from "@/lib/fetchUtils";

export const Route = createFileRoute("/edit/inventory")({
	component: RouteComponent,
});

interface Ingredient {
	ingredient: string;
	cost: number;
	quantity: number;
	allergens: string[];
}

const definition: Definition<Ingredient>[] = [
	{
		primaryKey: true,
		accessorKey: "ingredient",
		header: "Ingredient",
		sortable: true,
		type: z.string().nonempty(),
	},
	{
		accessorKey: "cost",
		header: "Cost",
		sortable: true,
		cell: (row) => {
			const amount = parseFloat(row.getValue("cost"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(amount);

			return <div>{formatted}</div>;
		},
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "quantity",
		header: "Quantity",
		sortable: true,
		cell: (row) => {
			const amount = parseInt(row.getValue("quantity"));
			return <div>{amount.toLocaleString()}</div>;
		},
		type: z.coerce.number().min(0),
	},
	{
		accessorKey: "allergens",
		header: "Allergens",
		type: z.preprocess((obj): string[] => {
			if (Array.isArray(obj)) {
				return obj;
			} else if (typeof obj === "string") {
				return obj.split(",");
			} else {
				return [];
			}
		}, z.array(z.string().nonempty())),
	},
];

function RouteComponent() {
	async function onGet() {
		const res = await ok(fetch(`${API_URL}/edit/inventory`));
		return res.json();
	}

	async function onCreate(ingredient: Ingredient) {
		await ok(
			fetch(`${API_URL}/edit/inventory`, {
				method: "POST",
				body: JSON.stringify(ingredient),
			})
		);
	}

	async function onUpdate(from: Ingredient, to: Ingredient) {
		await ok(
			fetch(`${API_URL}/edit/inventory`, {
				method: "PUT",
				body: JSON.stringify({ from, to }),
			})
		);
	}

	async function onDelete(ingredient: Ingredient) {
		await ok(
			fetch(`${API_URL}/edit/inventory`, {
				method: "DELETE",
				body: JSON.stringify(ingredient),
			})
		);
	}

	return (
		<div className="px-4 flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Edit Inventory</h1>
			<DataTable<Ingredient>
				queryKey={["edit", "inventory"]}
				definition={definition}
				defaultValues={{
					ingredient: "",
					cost: 0,
					quantity: 0,
					allergens: [],
				}}
				onGet={onGet}
				onCreate={onCreate}
				onUpdate={onUpdate}
				onDelete={onDelete}
			/>
		</div>
	);
}
