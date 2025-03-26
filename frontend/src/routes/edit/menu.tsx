import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import DataTable from "@/components/DataTable/DataTable";
import { Definition } from "@/components/DataTable/DataTableTypes";
import { z } from "zod";
import { API_URL } from "@/lib/constants";

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
			const ingredients = row.getValue("ingredients") as string[];
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
	const { status, data, error } = useQuery({
		queryKey: ["menu"],
		queryFn: get,
	});

	if (status === "pending") {
		return <h1>Loading...</h1>;
	}

	if (status === "error") {
		return <h1>There was an error when loading the data.</h1>;
	}

	async function get() {
		const res = await fetch(`${API_URL}/menu`, { method: "GET" });
		if (!res.ok) {
			throw new Error("Network response was not ok");
		}
		return res.json();
	}

	async function onCreate(entry: MenuItem) {
		console.log(entry);
		const res = await fetch(`${API_URL}/menu`, {
			method: "PUT",
			body: JSON.stringify(entry),
		});
		console.log(res);
	}

	return (
		<div className="px-4 flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Edit Menu</h1>
			<DataTable<MenuItem>
				definition={definition}
				data={data}
				defaultValues={{
					item: "",
					price: 0,
					description: "",
					ingredients: [],
				}}
				onCreate={(menuItem) =>
					console.log(`Create menu item ${JSON.stringify(menuItem)}`)
				}
				onUpdate={(from, to) =>
					console.log(
						`Update menu item ${JSON.stringify(from)} to ${JSON.stringify(to)}`
					)
				}
				onDelete={(menuItem) =>
					console.log(`Delete menu item ${JSON.stringify(menuItem)}`)
				}
			/>
		</div>
	);
}
